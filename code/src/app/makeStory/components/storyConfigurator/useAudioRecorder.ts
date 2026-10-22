import { useState, useRef, useEffect, useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";

interface UseAudioRecorderOptions {
  onAudioReady: (bytes: Uint8Array) => void;
  permissionErrorMsg: string;
  linuxErrorMsg: string;
}

export function useAudioRecorder({
  onAudioReady,
  permissionErrorMsg,
  linuxErrorMsg,
}: UseAudioRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const onAudioReadyRef = useRef(onAudioReady);

  useEffect(() => {
    onAudioReadyRef.current = onAudioReady;
  }, [onAudioReady]);

  const stopRecordingResources = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRecordingResources();
    };
  }, [stopRecordingResources]);

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
        onAudioReadyRef.current(new Uint8Array(arrayBuffer));
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
      setErrorMsg(isLinux ? linuxErrorMsg : permissionErrorMsg);
    }
  };

  const stopRecording = useCallback(() => {
    stopRecordingResources();
    setIsRecording(false);
  }, [stopRecordingResources]);

  const handleUpload = async () => {
    try {
      const selectedAudio = await open({
        multiple: false,
        extensions: ["mp3", "wav", "m4a", "webm", "ogg"],
      });
      if (!selectedAudio) return;

      const bytes = await readFile(selectedAudio.toString());
      onAudioReadyRef.current(bytes);
      setErrorMsg(null);
    } catch (err) {
      console.error("failed to upload audio file:", err);
      setErrorMsg("Failed to upload audio file.");
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    isRecording,
    recordingDuration,
    errorMsg,
    setErrorMsg,
    startRecording,
    stopRecording,
    handleUpload,
    formatDuration,
  };
}
