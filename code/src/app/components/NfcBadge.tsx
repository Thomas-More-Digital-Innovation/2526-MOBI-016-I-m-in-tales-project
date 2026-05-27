import { useNfc } from "@components/NfcProvider";
import { useI18nContext } from "@/i18n/i18n-react";

export function NfcBadge() {
    const { status, error } = useNfc();
    const { LL } = useI18nContext();

    const label = status === "Active" ? LL.NFC_ACTIVE() : status === "Error" ? LL.NFC_ERROR() : LL.NFC_OFFLINE();

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
            <span title={LL.NFC_TITLE()} className="text-[10px] font-black uppercase tracking-widest leading-none">
                {label}
            </span>
        </div>
    )
}