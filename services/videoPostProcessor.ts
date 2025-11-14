import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import closingClip916 from '../attached_assets/9_16_video.mp4';
import closingClip169 from '../attached_assets/16_9_video.mp4';

const OUTPUT_NAME = 'viralis_processed.mp4';
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
  outputFileName: string;
  mainVideoDuration: number;
  targetWidth: number;
  targetHeight: number;
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

const getOutputFileName = (inputName?: string) => {
  const base = inputName ? inputName.replace(/\.mp4$/i, '') : 'output';
  return `${base}.mp4`;
};

const closingClipMap: Record<'9:16' | '16:9', string> = {
  '9:16': closingClip916,
  '16:9': closingClip169,
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

    const closingClipSrc = closingClipMap[detectedAspect] ?? closingClipMap['9:16'];
    const closingBuffer = await fetchFile(closingClipSrc);
    const closingMetadata = await readVideoMetadata(closingBuffer, 'video/mp4');

    const detectedAspect: '9:16' | '16:9' =
      metadata.height >= metadata.width ? '9:16' : '16:9';
    const targetWidth =
      metadata.width || resolutionMap[options.resolutionLabel][detectedAspect].width;
    const targetHeight =
      metadata.height || resolutionMap[options.resolutionLabel][detectedAspect].height;

    log.push(`Aspect détecté: ${detectedAspect} (video ${metadata.width}x${metadata.height})`);

    await ffmpeg.writeFile('main.mp4', mainBuffer);
    await ffmpeg.writeFile('closing.mp4', closingBuffer);

    const safeDuration = (duration: number) => (Number.isFinite(duration) && duration > 0 ? duration : 0.1);

    const videoFilterMain = `[0:v]scale=${targetWidth}:${targetHeight},setsar=1,format=yuv420p,setsar=1[v0]`;
    const videoFilterClosing = `[1:v]scale=${targetWidth}:${targetHeight},setsar=1,format=yuv420p,setsar=1[v1]`;

    const audioFilterMain = metadata.hasAudio
      ? `[0:a]aresample=48000,apad,atrim=0:${safeDuration(metadata.duration)},asetpts=PTS-STARTPTS[a0]`
      : `anullsrc=channel_layout=stereo:sample_rate=48000,atrim=0:${safeDuration(
          metadata.duration,
        )},asetpts=PTS-STARTPTS[a0]`;

    const audioFilterClosing = closingMetadata.hasAudio
      ? `[1:a]aresample=48000,apad,atrim=0:${safeDuration(closingMetadata.duration)},asetpts=PTS-STARTPTS[a1]`
      : `anullsrc=channel_layout=stereo:sample_rate=48000,atrim=0:${safeDuration(
          closingMetadata.duration,
        )},asetpts=PTS-STARTPTS[a1]`;

    const filterGraph = [
      videoFilterMain,
      videoFilterClosing,
      audioFilterMain,
      audioFilterClosing,
      '[v0][a0][v1][a1]concat=n=2:v=1:a=1[vout][aout]',
    ].join(';');

    const args: string[] = [
      '-i',
      'main.mp4',
      '-i',
      'closing.mp4',
      '-filter_complex',
      filterGraph,
      '-map',
      '[vout]',
      '-map',
      '[aout]',
      '-c:v',
      'libx264',
      '-preset',
      VIDEO_PRESET,
      '-crf',
      VIDEO_CRF,
      '-movflags',
      '+faststart',
      OUTPUT_NAME,
    ];

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(OUTPUT_NAME);
    const finalBlob = new Blob([data.buffer], { type: 'video/mp4' });

    await Promise.all([
      ffmpeg.deleteFile?.('main.mp4').catch(() => {}),
      ffmpeg.deleteFile?.('closing.mp4').catch(() => {}),
      ffmpeg.deleteFile?.(OUTPUT_NAME).catch(() => {}),
    ]);

    const outputName = getOutputFileName(options.preferredFileName);

    return {
      blob: finalBlob,
      log,
      detectedAspect,
      outputFileName: outputName,
      mainVideoDuration: metadata.duration,
      targetWidth,
      targetHeight,
    };
  } catch (error) {
    console.error('Erreur lors du post-traitement vidéo :', error);
    log.push('Erreur lors du post-traitement vidéo.');
    return null;
  }
};

