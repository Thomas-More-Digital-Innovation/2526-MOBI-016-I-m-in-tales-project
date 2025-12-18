import { ChangeEventHandler } from "react";
export default function InputLabel({
  label,
  nameId,
  placeholder,
  required,
  onChangeText,
  value,
}: {
  label: string;
  nameId?: string;
  placeholder?: string;
  required?: boolean;
  onChangeText?: ChangeEventHandler<HTMLInputElement>;
  value?: string;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={nameId}>{label}</label>
      <input
        className="border rounded p-1 h-full"
        required={required}
        type="text"
        onChange={onChangeText}
        value={value}
        name={nameId}
        id={nameId}
        placeholder={placeholder}
      />
    </div>
  );
}
