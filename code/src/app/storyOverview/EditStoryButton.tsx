import Button from "@components/Button";
import { useNavigate } from "react-router-dom";

export default function EditStoryButton({ id }: { id: string }) {
  const nav = useNavigate();
  return (
    <Button
      primary={true}
      onClick={() => {
        nav(`/makeStory/storyConfigurator/${id}`);
      }}
      cls="w-full">
      Bewerk verhaal
    </Button>
  );
}
