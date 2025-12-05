import Button from "@components/Button";
import { useNavigate } from "react-router-dom";

export default function PlayStoryButton({ id }: { id: string }) {
    const nav = useNavigate();
    return (
        <Button
            onClick={() => {
                nav(`/playStory/${id}`);
            }}
            cls="w-full">
            Start verhaal
        </Button>
    );
}
