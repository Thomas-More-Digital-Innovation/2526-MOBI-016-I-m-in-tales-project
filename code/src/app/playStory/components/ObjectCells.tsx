import { Option, FontSize } from "@/types";

export interface ObjectCellsProps {
    options: Option[];
    activeIndex: number | null;
    onHover: (index: number) => void;
    fontSizeSetting: FontSize;
}

/** One round cell per link; hovering (or focusing) a cell plays that object's sound. */
export default function ObjectCells({ options, activeIndex, onHover, fontSizeSetting }: ObjectCellsProps) {
    if (!options.some((o) => o.objectImage || o.objectSound)) return null;
    const size = fontSizeSetting * 5;

    return (
        <ul className="absolute bottom-6 inset-x-0 flex flex-wrap justify-center gap-6 px-24 pointer-events-none">
            {options.map((option, i) => (
                <li key={option.item ?? i}>
                    <button
                        type="button"
                        onMouseEnter={() => onHover(i)}
                        onFocus={() => onHover(i)}
                        aria-label={option.itemLabel ?? option.item ?? undefined}
                        aria-pressed={activeIndex === i}
                        className={`pointer-events-auto rounded-full overflow-hidden border-4 bg-white flex items-center justify-center transition-transform duration-200 ${
                            activeIndex === i ? "border-talesorang-500 scale-110" : "border-white"
                        }`}
                        style={{ width: size, height: size }}
                    >
                        {option.objectImage ? (
                            <img src={option.objectImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-black px-2 leading-tight" style={{ fontSize: fontSizeSetting + "px" }}>
                                {option.itemLabel}
                            </span>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );
}
