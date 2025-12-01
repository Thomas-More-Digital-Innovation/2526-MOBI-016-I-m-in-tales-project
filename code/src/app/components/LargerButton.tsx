import Image from "next/image";
export default function LargerButton({label, link = "#", imageLink} : {label: string; link?: string; imageLink: string}) {
    return(
        <a href={link} className="hover:shadow-2xl p-10 border-2 rounded-2xl border-talesblu-400 hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300">
          <Image src={imageLink} alt="Image Icon" priority width={100} height={100} />
          {label}
        </a>
    )
}