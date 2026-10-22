import { useState, useRef, useEffect } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { useAudioRecorder } from "./useAudioRecorder";

interface AudioDropCardProps {
  title: string;
  description: string;
  audioSrc?: string | null;
  onAudioBytes: (bytes: Uint8Array) => void;
  onClear: () => void;
  isOptional?: boolean;
  LL: any;
}

export default function AudioDropCard({
  title,
  description,
  audioSrc,
  onAudioBytes,
  onClear,
  isOptional = false,
  LL,
}: AudioDropCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onAudioBytesRef = useRef(onAudioBytes);

  useEffect(() => {
    onAudioBytesRef.current = onAudioBytes;
  }, [onAudioBytes]);

  const {
    isRecording,
    recordingDuration,
    errorMsg,
    setErrorMsg,
    startRecording,
    stopRecording,
    handleUpload,
    formatDuration,
  } = useAudioRecorder({
    onAudioReady: onAudioBytes,
    permissionErrorMsg: LL.AUDIO_MIC_PERMISSION_ERROR(),
    linuxErrorMsg: LL.AUDIO_MIC_LINUX_ERROR(),
  });

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    const registerTauriDrop = async () => {
      try {
        const { getCurrentWebview } = await import("@tauri-apps/api/webview");
        const unlisten = await getCurrentWebview().onDragDropEvent((event) => {
          if (!containerRef.current) return;
          if (event.payload.type === "leave") {
            setIsDragging(false);
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          const { x, y } = event.payload.position;
          const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

          if (event.payload.type === "over") {
            setIsDragging(inside);
          } else if (event.payload.type === "drop") {
            setIsDragging(false);
            if (!inside || !event.payload.paths.length) return;
            const path = event.payload.paths[0];
            const lower = path.toLowerCase();
            const valid = [".mp3", ".wav", ".m4a", ".webm", ".ogg"].some((ext) => lower.endsWith(ext));
            if (valid) {
              readFile(path)
                .then((bytes) => {
                  onAudioBytesRef.current(bytes);
                  setErrorMsg(null);
                })
                .catch((err) => {
                  console.error("failed reading dropped audio file:", err);
                  setErrorMsg("Failed to read the dropped file.");
                });
            } else {
              setErrorMsg("Please drop a valid audio file (.mp3, .wav, .m4a, .webm, .ogg).");
            }
          }
        });
        cleanup = unlisten;
      } catch (err) {
        console.error("failed registering tauri drop listener in AudioDropCard:", err);
      }
    };

    registerTauriDrop();
    return () => cleanup?.();
  }, [setErrorMsg]);

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const lower = file.name.toLowerCase();
          const valid = file.type.startsWith("audio/") || [".mp3", ".wav", ".m4a", ".webm", ".ogg"].some((ext) => lower.endsWith(ext));
          if (valid) {
            const buf = await file.arrayBuffer();
            onAudioBytes(new Uint8Array(buf));
            setErrorMsg(null);
          } else {
            setErrorMsg("Please drop a valid audio file (.mp3, .wav, .m4a, .webm, .ogg).");
          }
        }
      }}
      className={`relative border-2 rounded-2xl p-4 flex flex-col justify-between min-h-55 transition-all duration-200 ${isDragging
          ? "border-dashed border-talesorang-500 bg-talesorang-50/60 ring-4 ring-talesorang-100"
          : "border-slate-200/90 bg-slate-50/70"
        }`}
    >
      {/* Drop overlay prompt */}
      {isDragging && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-20 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-talesorang-500 animate-bounce mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-xs font-black text-talesblu-800 uppercase tracking-wider">{LL.AUDIO_DROP_HERE()}</p>
        </div>
      )}

      {/* Header and status */}
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-extrabold text-talesblu-900 text-sm">{title}</h4>
            <p className="text-gray-400 text-[11px] leading-tight mt-0.5">{description}</p>
          </div>
          <span
            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${audioSrc
                ? "bg-emerald-100 text-emerald-700"
                : isOptional
                  ? "bg-slate-200/70 text-slate-500"
                  : "bg-amber-100 text-amber-700"
              }`}
          >
            {audioSrc ? LL.AUDIO_STATUS_READY() : isOptional ? LL.AUDIO_OPTIONAL() : LL.AUDIO_STATUS_EMPTY()}
          </span>
        </div>

        {/* Audio player preview or empty dropzone */}
        {audioSrc ? (
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">
                {LL.AUDIO_PLAYBACK()}
              </span>
              <button
                onClick={onClear}
                className="text-[11px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {LL.AUDIO_CLEAR()}
              </button>
            </div>
            <audio controls src={audioSrc} className="w-full h-7" />
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200 rounded-xl py-3 px-2 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-[11px] text-slate-400 font-bold italic">{LL.AUDIO_NO_AUDIO()}</p>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-wider mt-0.5">Drag file here or record</p>
          </div>
        )}

        {errorMsg && <p className="text-red-500 text-[11px] font-semibold">{errorMsg}</p>}
      </div>

      {/* Record and upload action buttons */}
      <div className="mt-3 pt-3 border-t border-slate-200/70">
        {isRecording ? (
          <div className="bg-red-50/80 border border-red-200 rounded-xl p-2 flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono font-black text-red-800">
                {formatDuration(recordingDuration)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              {LL.AUDIO_STOP_RECORD()}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={startRecording}
              className="flex items-center justify-center gap-1.5 bg-talesorang-500 hover:bg-talesorang-600 text-white font-black text-[11px] py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-97"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {LL.AUDIO_RECORD()}
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-[11px] py-2 rounded-xl transition-all shadow-xs cursor-pointer active:scale-97"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {LL.AUDIO_UPLOAD_FILE()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
