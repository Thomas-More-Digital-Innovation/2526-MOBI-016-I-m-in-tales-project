import { useNfc } from "@components/NfcProvider";

export function NfcBadge() {
    const { status, error } = useNfc();
    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-colors duration-300 ${status === "Active"
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : status === "Error" || error
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
            title={error || status}
        >
            <div className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-emerald-500 animate-pulse" : status === "Error" ? "bg-red-500" : "bg-slate-400"
                }`} />
            <span title="Whisper is the codename for the NFC reader" className="text-[10px] font-black uppercase tracking-widest leading-none">
                {status === "Active" ? "Whisper Active" : status === "Error" ? "Whisper Error" : "Whisper Offline"}
            </span>
        </div>
    )
}