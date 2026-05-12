import { Header } from "@components";
import { useParams } from "react-router-dom";
import Configurator from "../components/storyConfigurator/Configurator";

export default function storyConfigurator() {
  const { folderName } = useParams();

  return (
    <main className="flex flex-col bg-white min-h-screen">
      <Configurator folderName={folderName} />
    </main>
  );
}
