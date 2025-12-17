import { Button } from "@components";
import { Option } from "../../../types/story.type";

export interface StoryOptionsProps {
    options: Option[] | undefined;
    onOptionClick: (option: Option) => void;
}

export default function StoryOptions({
    options,
    onOptionClick,
}: StoryOptionsProps) {
    if (!options) return null;

    if (options.length === 0) {
        return (
            <div className="absolute bottom-24 left-4 z-100 max-w-1/4 text-white bg-talesorang-500 p-4 rounded-lg">
                Dit is het einde van het verhaal. Druk op een toets om het
                verhaal af te sluiten.
            </div>
        );
    }

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
        </div>
    );
}
