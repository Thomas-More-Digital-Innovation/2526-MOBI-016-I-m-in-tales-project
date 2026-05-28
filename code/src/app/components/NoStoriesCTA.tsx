import Center from "./Center";
import LargerButton from "./LargerButton";
import { useI18nContext } from "@/i18n/i18n-react";

export default function NoStoriesCTA() {
    const { LL } = useI18nContext();

    return (
        <Center>
            <p className="text-2xl py-4 text-gray-500 italic">{LL.OVERVIEW_EMPTY()}</p>
            <LargerButton label={LL.OVERVIEW_MAKE_FIRST()} link="/makeStory" imageLink="/MakeStory.svg" />
        </Center>
    )
}