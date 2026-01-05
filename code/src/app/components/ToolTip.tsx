export default function ToolTip({ text, absolute }: { text: string; absolute?: boolean }) {
  return (
    <div className={`${absolute ? "absolute" : ""} bg-gray-800 text-white text-xl rounded-2xl p-2 shadow-lg z-10`}>
      {text}
      <div className=""></div>
    </div>
  );
}