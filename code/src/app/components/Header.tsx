import { FullScreenButton, HeaderButton } from '@components';
import Image from "next/image";
export default function Header() {
    return (
        <div className="flex justify-between w-screen">
            <HeaderButton label="<" link="../"/>
            <FullScreenButton />
            <Image src="/SmallLogo.svg" alt="Top logo" priority width={800} height={500}/>
            <HeaderButton label="?"/>
        </div>
    )
}