import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

interface HeaderButtonProps {
  label: ReactNode;
  link?: string;
  cls?: string;
  primary?: boolean;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  onMouseLeave?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export default function HeaderButton({
  label,
  link,
  cls = "",
  primary = false,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave
}: HeaderButtonProps) {
  const variantClass = primary
    ? "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98]"
    : "bg-[#f6745e] shadow-[0px_1px_2px_1px_#faac9e]";

  const className = `text-3xl cursor-pointer font-semibold duration-150 text-white ease-in-out py-3 px-8 h-fit hover:scale-85 hover:drop-shadow-none rounded ${cls} ${variantClass}`;

  if (onClick) {
    return (
      <button
        style={style}
        onClick={onClick}
        onMouseEnter={onMouseEnter as MouseEventHandler<HTMLButtonElement>}
        onMouseLeave={onMouseLeave as MouseEventHandler<HTMLButtonElement>}
        className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link
      to={link ?? "#"}
      style={style}
      onMouseEnter={onMouseEnter as MouseEventHandler<HTMLAnchorElement>}
      onMouseLeave={onMouseLeave as MouseEventHandler<HTMLAnchorElement>}
      className={className}>
      {label}
    </Link>
  );
}
