import type { ReactNode } from "react";

interface SidebarProps {
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}

export default function Sidebar({ side, children, className = "" }: SidebarProps) {
  const roundedClass = side === "left" ? "rounded-r-3xl" : "rounded-l-3xl";

  return (
    <div
      className={`flex flex-col h-full min-w-[320px] border-2 border-gray-100 ${roundedClass} p-4 space-y-4 overflow-y-auto shadow-sm bg-white ${className}`}
    >
      {children}
    </div>
  );
}
