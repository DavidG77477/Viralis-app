import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import watermarkImage from '../attached_assets/viralis_watermark.png';

const OUTPUT_NAME = 'viralis_watermarked.mp4';
const VIDEO_PRESET = 'ultrafast';
const VIDEO_CRF = '24';

let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoading: Promise<void> | null = null;

interface AppendClosingClipOptions {
  resolutionLabel: '720p' | '1080p';
  requestedAspectRatio: '9:16' | '16:9';
  preferredFileName?: string;
}

export interface AppendClosingClipResult {
  blob: Blob;
  log: string[];
  detectedAspect: '9:16' | '16:9';
  closingClipFile: string;
  outputFileName: string;
  mainVideoDuration: number;
  targetWidth: number;
  targetHeight: number;
  watermarkApplied: boolean;
}

const resolutionMap: Record<
  AppendClosingClipOptions['resolutionLabel'],
  Record<'9:16' | '16:9', { width: number; height: number }>
> = {
  '720p': {
    '9:16': { width: 720, height: 1280 },
    '16:9': { width: 1280, height: 720 },
  },
  '1080p': {
    '9:16': { width: 1080, height: 1920 },
    '16:9': { width: 1920, height: 1080 },
  },
};

const loadFFmpeg = async () => {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();

    const isDev = typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production';
    if (isDev) {
      ffmpegInstance.on('log', ({ message }) => {
        console.debug('[ffmpeg]', message);
      });
    }
  }

  if (!ffmpegInstance.loaded) {
    if (!ffmpegLoading) {
      ffmpegLoading = ffmpegInstance.load();
    }
    await ffmpegLoading;
  }

  return ffmpegInstance;
};

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  hasAudio: boolean;
}

const readVideoMetadata = (buffer: Uint8Array, mimeType: string): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer.buffer], { type: mimeType });
    const video = document.createElement('video');
    const url = URL.createObjectURL(blob);
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
      const anyVideo = video as HTMLVideoElement & {
        mozHasAudio?: boolean;
        webkitAudioDecodedByteCount?: number;
        audioTracks?: MediaTrackList;
      };
      const metadata: VideoMetadata = {
        duration: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        hasAudio:
          Boolean(anyVideo.mozHasAudio) ||
          Boolean(anyVideo.webkitAudioDecodedByteCount && anyVideo.webkitAudioDecodedByteCount > 0) ||
          Boolean(anyVideo.audioTracks && anyVideo.audioTracks.length > 0),
      };
      URL.revokeObjectURL(url);
      resolve(metadata);
    };
    video.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
  });
};

const getOutputFileName = (inputName?: string, withWatermark: boolean = true) => {
  const base = inputName ? inputName.replace(/\.mp4$/i, '') : 'output';
  return `${base}${withWatermark ? '_watermarked' : ''}.mp4`;
};

export const appendClosingClip = async (
  videoUrl: string,
  options: AppendClosingClipOptions,
): Promise<AppendClosingClipResult | null> => {
  const log: string[] = [];

  try {
    const ffmpeg = await loadFFmpeg();
    const mainBuffer = await fetchFile(videoUrl);
    const metadata = await readVideoMetadata(mainBuffer, 'video/mp4');

    const detectedAspect: '9:16' | '16:9' =
      metadata.height >= metadata.width ? '9:16' : '16:9';
    const targetWidth =
      metadata.width || resolutionMap[options.resolutionLabel][detectedAspect].width;
    const targetHeight =
      metadata.height || resolutionMap[options.resolutionLabel][detectedAspect].height;

    log.push(`Aspect détecté: ${detectedAspect} (video ${metadata.width}x${metadata.height})`);

    const originalBlob = new Blob([mainBuffer.buffer], { type: 'video/mp4' });
    let watermarkApplied = false;
    let finalBlob = originalBlob;

    await ffmpeg.writeFile('main.mp4', mainBuffer);

    try {
      const watermarkBuffer = await fetchFile(watermarkImage);
      await ffmpeg.writeFile('watermark_image.png', watermarkBuffer);

      const widthFactor = detectedAspect === '9:16' ? 0.18 : 0.14;
      const watermarkWidth = Math.max(128, Math.round(targetWidth * widthFactor));
      const margin = Math.max(28, Math.round(targetWidth * 0.028));
      const amplitude = Math.max(16, Math.min(30, Math.round(targetWidth * 0.022)));
      const segmentDuration = 5;
      const cycleDuration = segmentDuration * 4;
      const progressExpr = `(mod(t,${segmentDuration})/${segmentDuration})`;
      const segExpr = `floor(mod(t,${cycleDuration})/${segmentDuration})`;
      const left = `${margin}`;
      const right = `main_w-overlay_w-${margin}`;
      const top = `${margin}`;
      const bottom = `main_h-overlay_h-${margin}`;
      const sinX = `${amplitude}*sin(t*1.3)`;
      const sinY = `${amplitude}*cos(t*1.7)`;

      const xExpr = `if(eq(${segExpr},0),(${left})+((${right})-(${left}))*${progressExpr}+${sinX},if(eq(${segExpr},1),(${right})+${sinX},if(eq(${segExpr},2),(${right})-((${right})-(${left}))*${progressExpr}+${sinX},(${left})+${sinX})))`;
      const yExpr = `if(eq(${segExpr},0),(${top})+${sinY},if(eq(${segExpr},1),(${top})+((${bottom})-(${top}))*${progressExpr}+${sinY},if(eq(${segExpr},2),(${bottom})+${sinY},(${bottom})-((${bottom})-(${top}))*${progressExpr}+${sinY})))`;

      const overlayFilter = [
        '[0:v]format=yuv420p,setsar=1[v0]',
        `[1:v]scale=${watermarkWidth}:-1,format=rgba,colorchannelmixer=aa=0.9[wm]`,
        `[v0][wm]overlay=${xExpr}:${yExpr}:format=auto[vout]`,
      ].join(';');

      const args: string[] = [
        '-i',
        'main.mp4',
        '-i',
        'watermark_image.png',
        '-filter_complex',
        overlayFilter,
        '-map',
        '[vout]',
        '-c:v',
        'libx264',
        '-preset',
        VIDEO_PRESET,
        '-crf',
        VIDEO_CRF,
        '-movflags',
        '+faststart',
      ];

      if (metadata.hasAudio) {
        args.push('-map', '0:a?', '-c:a', 'copy');
        log.push('Piste audio copiée sans ré-encodage.');
      } else {
        args.push('-an');
        log.push('Aucune piste audio détectée.');
      }

      args.push(OUTPUT_NAME);

      await ffmpeg.exec(args);
      await ffmpeg.deleteFile?.('watermark_image.png').catch(() => {});

      const data = await ffmpeg.readFile(OUTPUT_NAME);
      finalBlob = new Blob([data.buffer], { type: 'video/mp4' });
      watermarkApplied = true;
      log.push('Filigrane dynamique appliqué avec succès.');
    } catch (watermarkError) {
      console.warn('Watermark processing failed, returning original video.', watermarkError);
      log.push('Filigrane non appliqué (erreur de traitement ou ressource manquante).');
    }

    await Promise.all([
      ffmpeg.deleteFile?.('main.mp4').catch(() => {}),
      ffmpeg.deleteFile?.(OUTPUT_NAME).catch(() => {}),
    ]);

    const outputName = getOutputFileName(options.preferredFileName, watermarkApplied);

    return {
      blob: finalBlob,
      log,
      detectedAspect,
      closingClipFile: 'none',
      outputFileName: outputName,
      mainVideoDuration: metadata.duration,
      targetWidth,
      targetHeight,
      watermarkApplied,
    };
  } catch (error) {
    console.error('Erreur lors du post-traitement vidéo :', error);
    log.push('Erreur lors du post-traitement vidéo.');
    return null;
  }
};

