import { Button } from "@components";
import { Option } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryOptionsProps {
    options: Option[] | undefined;
    onErrorClick: () => void;
    onOptionClick: (option: Option) => void;
}

export default function StoryOptions({
    options,
    onErrorClick,
    onOptionClick,
}: StoryOptionsProps) {
    const { LL } = useI18nContext();

    if (!options) return null;

    return (
        <div className="absolute flex flex-col bottom-4 right-4 z-100">
            {options.map((option) => (
                <Button
                    key={option.nextChapter}
                    onClick={() => onOptionClick(option)}
                    cls="m-2">
                    {LL.STORY_OPTION_NEXT_CHAPTER()} {option.itemLabel ?? option.item ?? "null"}
                </Button>
            ))}
            <Button onClick={() => onErrorClick()} cls="m-2 bg-red-500!">
                {LL.STORY_OPTION_PLAY_ERROR_SOUND()}
            </Button>
        </div>
    );
}
