export default function InputLabel({label, nameId, placeholder, required } : {label: string; nameId: string; placeholder?: string; required?: boolean }) {
    return(
        <div className="flex flex-col">
            <label htmlFor={nameId}>{label}</label>
            <input className="border rounded p-1 h-full" required={required} type="text" name={nameId} id={nameId} placeholder={placeholder} />
        </div>
    )
}