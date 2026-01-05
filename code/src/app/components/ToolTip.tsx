export default function ToolTip({
  text,
  absolute,
  cls,
}: {
  text: string;
  absolute?: boolean;
  cls?: string;
}) {
  return (
    <div
      className={`${absolute ? "absolute" : ""} ${cls ?? ""} items-center max-w-xs bg-gray-800 text-white text-sm rounded-xl px-3 py-2 shadow-lg z-10 whitespace-pre-line`}
    >
      {text}
    </div>
  );
}
