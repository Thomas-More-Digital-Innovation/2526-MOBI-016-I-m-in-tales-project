import { FullScreenButton, HeaderButton } from '@components';
import Image from "next/image";
export default function Header({mainPage = false} : {mainPage?: boolean}) {
    // for the main page, no point in having a back button
    const backButton = mainPage ? null : (
        <HeaderButton label="<" link="../"/>
    );
    return (
        <div className="flex justify-between w-screen">
            <div className='flex'>
                {backButton}
                <FullScreenButton />
            </div>
            <Image src="/SmallLogo.svg" alt="Top logo" priority width={800} height={500}/>
            <HeaderButton label="?"/>
        </div>
    )
}