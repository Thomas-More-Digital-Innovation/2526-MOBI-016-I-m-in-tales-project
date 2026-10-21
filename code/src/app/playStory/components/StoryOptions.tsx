import { useEffect, useRef, useState } from "react";
import { Button } from "@components";
import { Option } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

const HOLD_MS = 2000;

// Fires onComplete as soon as the press has lasted HOLD_MS, without waiting for release
function useHold(onComplete: () => void) {
    const [holding, setHolding] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const latest = useRef(onComplete);
    latest.current = onComplete;
    useEffect(() => () => clearTimeout(timer.current), []);

    const start = () => {
        setHolding(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => latest.current(), HOLD_MS);
    };
    const stop = () => {
        setHolding(false);
        clearTimeout(timer.current);
    };
    return { holding, start, stop };
}

export interface StoryOptionsProps {
    options: Option[] | undefined;
    onErrorClick: () => void;
    onOptionClick: (option: Option) => void;
    onDisable: () => void;
    isTransitioning?: boolean;
}

export default function StoryOptions({
    options,
    onErrorClick,
    onOptionClick,
    onDisable,
    isTransitioning = false,
}: StoryOptionsProps) {
    const { LL } = useI18nContext();
    const pressedAt = useRef(0);
    const { holding, start, stop } = useHold(onDisable);
    const [taps, setTaps] = useState(0);
    const tapReset = useRef<ReturnType<typeof setTimeout>>(undefined);

    // A tap does nothing; only a full long press (teacher gesture) turns the setting off
    const handleClick = () => {
        if (Date.now() - pressedAt.current >= HOLD_MS) return;
        // Repeated short taps: wiggle and hint that it needs a hold
        setTaps((n) => n + 1);
        clearTimeout(tapReset.current);
        tapReset.current = setTimeout(() => setTaps(0), 1500);
    };

    if (!options) return null;

    return (
        <div className="absolute flex flex-col bottom-4 right-4 z-100 items-end">
            <div className="flex flex-col mb-2 items-end">
                    {options.map((option) => (
                        <Button
                            key={option.nextChapter}
                            onClick={() => onOptionClick(option)}
                            disabled={isTransitioning}
                            cls="m-1 shadow-md">
                            {LL.STORY_OPTION_NEXT_CHAPTER()} {option.itemLabel ?? option.item ?? "null"}
                        </Button>
                    ))}
                    <Button
                        onClick={() => onErrorClick()}
                        disabled={isTransitioning}
                        cls="m-1 bg-red-500! shadow-md">
                        {LL.STORY_OPTION_PLAY_ERROR_SOUND()}
                    </Button>
            </div>
            <div className="relative">
            {taps >= 2 && (
                <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap rounded-lg bg-white px-3 py-1 text-sm font-bold text-red-600 shadow-md pointer-events-none">
                    {LL.STORY_OPTION_HOLD_HINT()}
                </span>
            )}
            <button
                key={taps}
                onClick={handleClick}
                onPointerDown={() => {
                    pressedAt.current = Date.now();
                    // Keep tap state stable mid-hold; resetting it remounts the button and restarts the ring
                    clearTimeout(tapReset.current);
                    start();
                }}
                onPointerUp={stop}
                onPointerLeave={stop}
                onPointerCancel={stop}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative p-3 select-none ${taps >= 2 ? "animate-wiggle" : ""} rounded-full shadow-lg border-2 transition-all duration-300 active:scale-95 cursor-pointer ${holding
                    ? "bg-red-500 border-red-700 text-white"
                    : "bg-talesorang-500 border-talesorang-700 text-white hover:bg-talesorang-400"
                    }`}
                title={LL.STORY_OPTION_HIDE_OPTIONS()}
            >
                {holding && (
                    // Progress ring that fills over HOLD_MS; options turn off the moment it is full
                    <svg className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#fecaca" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset="100">
                            <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${HOLD_MS}ms`} fill="freeze" />
                        </circle>
                    </svg>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
        </div>
    );
}

// Faint corner trigger while options are off; holding it shows a ring that fills, enabling once full
export function StoryOptionsReveal({ onEnable }: { onEnable: () => void }) {
    const { LL } = useI18nContext();
    const { holding, start, stop } = useHold(onEnable);

    return (
        <button
            onPointerDown={start}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            onContextMenu={(e) => e.preventDefault()}
            className={`absolute bottom-4 right-4 z-100 p-3 select-none rounded-full border-2 transition-all duration-300 active:scale-95 cursor-pointer ${holding
                ? "shadow-lg bg-talesorang-500 border-talesorang-700 text-white"
                : "border-transparent text-talesorang-500 opacity-40"
                }`}
            aria-label={LL.STORY_OPTION_SHOW_OPTIONS()}
        >
            {holding && (
                <svg className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-talesorang-200)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-talesorang-700)" strokeWidth="3" strokeLinecap="round" pathLength={100} strokeDasharray="100" strokeDashoffset="100">
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${HOLD_MS}ms`} fill="freeze" />
                    </circle>
                </svg>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
    );
}
