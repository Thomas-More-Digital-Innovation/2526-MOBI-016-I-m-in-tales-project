import type { CSSProperties, FocusEventHandler, MouseEventHandler } from "react";

interface HeaderButtonProps {
  label: string;
  link?: string;
  cls?: string;
  primary?: boolean;
  style?: CSSProperties;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement>;
}

export default function HeaderButton({
  label,
  link = "#",
  cls = "",
  primary = false,
  style,
  onMouseEnter,
  onMouseLeave
}: HeaderButtonProps) {
  const variantClass = primary
    ? "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98]"
    : "bg-[#f6745e] shadow-[0px_1px_2px_1px_#faac9e]";

  return (
    <a
      href={link}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`text-3xl cursor-pointer font-semibold duration-150 text-white ease-in-out py-3 px-8 h-fit hover:scale-85 hover:drop-shadow-none rounded ${cls} ${variantClass}`}>
      {label}
    </a>
  );
}
