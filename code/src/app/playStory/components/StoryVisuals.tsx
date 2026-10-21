import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryVisualsProps {
    image: string | undefined;
}

export default function StoryVisuals({ image }: StoryVisualsProps) {
    const { LL } = useI18nContext();

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
