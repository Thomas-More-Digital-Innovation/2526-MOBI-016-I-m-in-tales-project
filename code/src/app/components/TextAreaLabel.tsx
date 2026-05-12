import { ChangeEventHandler } from "react";

export default function TextArea({
    label,
    nameId,
    placeholder,
    cols,
    rows,
    onChangeText,
    value,
}: {
    label: string;
    nameId?: string;
    placeholder?: string;
    cols?: number;
    rows?: number;
    onChangeText?: ChangeEventHandler<HTMLTextAreaElement>;
    value?: string;
}) {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={nameId} className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{label}</label>
            <textarea
                className="w-full text-sm border-2 border-dashed border-gray-200 focus:border-talesorang-500 bg-gray-50/50 rounded-xl px-4 py-3 outline-none transition-all focus:ring-0 text-gray-700 placeholder:text-gray-300 resize-none leading-relaxed"
                onChange={onChangeText}
                cols={cols}
                rows={rows}
                name={nameId}
                id={nameId}
                placeholder={placeholder}
                value={value}></textarea>
        </div>
    );
}
