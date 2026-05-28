import { useState, useEffect, useRef } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { Modal, Button } from "@components";
import { useI18nContext } from "@/i18n/i18n-react";
import { ChapterNode } from "./useStoryState";

interface AudioSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedNode: ChapterNode;
  onUpdate: (id: string, updates: Partial<ChapterNode>) => void;
}

export default function AudioSettingsModal({
  isOpen,
  setIsOpen,
  selectedNode,
  onUpdate,
}: AudioSettingsModalProps) {
  const { LL } = useI18nContext();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="65%" height="80%">
      <div className="p-8 h-full flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-talesblu-850 uppercase tracking-tight">
              {LL.AUDIO_SETTINGS_TITLE()}{" "}
              <span className="text-talesorang-500 font-extrabold lowercase">
                ({selectedNode.title})
              </span>
            </h2>
            <p className="text-gray-500 font-medium text-sm mt-1">
              {LL.AUDIO_SETTINGS_DESC()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Column 1: Narration Audio */}
            <AudioSection
              title={LL.AUDIO_NARRATION_TITLE()}
              description={LL.AUDIO_NARRATION_DESC()}
              audioSrc={selectedNode.audioSrc}
              onAudioBytes={(bytes) => {
                const blob = new Blob([bytes as any]);
                const url = URL.createObjectURL(blob);
                onUpdate(selectedNode.id, { audioBytes: bytes, audioSrc: url });
              }}
              onClear={() => {
                onUpdate(selectedNode.id, { audioBytes: null, audioSrc: null });
              }}
              isOptional={false}
              LL={LL}
            />

            {/* Column 2: Fail / Feedback Audio */}
            <AudioSection
              title={LL.AUDIO_FAIL_TITLE()}
              description={LL.AUDIO_FAIL_DESC()}
              audioSrc={selectedNode.failAudioSrc}
              onAudioBytes={(bytes) => {
                const blob = new Blob([bytes as any]);
                const url = URL.createObjectURL(blob);
                onUpdate(selectedNode.id, { failAudioBytes: bytes, failAudioSrc: url });
              }}
              onClear={() => {
                onUpdate(selectedNode.id, { failAudioBytes: null, failAudioSrc: null });
              }}
              isOptional={true}
              LL={LL}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={() => setIsOpen(false)} cls="!bg-talesblu-800 hover:!bg-talesblu-900 shadow-md">
            {LL.CALIB_DONE()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface AudioSectionProps {
  title: string;
  description: string;
  audioSrc?: string | null;
  onAudioBytes: (bytes: Uint8Array) => void;
  onClear: () => void;
  isOptional: boolean;
  LL: any;
}

function AudioSection({
  title,
  description,
  audioSrc,
  onAudioBytes,
  onClear,
  isOptional,
  LL,
}: AudioSectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onAudioBytesRef = useRef(onAudioBytes);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    onAudioBytesRef.current = onAudioBytes;
  }, [onAudioBytes]);

  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const register = async () => {
      try {
        const { getCurrentWebview } = await import("@tauri-apps/api/webview");
        const unlisten = await getCurrentWebview().onDragDropEvent((event) => {
          if (!containerRef.current) return;

          if (event.payload.type === "leave") {
            setIsDragging(false);
            dragCounterRef.current = 0;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const { x, y } = event.payload.position;
          const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

          if (event.payload.type === "over") {
            setIsDragging((p) => {
              if (isInside) {
                if (!p) dragCounterRef.current = 1;
                return true;
              } else {
                if (p) dragCounterRef.current = 0;
                return false;
              }
            });
          } else if (event.payload.type === "drop") {
            setIsDragging(false);
            dragCounterRef.current = 0;
            if (!isInside || !event.payload.paths.length) return;

            const filePath = event.payload.paths[0];
            const lower = filePath.toLowerCase();
            const isAudio =
              lower.endsWith(".mp3") ||
              lower.endsWith(".wav") ||
              lower.endsWith(".m4a") ||
              lower.endsWith(".webm") ||
              lower.endsWith(".ogg");

            if (isAudio) {
              readFile(filePath)
                .then((bytes) => {
                  onAudioBytesRef.current(bytes);
                  setErrorMsg(null);
                })
                .catch((err) => {
                  console.error("Failed to read dropped file:", err);
                  setErrorMsg("Failed to read the dropped file.");
                });
            } else {
              setErrorMsg("Please drop a valid audio file (.mp3, .wav, .m4a, .webm, .ogg).");
            }
          }
        });
        cleanup = unlisten;
      } catch (err) {
        console.error("Failed to register Tauri drag-drop handler:", err);
      }
    };

    register();
    return () => {
      cleanup?.();
    };
  }, []);

  const stopRecordingResources = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleUpload = async () => {
    try {
      const selectedAudio = await open({
        multiple: false,
        extensions: ["mp3", "wav", "m4a", "webm", "ogg"],
      });
      if (!selectedAudio) return;

      const bytes = await readFile(selectedAudio.toString());
      onAudioBytes(bytes);
      setErrorMsg(null);
    } catch (err) {
      console.error("failed to upload audio file:", err);
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let preferredMime = "audio/webm";
      if (!MediaRecorder.isTypeSupported(preferredMime)) {
        preferredMime = "audio/mp4";
      }
      if (!MediaRecorder.isTypeSupported(preferredMime)) {
        preferredMime = "";
      }

      const recorder = new MediaRecorder(
        stream,
        preferredMime ? { mimeType: preferredMime } : undefined
      );

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: preferredMime || "audio/webm",
        });
        const arrayBuffer = await audioBlob.arrayBuffer();
        onAudioBytes(new Uint8Array(arrayBuffer));
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("microphone access denied:", err);
      const isLinux = navigator.userAgent.toLowerCase().includes("linux");
      setErrorMsg(isLinux ? LL.AUDIO_MIC_LINUX_ERROR() : LL.AUDIO_MIC_PERMISSION_ERROR());
    }
  };

  const stopRecording = () => {
    stopRecordingResources();
    setIsRecording(false);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const nameLower = file.name.toLowerCase();
      const isAudio =
        file.type.startsWith("audio/") ||
        nameLower.endsWith(".mp3") ||
        nameLower.endsWith(".wav") ||
        nameLower.endsWith(".m4a") ||
        nameLower.endsWith(".webm") ||
        nameLower.endsWith(".ogg");

      if (isAudio) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          onAudioBytes(new Uint8Array(arrayBuffer));
          setErrorMsg(null);
        } catch (err) {
          console.error("failed to read dropped file:", err);
          setErrorMsg("Failed to read the dropped file.");
        }
      } else {
        setErrorMsg("Please drop a valid audio file (.mp3, .wav, .m4a, .webm, .ogg).");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 rounded-2xl p-5 flex flex-col justify-between h-96 shadow-sm transition-all duration-200 ${
        isDragging
          ? "border-dashed border-talesorang-500 bg-talesorang-50/40 scale-[1.01] ring-4 ring-talesorang-100"
          : "border-slate-200/80 bg-slate-50"
      }`}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in-95 duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-talesorang-500 animate-bounce mb-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-sm font-black text-talesblu-800 uppercase tracking-wider pointer-events-none">{LL.AUDIO_DROP_HERE()}</p>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest pointer-events-none">.mp3, .wav, .m4a, .webm, .ogg</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-extrabold text-talesblu-800 text-lg">{title}</h3>
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{description}</p>
          </div>
          <span
            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
              audioSrc
                ? "bg-emerald-100 text-emerald-700"
                : isOptional
                ? "bg-slate-200/60 text-slate-500"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {audioSrc ? LL.AUDIO_STATUS_READY() : isOptional ? LL.AUDIO_OPTIONAL() : LL.AUDIO_STATUS_EMPTY()}
          </span>
        </div>

        {audioSrc ? (
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
              {LL.AUDIO_PLAYBACK()}
            </p>
            <audio controls src={audioSrc} className="w-full h-8" />
            <button
              onClick={onClear}
              className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {LL.AUDIO_CLEAR()}
            </button>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-200/80 rounded-xl p-4 flex flex-col justify-center items-center h-28 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-xs text-slate-400 font-bold italic">{LL.AUDIO_NO_AUDIO()}</p>
          </div>
        )}

        {errorMsg && <p className="text-red-500 text-xs font-semibold mt-1">{errorMsg}</p>}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/60">
        {isRecording ? (
          <div className="bg-red-50/60 border border-red-100 rounded-xl p-3 flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-extrabold text-red-700 tracking-wide uppercase">
                {LL.AUDIO_RECORDING()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono font-black text-red-800">
                {formatDuration(recordingDuration)}
              </span>
              <button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {LL.AUDIO_STOP_RECORD()}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={startRecording}
              className="flex items-center justify-center gap-2 bg-talesorang-500 hover:bg-talesorang-600 text-white font-black text-xs py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-97 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              {LL.AUDIO_RECORD()}
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl transition-all shadow-sm hover:border-slate-300 active:scale-97 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
