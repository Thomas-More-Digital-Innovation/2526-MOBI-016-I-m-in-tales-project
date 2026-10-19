import { useCallback } from "react";
import HeaderButton from "./HeaderLink";
import { importStory } from "@/utils/storyIO";
import { ask } from "@tauri-apps/plugin-dialog";
import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
  onImportSuccess?: () => void;
}

export default function ImportButton({ onImportSuccess }: Props) {
  const { LL } = useI18nContext();

  const handleImport = useCallback(() => {
    importStory({
      confirmOverwrite: async (name) => {
        return await ask(LL.IMPORT_OVERWRITE_CONFIRM({ name }), {
          title: LL.IMPORT_OVERWRITE_TITLE(),
          kind: "warning",
        });
      },
    })
      .then((name) => {
        if (name && onImportSuccess) {
          onImportSuccess();
        }
      })
      .catch((e) => console.error("Import failed:", e));
  }, [LL, onImportSuccess]);

  return (
    <HeaderButton
      onClick={handleImport}
      cls="px-3"
      label={
        <img
          src="/import.svg"
          alt="import"
          width={36}
          height={36}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      }
    />
  );
}
