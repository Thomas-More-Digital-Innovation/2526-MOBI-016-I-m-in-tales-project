import { Link } from "react-router-dom";

export default function LargerButton({
  label,
  link = "#",
  imageLink,
}: {
  label: string;
  link?: string;
  imageLink: string;
}) {
  return (
    <Link
      to={link}
      className="inline-flex flex-col items-center text-center gap-4 p-[5vw] border-2 rounded-2xl border-talesblu-400 hover:shadow-2xl hover:bg-talesorang-400 hover:text-white hover:border-white ease-in-out duration-300"
    >
      <img src={imageLink} alt="Image Icon" width={100} height={100} />
      <span className="text-2xl font-semibold">{label}</span>
    </Link>
  );
}
