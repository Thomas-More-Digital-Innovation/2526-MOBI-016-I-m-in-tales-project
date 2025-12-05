interface ButtonProps {
    children: React.ReactNode;
    primary?: boolean;
    onClick?: () => void;
    cls?: string
}

export default function Button({children, primary = false, cls = "", onClick}: ButtonProps) {
    return (
        <button onClick={onClick} className={`text-white font-bold py-2 px-4 rounded 
        ${cls} ${primary ? "bg-talesorang-400 hover:bg-talesorang-600" : "bg-talesblu-400 hover:bg-talesblu-600"} 
        transition cursor-pointer`} >
            {children}
        </button>
    );
}