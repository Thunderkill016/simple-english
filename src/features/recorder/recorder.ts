// Browser-native recording (MediaRecorder) — practice evidence only.
// No scoring, no ASR, no competence inference (ADR-0003 / Task 006 Phase 6).

export type RecorderSupport = "ok" | "unsupported" | "denied";

export function recorderSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  );
}

export interface Recording {
  url: string;
  blob: Blob;
  stopTracks: () => void;
}

/** request mic + return a started recorder; throws RecorderError on denial */
export async function startRecording(): Promise<{
  recorder: MediaRecorder;
  stream: MediaStream;
  finish: () => Promise<Recording>;
}> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.start();
  return {
    recorder,
    stream,
    finish: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: recorder.mimeType });
          stream.getTracks().forEach((t) => t.stop());
          resolve({ url: URL.createObjectURL(blob), blob, stopTracks: () => {} });
        };
        recorder.stop();
      }),
  };
}
