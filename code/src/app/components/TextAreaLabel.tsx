export default function TextArea({label, nameId, placeholder, cols, rows } : {label: string; nameId: string; placeholder?: string; cols?: number; rows?: number; }) {
    return(
        <div className="flex flex-col">
            <label htmlFor={nameId}>{label}</label>
            <textarea className="border rounded p-1 h-full" cols={cols} rows={rows} name={nameId} id={nameId} placeholder={placeholder}></textarea>
        </div>
    )
}