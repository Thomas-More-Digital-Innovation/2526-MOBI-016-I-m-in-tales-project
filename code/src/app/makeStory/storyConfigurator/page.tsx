import { Header, StoryBuilder2 } from "@components"
import { useParams } from "react-router-dom"
export default function storyConfigurator() {
    const { folderName } = useParams();
    
    return (
        <main className="flex flex-col">
            <Header />
            <StoryBuilder2/>
        </main>
    )
}