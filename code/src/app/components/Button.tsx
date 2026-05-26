import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    cls?: string;
    primary?: boolean;
    style?: CSSProperties;
    title?: string;
}

export default function Button({ children, cls = "", onClick, style, primary = false, title = "" }: ButtonProps) {
    const variantClass = primary ? "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98]" : "bg-[#f6745e] shadow-[0px_1px_2px_1px_#faac9e]";

    return (
        <button
            onClick={onClick}
            style={style}
            className={`text-3xl cursor-pointer font-semibold duration-150 ease-in-out py-3 px-8 h-fit hover:scale-85 hover:drop-shadow-none text-white rounded ${cls} ${variantClass}`}
            title={title}
        >
            {children}
        </button>
    );
}
