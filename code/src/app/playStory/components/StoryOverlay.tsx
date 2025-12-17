import { getFontSize } from "../Settings";
import { Option } from "@types/story.type";

export interface StoryOverlayProps {
    title: string | undefined;
    description: string | undefined;
    fontSizeSetting: FontSize;
    options: Option[] | undefined;
}

export default function StoryOverlay({
    title,
    description,
    fontSizeSetting,
    options,
}: StoryOverlayProps) {
    const baseFontSize = getFontSize(fontSizeSetting);

    return (
        <>
            {title && (
                <h1
                    className="absolute top-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                    style={{
                        fontSize: baseFontSize * 2 + "px",
                    }}>
                    {title}
                </h1>
            )}
            {description && (
                <p
                    className="absolute bottom-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {description}
                </p>
            )}
            {options && options.length === 0 && (
                <div className="absolute bottom-24 left-4 z-100 max-w-1/4 text-white bg-talesorang-500 p-4 rounded-lg">
                    Dit is het einde van het verhaal. Druk op een toets om het
                    verhaal af te sluiten.
                </div>
            )}
        </>
    );
}
