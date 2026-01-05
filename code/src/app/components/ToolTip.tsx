export default function ToolTip({ text, absolute, cls }: { text: string; absolute?: boolean, cls?: string }) {
  return (
    <div className={`${absolute ? "absolute" : ""} ${cls} bg-gray-800 text-white text-xl rounded-2xl p-2 shadow-lg z-10 whitespace-pre-line`}>
      {text}
    </div>
  );
}
