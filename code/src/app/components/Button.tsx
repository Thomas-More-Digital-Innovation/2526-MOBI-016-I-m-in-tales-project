interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    cls?: string;
    primary?: boolean;
    style?: React.CSSProperties;
}

export default function Button({
    children,
    primary = false,
    cls = "",
    onClick,
    style,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={` font-bold py-2 px-4 rounded 
        ${cls} text-white ${
                primary
                    ? "bg-talesorang-400 hover:bg-talesorang-300"
                    : "bg-talesblu-400 hover:bg-talesblu-300"
            } 
        transition cursor-pointer`}
            style={style}>
            {children}
        </button>
    );
}
