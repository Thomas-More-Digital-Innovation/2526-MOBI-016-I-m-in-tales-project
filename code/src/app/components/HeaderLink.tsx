export default function HeaderButton({label, link = "#"}: {label: string; link?: string}) {
    return (
        <a href={link} className="p-5 rounded-2xl m-5 text-3xl border-2 border-talesblu-400 text-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">{label}</a>
    )
}