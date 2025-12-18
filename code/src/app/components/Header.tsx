import { FullScreenButton, HeaderButton } from '@components';

export default function Header({mainPage = false} : {mainPage?: boolean}) {
    // for the main page, no point in having a back button
    const backButton = mainPage ? null : (
        <HeaderButton label="<" link="../"/>
    );
    return (
        <div className="flex justify-between items-center w-screen">
            <img src="/Logo.svg" alt="Top logo" width={300} height={300}/>
            <div className='flex gap-3 p-3'>
                {backButton}
                <FullScreenButton />
                <HeaderButton label="?"/>
            </div>
        </div>
    )
}
