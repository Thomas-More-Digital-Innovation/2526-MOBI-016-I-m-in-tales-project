import { Button } from "@components";
import { Option } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryOptionsProps {
    options: Option[] | undefined;
    onErrorClick: () => void;
    onOptionClick: (option: Option) => void;
    showStoryOptions: boolean;
    onToggleShowStoryOptions: (show: boolean) => void;
}

export default function StoryOptions({
    options,
    onErrorClick,
    onOptionClick,
    showStoryOptions,
    onToggleShowStoryOptions,
}: StoryOptionsProps) {
    const { LL } = useI18nContext();

    if (!options) return null;

    return (
        <div className="absolute flex flex-col bottom-4 right-4 z-100 items-end">
            {showStoryOptions && (
                <div className="flex flex-col mb-2 items-end">
                    {options.map((option) => (
                        <Button
                            key={option.nextChapter}
                            onClick={() => onOptionClick(option)}
                            cls="m-1 shadow-md">
                            {LL.STORY_OPTION_NEXT_CHAPTER()} {option.itemLabel ?? option.item ?? "null"}
                        </Button>
                    ))}
                    <Button onClick={() => onErrorClick()} cls="m-1 bg-red-500! shadow-md">
                        {LL.STORY_OPTION_PLAY_ERROR_SOUND()}
                    </Button>
                </div>
            )}
            <button
                onClick={() => onToggleShowStoryOptions(!showStoryOptions)}
                className={`p-3 rounded-full shadow-lg border-2 transition-all duration-300 active:scale-95 cursor-pointer ${showStoryOptions
                    ? "bg-talesorang-500 border-talesorang-700 text-white hover:bg-talesorang-400"
                    : "bg-talesblu-500 border-talesblu-800 text-white hover:bg-talesblu-400"
                    }`}
                title={showStoryOptions ? LL.STORY_OPTION_HIDE_OPTIONS() : LL.STORY_OPTION_SHOW_OPTIONS()}
            >
                {showStoryOptions ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </button>
        </div>
    );
}
