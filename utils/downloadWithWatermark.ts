import watermarkAsset from '../attached_assets/viralis_watermark.png';

export type DownloadProgress =
  | 'preparing-video'
  | 'loading-assets'
  | 'recording'
  | 'finalizing'
  | 'complete';

export interface DownloadWithWatermarkOptions {
  videoSourceUrl: string;
  fileName?: string;
  onProgress?: (stage: DownloadProgress) => void;
  mimeType?: string;
  watermarkUrl?: string;
}

/**
 * Adds the Viralis watermark to the provided video entirely in the browser and triggers a download.
 *
 * This helper relies on the Canvas API + MediaRecorder. It:
 * 1. Fetches the video blob.
 * 2. Draws every frame to a canvas with the watermark composited in the bottom-right corner.
 * 3. Uses MediaRecorder to keep the original audio while recording the canvas stream.
 */
export async function downloadWithWatermark({
  videoSourceUrl,
  fileName = `viralis-${Date.now()}.webm`,
  onProgress,
  mimeType = 'video/webm;codecs=vp9,opus',
  watermarkUrl = watermarkAsset,
}: DownloadWithWatermarkOptions): Promise<void> {
  onProgress?.('preparing-video');

  const response = await fetch(videoSourceUrl);
  if (!response.ok) {
    throw new Error(`Impossible de charger la vidéo source (${response.status})`);
  }
  const videoBlob = await response.blob();
  const videoObjectUrl = URL.createObjectURL(videoBlob);

  try {
    onProgress?.('loading-assets');

    const videoEl = document.createElement('video');
    videoEl.src = videoObjectUrl;
    videoEl.crossOrigin = 'anonymous';
    videoEl.playsInline = true;
    videoEl.muted = true;

    await new Promise<void>((resolve, reject) => {
      const onMeta = () => {
        videoEl.removeEventListener('loadedmetadata', onMeta);
        resolve();
      };
      const onError = () => reject(new Error('Impossible de lire les métadonnées vidéo.'));
      videoEl.addEventListener('loadedmetadata', onMeta, { once: true });
      videoEl.addEventListener('error', onError, { once: true });
    });

    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Contexte Canvas 2D indisponible.');
    }

    const watermarkImage = await loadWatermarkImage(watermarkUrl);

    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaElementSource(videoEl);
    const destinationNode = audioContext.createMediaStreamDestination();
    sourceNode.connect(destinationNode);

    const canvasStream = canvas.captureStream();
    const composedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...destinationNode.stream.getAudioTracks(),
    ]);

    const recordedChunks: BlobPart[] = [];
    const recorder = new MediaRecorder(composedStream, { mimeType });

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    const recordingFinished = new Promise<void>((resolve, reject) => {
      recorder.onstop = () => resolve();
      recorder.onerror = (event) => reject(event.error ?? new Error('Erreur MediaRecorder.'));
    });

    const renderFrame = () => {
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      drawWatermark(ctx, watermarkImage);
      if (!videoEl.ended && !videoEl.paused) {
        scheduleNextFrame(renderFrame, videoEl);
      }
    };

    onProgress?.('recording');
    recorder.start();

    videoEl.currentTime = 0;
    await videoEl.play().catch(() => {
      // Some browsers block play() even after user gesture: retry without muting audio.
      videoEl.muted = false;
      return videoEl.play();
    });

    scheduleNextFrame(renderFrame, videoEl);

    await new Promise<void>((resolve) => {
      videoEl.onended = () => resolve();
    });

    recorder.stop();
    onProgress?.('finalizing');
    await recordingFinished;

    const finalBlob = new Blob(recordedChunks, { type: recorder.mimeType || mimeType });
    triggerDownload(finalBlob, fileName);
    onProgress?.('complete');

    sourceNode.disconnect();
    destinationNode.disconnect();
    await audioContext.close();
  } finally {
    URL.revokeObjectURL(videoObjectUrl);
  }
}

const loadWatermarkImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Impossible de charger le filigrane.'));
    img.src = src;
  });

const drawWatermark = (ctx: CanvasRenderingContext2D, watermark: HTMLImageElement) => {
  const { canvas } = ctx;
  const targetWidth = canvas.width * 0.15;
  const ratio = targetWidth / watermark.width;
  const targetHeight = watermark.height * ratio;
  const margin = 12;

  const x = canvas.width - targetWidth - margin;
  const y = canvas.height - targetHeight - margin;

  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.drawImage(watermark, x, y, targetWidth, targetHeight);
  ctx.restore();
};

const scheduleNextFrame = (
  draw: () => void,
  video: HTMLVideoElement,
) => {
  const callback = () => draw();
  if ('requestVideoFrameCallback' in video) {
    (video as HTMLVideoElement & {
      requestVideoFrameCallback(
        cb: (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => void,
      ): void;
    }).requestVideoFrameCallback(() => callback());
  } else {
    requestAnimationFrame(callback);
  }
};

const triggerDownload = (blob: Blob, fileName: string) => {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
};

