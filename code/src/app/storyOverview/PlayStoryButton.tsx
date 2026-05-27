import Button from "@components/Button";
import { useNavigate } from "react-router-dom";
import { useI18nContext } from "@/i18n/i18n-react";

export default function PlayStoryButton({ id }: { id: string }) {
  const nav = useNavigate();
  const { LL } = useI18nContext();

  return (
    <Button
      primary={true}
      onClick={() => {
        nav(`/playStory/${id}`);
      }}
      cls="w-full">
      {LL.PLAY_BTN()}
    </Button>
  );
}
