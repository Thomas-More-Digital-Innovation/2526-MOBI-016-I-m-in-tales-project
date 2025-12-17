import { Button } from "@components";

export interface StoryHeaderProps {
    onSettingsClick: () => void;
    onCloseClick: () => void;
}

export default function StoryHeader({
    onSettingsClick,
    onCloseClick,
}: StoryHeaderProps) {
    return (
        <>
            <Button onClick={onSettingsClick} cls="absolute top-3 left-2 z-100">
                Instellingen
            </Button>
            <Button onClick={onCloseClick} cls="absolute top-3 right-2 z-100">
                X
            </Button>
        </>
    );
}
