import { useI18nContext } from "@/i18n/i18n-react";
import { FontSize } from "@/types";

export interface StoryVisualsProps {
    image: string | undefined;
    text?: string;
    fontSizeSetting: FontSize;
}

export default function StoryVisuals({ image, text, fontSizeSetting }: StoryVisualsProps) {
    const { LL } = useI18nContext();

    if (text !== undefined) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white text-center px-24 overflow-auto">
                <p className="whitespace-pre-wrap font-bold leading-snug" style={{ fontSize: fontSizeSetting * 3 + "px" }}>
                    {text}
                </p>
            </div>
        );
    }

    if (!image) return null;

    return (
        <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <img
                src={image}
                className="w-full h-full object-contain"
                alt={LL.STORY_BG_ALT()}
            />
        </div>
    );
}
