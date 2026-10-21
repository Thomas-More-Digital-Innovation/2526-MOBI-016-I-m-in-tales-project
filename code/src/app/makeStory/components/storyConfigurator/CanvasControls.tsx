import { useI18nContext } from "@/i18n/i18n-react";
import { HelpTip } from "@components";

interface CanvasControlsProps {
  onRecenter: () => void;
  onCreateNode: () => void;
}

export default function CanvasControls({
  onRecenter,
  onCreateNode,
}: CanvasControlsProps) {
  const { LL } = useI18nContext();

  return (
    <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-3 select-none">
      <HelpTip text={LL.CANVAS_RECENTER()}>
        <button
          onClick={onRecenter}
          type="button"
          className="flex items-center justify-center cursor-pointer bg-white hover:bg-talesorang-50 text-talesblu-800 hover:text-talesorang-600 border border-gray-200 hover:border-talesorang-200 rounded-2xl p-3 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 group"
          aria-label={LL.CANVAS_RECENTER()}
        >
          <img src="/frame.svg" alt={LL.CANVAS_RECENTER()} />
        </button>
      </HelpTip>

      <HelpTip text={LL.TIP_ADD_CHAPTER()}>
        <button
          onClick={onCreateNode}
          type="button"
          className="flex items-center gap-2 cursor-pointer bg-talesblu-500 hover:bg-talesblu-600 text-white font-bold text-md px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 border border-talesblu-900/10"
        >
          <span>{LL.CONFIG_ADD_CHAPTER()}</span>
        </button>
      </HelpTip>
    </div>
  );
}
