import { getFontSize } from "../Settings";

export interface StoryOverlayProps {
    title: string | undefined;
    description: string | undefined;
    fontSizeSetting: FontSize;
}

export default function StoryOverlay({
    title,
    description,
    fontSizeSetting,
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
        </>
    );
}
