interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    cls?: string;
    primary?: boolean;
    style?: React.CSSProperties;
}

export default function Button({children?, cls? = "", onClick?, style?}: ButtonProps) {
    return (
        <button onClick={onClick} style={style} className={`text-3xl cursor-pointer font-semibold duration-150 ease-in-out py-3 px-8 h-fit shadow-[0px_1px_2px_1px_#cfcfcf] bg-[#f0f0f0] hover:scale-85 hover:drop-shadow-none text-[#242424] rounded ${cls}`} >
            {children}
        </button>
    );
}
