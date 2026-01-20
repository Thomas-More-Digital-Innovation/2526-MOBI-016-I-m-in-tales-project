
export default function Center({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center flex-col h-screen">
            {children}
        </div>
    );
}