import { useCallback } from "react";
import HeaderButton from "./HeaderLink";
import { importStory } from "@/utils/storyIO";

interface Props {
  onImportSuccess?: () => void;
}

export default function ImportButton({ onImportSuccess }: Props) {
  const handleImport = useCallback(() => {
    importStory()
      .then((name) => {
        if (name && onImportSuccess) {
          onImportSuccess();
        }
      })
      .catch((e) => console.error("Import failed:", e));
  }, [onImportSuccess]);

  return (
    <HeaderButton
      onClick={handleImport}
      cls="px-3"
      label={<img src="/import.svg" alt="import" width={36} height={36} style={{ filter: "brightness(0) invert(1)" }} />}
    />
  );
}
