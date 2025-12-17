import { Header, StageNode } from "@components";
import { useParams } from "react-router-dom";
export default function StoryConfigurator() {
    const { folderName } = useParams();

    return (
        <main className="flex flex-col">
            <Header />
            <StageNode folderName={folderName} />
        </main>
    );
}
