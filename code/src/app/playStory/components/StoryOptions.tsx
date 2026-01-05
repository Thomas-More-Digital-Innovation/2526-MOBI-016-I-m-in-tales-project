import { Button } from "@components";
import { Option } from "@/types";

// this is just a temporary placeholder for the options until it is worked out with the NFC sensor

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
    if (!options) return null;

    return (
        <div className="absolute flex flex-col bottom-4 right-4 z-100">
            {options.map((option) => (
                <Button
                    key={option.nextChapter}
                    onClick={() => onOptionClick(option)}
                    cls="m-2">
                    {option.item ?? "null"}
                    {option.audio && (
                        <>
                            <br />
                            (Audio)
                        </>
                    )}
                </Button>
            ))}
            <Button onClick={() => onErrorClick()} cls="m-2 bg-red-500!">
                Error
            </Button>
        </div>
    );
}
