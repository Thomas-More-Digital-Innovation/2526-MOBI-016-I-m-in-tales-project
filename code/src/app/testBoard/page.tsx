"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNfc } from "../components/NfcProvider";
import { loadAllCalibrations } from "@/utils/tagMapping";
import { getStoriesOverview, loadStoryData } from "@/utils/storyIO";
import { TagMatch } from "@/types/story.type";
import { AssignedLabelsTable } from "./AssignedLabelsTable";
import { useI18nContext } from "@/i18n/i18n-react";

export default function TestBoard() {
  const { status, tagUid, tagContent, error } = useNfc();
  const [matches, setMatches] = useState<TagMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const { LL } = useI18nContext();

  useEffect(() => {
    if (!tagUid) {
      setMatches([]);
      return;
    }

    async function findMatches() {
      setIsLoadingMatches(true);
      try {
        const allCalibrations = await loadAllCalibrations();
        const storyPreviews = await getStoriesOverview();
        const foundMatches: TagMatch[] = [];

        for (const preview of storyPreviews) {
          const storyCalib = allCalibrations[preview.internalId];
          if (storyCalib) {
            const itemIds = Object.entries(storyCalib)
              .filter(([_, uid]) => uid === tagUid)
              .map(([itemId, _]) => itemId);

            if (itemIds.length > 0) {
              const storyData = await loadStoryData(preview.id);
              for (const itemId of itemIds) {
                const item = storyData.items?.find(i => i.itemId === itemId);
                if (item) {
                  foundMatches.push({
                    storyName: preview.name,
                    label: item.label || itemId
                  });
                }
              }
            }
          }
        }
        setMatches(foundMatches);
      } catch (err) {
        console.error("Failed to find tag matches:", err);
      } finally {
        setIsLoadingMatches(false);
      }
    }

    findMatches();
  }, [tagUid]);

  return (
    <main className="min-h-screen bg-white text-talesblu-900 font-sans">
      <Header title={LL.TEST_TITLE()} />

      <div className="max-w-2xl mx-auto">
        <div className="p-8 space-y-8">
          {/* Status Section */}
          <div className="flex items-center justify-between bg-talesblu-50 p-6 rounded-2xl border-2 border-talesblu-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500 animate-ping' : 'bg-slate-300'}`} />
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500' : 'bg-slate-300'}`} />
              </div>
              <div>
                <p className="text-xs font-black text-talesblu-400 uppercase tracking-widest">{LL.TEST_SCANNER_STATUS()}</p>
                <p className="text-xl font-bold text-talesblu-800">{status}</p>
              </div>
            </div>

            {status === 'Active' && (
              <div className="px-4 py-2 bg-talesorang-100 text-talesorang-600 rounded-full text-xs font-black uppercase tracking-tighter animate-pulse">
                {LL.TEST_ACTIVE_POLLING()}
              </div>
            )}
          </div>

          {/* Tag Display */}
          <div className="relative group">
            <div className={`relative bg-white border-4 ${(status !== 'Disconnected' && tagUid) ? 'border-talesorang-500 shadow-[0_0_20px_rgba(246,116,94,0.3)]' : 'border-talesblu-100'} rounded-2xl p-10 min-h-64 flex flex-col items-center justify-center text-center transition-all duration-300`}>
              {(status !== 'Disconnected' && tagUid) ? (
                <div className="animate-in fade-in zoom-in duration-300 w-full max-w-md">
                  <div className="w-16 h-16 bg-talesorang-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-talesblu-50 px-6 py-4 rounded-xl border-2 border-talesblu-100">
                      <span className="text-[10px] font-black text-talesblu-400 uppercase tracking-widest block mb-1">{LL.TEST_HARDWARE_UID()}</span>
                      <p className="text-2xl font-mono font-bold text-talesblu-800 break-all">{tagUid}</p>
                    </div>

                    {tagContent && (
                      <div className="bg-slate-50 px-6 py-4 rounded-xl border-2 border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{LL.TEST_NDEF_CONTENT()}</span>
                        <p className="text-sm font-medium text-slate-600 italic break-all">"{tagContent}"</p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-talesblu-100">
                      <span className="text-[10px] font-black text-talesblu-400 uppercase tracking-widest block mb-3 text-left">{LL.TEST_ASSIGNED_LABELS()}</span>

                      {isLoadingMatches ? (
                        <div className="py-4 text-talesblu-300 text-sm animate-pulse">{LL.TEST_SEARCHING()}</div>
                      ) : matches.length > 0 ? (
                        <AssignedLabelsTable matches={matches} />
                      ) : (
                        <div className="py-4 px-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100 text-slate-400 text-xs font-medium">
                          {LL.TEST_NO_CALIBRATIONS()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-talesblu-300">
                  <div className="w-20 h-20 bg-talesblu-50 border-4 border-dashed border-talesblu-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold mb-1">
                    {status === 'Disconnected' ? LL.TEST_OFFLINE() : LL.TEST_WAITING()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">{LL.TEST_CONNECTION_ISSUE()}</p>
                <p className="text-sm font-medium opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
