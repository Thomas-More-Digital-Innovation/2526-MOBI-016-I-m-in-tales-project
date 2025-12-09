import { ReactNode, useEffect } from "react";
import Button from "./Button";

interface ModalProps {
    isOpen: boolean;
    width: string;
    height: string;
    setIsOpen: (open: boolean) => void;
    onClose?: () => void;
    children: ReactNode;
}

export default function Modal({
    isOpen,
    width = "auto",
    height = "auto",
    setIsOpen,
    onClose,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    function close() {
        setIsOpen(false);
        onClose?.();
        window.removeEventListener("keydown", handleEscape);
    }

    function handleEscape(e: KeyboardEvent) {
        if (e.key === "Escape") {
            close();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleEscape);
    });

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={close}>
            <div
                style={{ width, height }}
                className="bg-white rounded-2xl mx-4 relative"
                onClick={(e) => e.stopPropagation()}>
                <Button onClick={close} cls="absolute top-2 right-2 z-100">
                    X
                </Button>
                {children}
            </div>
        </div>
    );
}
