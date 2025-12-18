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
    <div className="flex flex-col">
      <label htmlFor={nameId}>{label}</label>
      <textarea
        className="border rounded p-1 h-full"
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
