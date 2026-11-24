import type { ReactNode } from "react";

const ICONS: Record<"replay" | "close" | "error", ReactNode> = {
    replay: <path d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    error: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6m0 4h.01" />
        </>
    ),
};

interface TeacherIconButtonProps {
    icon: keyof typeof ICONS;
    label: string;
    onClick: () => void;
    /** Icon size follows the story font size setting. */
    size: number;
    disabled?: boolean;
    cls?: string;
}

/** Small grey teacher control, kept low-key so it doesn't draw the children's attention. */
export default function TeacherIconButton({ icon, label, onClick, size, disabled = false, cls = "" }: TeacherIconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={`p-2 rounded-full text-gray-500 hover:text-gray-200 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}
        >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[icon]}
            </svg>
        </button>
    );
}
