"use client";

import Header from "../components/Header";
import { useNfc } from "../components/NfcProvider";

export default function TestBoard() {
  const { status, tagContent, error } = useNfc();

  return (
    <main className="min-h-screen bg-white text-talesblu-900 font-sans">
      <Header />

      <div className="max-w-2xl mx-auto py-12 px-6">
        <div className="p-8 border-b-4 border-talesblu-500 rounded-2xl bg-talesblu-500 text-white">
          <h1 className="text-3xl font-bold mb-2">NFC Board Tester</h1>
          <p className="text-talesblu-100 font-medium">Automatic scanning is active. Place a tag on the reader.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Status Section */}
          <div className="flex items-center justify-between bg-talesblu-50 p-6 rounded-2xl border-2 border-talesblu-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500 animate-ping' : 'bg-slate-300'}`} />
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500' : 'bg-slate-300'}`} />
              </div>
              <div>
                <p className="text-xs font-black text-talesblu-400 uppercase tracking-widest">Scanner Status</p>
                <p className="text-xl font-bold text-talesblu-800">{status}</p>
              </div>
            </div>

            {status === 'Active' && (
              <div className="px-4 py-2 bg-talesorang-100 text-talesorang-600 rounded-full text-xs font-black uppercase tracking-tighter animate-pulse">
                Polling 5Hz
              </div>
            )}
          </div>

          {/* Tag Display */}
          <div className="relative group">
            <div className={`relative bg-white border-4 ${(status !== 'Disconnected' && tagContent) ? 'border-talesorang-500 shadow-[0_0_20px_rgba(246,116,94,0.3)]' : 'border-talesblu-100'} rounded-2xl p-10 min-h-64 flex flex-col items-center justify-center text-center transition-all duration-300`}>
              {(status !== 'Disconnected' && tagContent) ? (
                <div className="animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-talesorang-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg shadow-talesorang-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-black text-talesblu-400 uppercase tracking-widest mb-2">Tag Content Detected</h3>
                  <div className="bg-talesblu-50 px-6 py-4 rounded-xl border-2 border-talesblu-100">
                    <p className="text-3xl font-black text-talesblu-500 break-all leading-tight">{tagContent}</p>
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
                    {status === 'Disconnected' ? "Can't read without a reader" : "Waiting for Tag..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">Connection Issue</p>
                <p className="text-sm font-medium opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
