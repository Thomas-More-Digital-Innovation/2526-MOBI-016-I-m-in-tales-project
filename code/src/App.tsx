import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./app/page";
import MakeStory from "./app/makeStory/page";
import ManageStory from "./app/manageStory/page";
import StoryOverview from "./app/storyOverview/page";
import PlayStory from "./app/playStory/page";
import Help from "./app/help/page";
import TestBoard from "./app/testBoard/page";
import StoryConfigurator from "./app/makeStory/storyConfigurator/page";

import { NfcProvider } from "./app/components/NfcProvider";
import TypesafeI18n from "./i18n/i18n-react";
import { detectLocale } from "./i18n/i18n-util";
import { loadAllLocales } from "./i18n/i18n-util.sync";
import { localStorageDetector } from "typesafe-i18n/detectors";

loadAllLocales();
const locale = detectLocale(localStorageDetector);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/makeStory",
    element: <MakeStory />,
  },
  {
    path: "/makeStory/:folderName",
    element: <MakeStory />,
  },
  {
    path: "/manageStory",
    element: <ManageStory />,
  },
  {
    path: "/makeStory/storyConfigurator/:folderName",
    element: <StoryConfigurator />,
  },
  {
    path: "/storyOverview",
    element: <StoryOverview mode={"view"} />,
  },
  {
    path: "/playStory/:id",
    element: <PlayStory />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/testBoard",
    element: <TestBoard />,
  },
]);

function App() {
  return (
    <NfcProvider>
      <TypesafeI18n locale={locale}>
        <RouterProvider router={router} />
      </TypesafeI18n>
    </NfcProvider>
  );
}

export default App;
