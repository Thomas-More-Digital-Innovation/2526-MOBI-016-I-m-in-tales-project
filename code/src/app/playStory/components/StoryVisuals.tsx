import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryVisualsProps {
    image: string | undefined;
}

export default function StoryVisuals({ image }: StoryVisualsProps) {
    const { LL } = useI18nContext();

    if (!image) return null;

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <img
                src={image}
                className="w-full h-full object-cover"
                alt={LL.STORY_BG_ALT()}
            />
        </div>
    );
}
