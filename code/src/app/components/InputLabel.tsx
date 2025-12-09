export default function InputLabel({label, nameId, placeholder } : {label: string; nameId: string; placeholder?: string }) {
    return(
        <div className="flex flex-col">
            <label htmlFor={nameId}>{label}</label>
            <input className="border rounded p-1 h-full" type="text" name={nameId} id={nameId} placeholder={placeholder} />
        </div>
    )
}