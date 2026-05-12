"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

interface NfcTagEvent {
  uid: String;
  text: string | null;
}

interface NfcStatusEvent {
  connected: boolean;
  error?: string;
}

interface NfcContextType {
  status: "Initializing" | "Active" | "Disconnected" | "Error";
  tagUid: string | null;
  tagContent: string | null;
  error: string | null;
}

const NfcContext = createContext<NfcContextType | undefined>(undefined);

export function NfcProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NfcContextType["status"]>("Initializing");
  const [tagUid, setTagUid] = useState<string | null>(null);
  const [tagContent, setTagContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unlistenTag: (() => void) | null = null;
    let unlistenTagLost: (() => void) | null = null;
    let unlistenStatus: (() => void) | null = null;

    async function setupNfc() {
      try {
        unlistenTag = await listen<NfcTagEvent>("nfc://tag", (event) => {
          setTagUid(event.payload.uid.toString());
          setTagContent(event.payload.text);
          setError(null);
        });

        unlistenTagLost = await listen("nfc://tag-lost", () => {
          setTagUid(null);
          setTagContent(null);
        });

        unlistenStatus = await listen<NfcStatusEvent>("nfc://status", (event) => {
          if (event.payload.error) {
            setError(event.payload.error);
          } else {
            setError(null);
          }
          setStatus(event.payload.connected ? "Active" : "Disconnected");
        });

        // Start polling globally
        await invoke("nfc_start_polling");
        setStatus("Active");
      } catch (e: any) {
        console.error("NFC Setup Error:", e);
        setError(e.toString());
        setStatus("Error");
      }
    }

    setupNfc();

    return () => {
      if (unlistenTag) unlistenTag();
      if (unlistenTagLost) unlistenTagLost();
      if (unlistenStatus) unlistenStatus();
      // We don't necessarily want to stop polling on unmount if it's global,
      // but tauri will clean it up when the app closes anyway.
    };
  }, []);

  return (
    <NfcContext.Provider value={{ status, tagUid, tagContent, error }}>
      {children}
    </NfcContext.Provider>
  );
}

export function useNfc() {
  const context = useContext(NfcContext);
  if (context === undefined) {
    throw new Error("useNfc must be used within an NfcProvider");
  }
  return context;
}
