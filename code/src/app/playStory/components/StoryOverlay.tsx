import type { ReactNode } from "react";
import { fontSize } from "../Settings";
import { Option, FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryOverlayProps {
    title: string | undefined;
    description: string | undefined;
    fontSizeSetting: FontSize;
    options: Option[] | undefined;
    children?: ReactNode;
}

export default function StoryOverlay({
    title,
    description,
    fontSizeSetting,
    options,
    children,
}: StoryOverlayProps) {
    const baseFontSize = fontSize[fontSizeSetting];
    const { LL } = useI18nContext();

    return (
        <div className="relative flex flex-col h-full w-full bg-black overflow-hidden select-none">
            {title && (
                <header className="w-full bg-black text-white text-center py-4 px-36 shrink-0 z-10">
                    <h1
                        className="font-bold leading-tight"
                        style={{
                            fontSize: baseFontSize * 2 + "px",
                        }}>
                        {title}
                    </h1>
                </header>
            )}

            <div className="flex-1 min-h-0 w-full flex items-center justify-center bg-black overflow-hidden relative">
                {children}
            </div>

            {description && (
                <footer className="w-full bg-black text-white text-center py-4 px-24 shrink-0 z-10">
                    <p
                        className="leading-relaxed"
                        style={{
                            fontSize: baseFontSize + "px",
                        }}>
                        {description}
                    </p>
                </footer>
            )}

            {options && options.length === 0 && (
                <div
                    className="absolute bottom-24 left-4 z-100 max-w-1/4 text-white bg-talesorang-500 p-4 rounded-lg"
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_END()}
                </div>
            )}
        </div>
    );
}
