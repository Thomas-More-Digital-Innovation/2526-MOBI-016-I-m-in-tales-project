# i18n English + Dutch with Language Switcher — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire typesafe-i18n to serve English and Dutch across all app pages, with a language switcher in the Header that persists the choice to localStorage.

**Architecture:** Both locale files are loaded synchronously at app startup; the `TypesafeI18n` React provider wraps the entire router; any component calls `useI18nContext()` to get typed translation functions (`LL`) and `setLocale`. The `LanguageSwitcher` component lives inside `Header` and writes to localStorage on every change so `localStorageDetector` picks it up on the next launch.

**Tech Stack:** typesafe-i18n 5.27.1 (React adapter), React 19, Vite, TypeScript, Tailwind CSS v4, react-router-dom

---

### Task 1: Set up locale files

**Files:**
- Delete: `src/i18n/de/index.ts`
- Modify: `src/i18n/en/index.ts`
- Create: `src/i18n/nl/index.ts`

- [ ] **Step 1: Delete the German example locale**

Delete the file `src/i18n/de/index.ts` and then the now-empty `src/i18n/de/` directory.

- [ ] **Step 2: Replace `src/i18n/en/index.ts` with all English keys**

```ts
import type { BaseTranslation } from '../i18n-types'

const en = {
  HOME_PLAY_STORY: 'Play a story',
  HOME_MANAGE_STORY: 'Manage story',
  HOME_MAKE_STORY: 'Make a story',
  HOME_TOOLTIP_PLAY: 'Play stories made by you or others!',
  HOME_TOOLTIP_MANAGE: 'Click here to edit stories!',
  HOME_TOOLTIP_MAKE: 'Click here to make a new story!',
  HOME_TEST_CONNECTION: 'test connection',

  MANAGE_TITLE: 'Manage My Stories',
  MANAGE_LOADING_TITLE: 'Managing stories...',
  MANAGE_LOADING_DESC: "Please wait a moment, we're loading your library...",
  MANAGE_EMPTY: 'No stories found yet.',
  MANAGE_CREATE_FIRST: 'Start by creating your first story',
  MANAGE_EDIT_STORY: 'Edit Story',
  MANAGE_EXPORT_STORY: 'Export Story',
  MANAGE_DELETE_STORY: 'Delete Story',
  MANAGE_CONFIRM_DELETE: 'Are you sure you want to delete "{name:string}"? This action cannot be undone.',
  MANAGE_CONFIRM_DELETE_TITLE: 'Confirm Deletion',

  MAKE_TITLE_NEW: 'Create A New Story',
  MAKE_TITLE_EDIT: 'Edit Your Story',

  OVERVIEW_TITLE: 'My Stories',
  OVERVIEW_TOOLTIP: 'Select a story to play',
  OVERVIEW_LOADING_TITLE: 'Loading stories...',
  OVERVIEW_LOADING_DESC: "Please wait a moment, we're loading your library...",
  OVERVIEW_EMPTY: 'No stories found',
  OVERVIEW_MAKE_FIRST: 'Make your first story',
  OVERVIEW_IMAGE_ALT: 'story image not found',
  OVERVIEW_EDIT_STORY: 'Edit story',
  OVERVIEW_CALIBRATE: 'Calibrate Tags',

  HELP_TITLE: 'Help',
} satisfies BaseTranslation

export default en
```

- [ ] **Step 3: Create `src/i18n/nl/index.ts` with Dutch translations**

```ts
import type { Translation } from '../i18n-types'

const nl = {
  HOME_PLAY_STORY: 'Speel een verhaal',
  HOME_MANAGE_STORY: 'Beheer verhaal',
  HOME_MAKE_STORY: 'Maak een verhaal',
  HOME_TOOLTIP_PLAY: 'Speel verhalen die door jou of anderen zijn gemaakt!',
  HOME_TOOLTIP_MANAGE: 'Klik hier om verhalen te bewerken!',
  HOME_TOOLTIP_MAKE: 'Klik hier om een nieuw verhaal te maken!',
  HOME_TEST_CONNECTION: 'test verbinding',

  MANAGE_TITLE: 'Beheer Mijn Verhalen',
  MANAGE_LOADING_TITLE: 'Verhalen beheren...',
  MANAGE_LOADING_DESC: 'Even geduld, we laden je bibliotheek...',
  MANAGE_EMPTY: 'Nog geen verhalen gevonden.',
  MANAGE_CREATE_FIRST: 'Begin door je eerste verhaal te maken',
  MANAGE_EDIT_STORY: 'Bewerk verhaal',
  MANAGE_EXPORT_STORY: 'Exporteer verhaal',
  MANAGE_DELETE_STORY: 'Verwijder verhaal',
  MANAGE_CONFIRM_DELETE: 'Weet je zeker dat je "{name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.',
  MANAGE_CONFIRM_DELETE_TITLE: 'Verwijdering bevestigen',

  MAKE_TITLE_NEW: 'Maak een nieuw verhaal',
  MAKE_TITLE_EDIT: 'Bewerk je verhaal',

  OVERVIEW_TITLE: 'Mijn Verhalen',
  OVERVIEW_TOOLTIP: 'Selecteer een verhaal om af te spelen',
  OVERVIEW_LOADING_TITLE: 'Verhalen laden...',
  OVERVIEW_LOADING_DESC: 'Even geduld, we laden je bibliotheek...',
  OVERVIEW_EMPTY: 'Geen verhalen gevonden',
  OVERVIEW_MAKE_FIRST: 'Maak je eerste verhaal',
  OVERVIEW_IMAGE_ALT: 'verhaal afbeelding niet gevonden',
  OVERVIEW_EDIT_STORY: 'Bewerk verhaal',
  OVERVIEW_CALIBRATE: 'Kalibreer labels',

  HELP_TITLE: 'Help',
} satisfies Translation

export default nl
```

---

### Task 2: Regenerate typesafe-i18n types

**Files:**
- Regenerated (auto): `src/i18n/i18n-types.ts`
- Regenerated (auto): `src/i18n/i18n-util.ts`
- Regenerated (auto): `src/i18n/i18n-util.sync.ts`
- Regenerated (auto): `src/i18n/i18n-util.async.ts`
- Regenerated (auto): `src/i18n/i18n-react.tsx`
- Regenerated (auto): `src/i18n/formatters.ts`

- [ ] **Step 1: Run the typesafe-i18n generator**

From the project root (`code/`):
```bash
pnpm typesafe-i18n
```

Wait for output like:
```
[typesafe-i18n] generated files for locales: en, nl
```
Then press **Ctrl+C** to stop the watcher.

- [ ] **Step 2: Verify the generated `src/i18n/i18n-types.ts` now includes both locales**

Open `src/i18n/i18n-types.ts` and confirm it contains:
```ts
export type Locales =
  | 'en'
  | 'nl'
```
Also confirm `RootTranslation` now has all the keys (e.g. `HOME_PLAY_STORY`, `MANAGE_TITLE`, etc.) and `TranslationFunctions` has matching typed function signatures.

- [ ] **Step 3: Verify `src/i18n/i18n-util.ts` now lists both locales**

Open `src/i18n/i18n-util.ts` and confirm:
```ts
export const locales: Locales[] = [
  'en',
  'nl',
]
```

- [ ] **Step 4: Verify `src/i18n/i18n-util.sync.ts` imports both locale files**

Open `src/i18n/i18n-util.sync.ts` and confirm it has static imports for both `en` and `nl` and `localeTranslations` maps them. It should look approximately like:
```ts
import en from './en'
import nl from './nl'

const localeTranslations = {
  en,
  nl,
}
```

---

### Task 3: Wire the i18n provider in `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace the entire content of `src/App.tsx`**

```tsx
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
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 4: Create `LanguageSwitcher` component

**Files:**
- Create: `src/app/components/LanguageSwitcher.tsx`
- Modify: `src/app/components/index.ts`

- [ ] **Step 1: Create `src/app/components/LanguageSwitcher.tsx`**

```tsx
import { useI18nContext } from "@/i18n/i18n-react";
import type { Locales } from "@/i18n/i18n-types";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18nContext();

  const switchLocale = (next: Locales) => {
    localStorage.setItem("lang", next);
    setLocale(next);
  };

  const activeClass =
    "bg-[#0d4254] shadow-[0px_1px_2px_1px_#6e8e98] text-white font-bold";
  const inactiveClass =
    "bg-[#0d4254]/40 text-white/70 hover:bg-[#0d4254]/60 font-semibold";

  return (
    <div className="flex rounded overflow-hidden">
      <button
        onClick={() => switchLocale("en")}
        className={`cursor-pointer text-sm py-2 px-3 transition-all duration-150 ${locale === "en" ? activeClass : inactiveClass}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("nl")}
        className={`cursor-pointer text-sm py-2 px-3 transition-all duration-150 ${locale === "nl" ? activeClass : inactiveClass}`}
      >
        NL
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Export from `src/app/components/index.ts`**

Add this line at the end of `src/app/components/index.ts`:
```ts
export { default as LanguageSwitcher } from "./LanguageSwitcher";
```

- [ ] **Step 3: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 5: Add `LanguageSwitcher` to `Header`

**Files:**
- Modify: `src/app/components/Header.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/components/Header.tsx`**

```tsx
import type { ReactNode } from "react";
import FullScreenButton from "./FullScreenButton";
import HeaderButton from "./HeaderLink";
import { NfcBadge } from "./NfcBadge";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  showPreviousButton?: boolean;
  onBack?: () => void;
  onHelpHover?: (visible: boolean) => void;
  rightExtra?: ReactNode;
  title?: string;
}

export default function Header({ showPreviousButton = true, onBack, onHelpHover, title, rightExtra }: HeaderProps) {
  const backIcon = <img src="/back.svg" alt="back" width={36} height={36} style={{ filter: "brightness(0) invert(1)" }} />;

  const backButton = onBack ? (
    <HeaderButton label={backIcon} onClick={onBack} />
  ) : (showPreviousButton ? <HeaderButton label={backIcon} link="../" /> : null);

  const helpHoverHandlers = onHelpHover
    ? {
        onMouseEnter: () => onHelpHover(true),
        onMouseLeave: () => onHelpHover(false),
      }
    : {};

  return (
    <div className="flex justify-between items-center relative w-screen">
      <div className="flex items-center gap-3 p-3">
        <img src="/Logo.svg" alt="Top logo" width={300} height={300} />
        <NfcBadge />
      </div>
      <h1 className="text-4xl text-talesblu-700 min-w-fit font-extrabold text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {title}
      </h1>
      <div className="flex items-center gap-3 p-3">
        {backButton}
        {rightExtra}
        <LanguageSwitcher />
        <FullScreenButton />
        <HeaderButton label="?" {...helpHoverHandlers} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 6: Replace strings in Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/page.tsx`**

```tsx
import { Header, HeaderButton, LargerButton, ToolTip } from "@components";
import { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Home() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-col justify-between items-center h-screen">
      <Header showPreviousButton={false} onHelpHover={setShowToolTip} />
      <div className="gap-3 justify-between flex">
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_PLAY()} absolute cls="max-w-[250px]" />}
          <LargerButton label={LL.HOME_PLAY_STORY()} link="/storyOverview" imageLink="/PlayStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_MANAGE()} absolute />}
          <LargerButton label={LL.HOME_MANAGE_STORY()} link="/manageStory" imageLink="/ManageStory.svg" />
        </div>
        <div className="relative">
          {showToolTip && <ToolTip text={LL.HOME_TOOLTIP_MAKE()} absolute />}
          <LargerButton label={LL.HOME_MAKE_STORY()} link="/makeStory" imageLink="/MakeStory.svg" />
        </div>
      </div>
      <div className="w-screen p-5 flex flex-col gap-2 items-end relative">
        {showToolTip && <ToolTip text="Test the connection to the board!" absolute cls="-top-5 right-20" />}
        <HeaderButton link="/testBoard" label={LL.HOME_TEST_CONNECTION()} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 7: Replace strings in ManageStory page

**Files:**
- Modify: `src/app/manageStory/page.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/manageStory/page.tsx`**

```tsx
import { useEffect, useState } from "react";
import { Header, Button, StoryCard, ImportButton, LoadingScreen } from "@components";
import { getStoriesOverview, removeStoryData, StoryPreview, exportStory } from "@utils/storyIO";
import { useNavigate } from "react-router-dom";
import { ask } from "@tauri-apps/plugin-dialog";
import { useI18nContext } from "@/i18n/i18n-react";

export default function ManageStory() {
  const [stories, setStories] = useState<StoryPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { LL } = useI18nContext();

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    const data = await getStoriesOverview();
    setStories(data);
    setLoading(false);
  };

  const handleDelete = async (story: StoryPreview) => {
    const confirmed = await ask(
      LL.MANAGE_CONFIRM_DELETE({ name: story.name }),
      { title: LL.MANAGE_CONFIRM_DELETE_TITLE(), kind: "warning" }
    );

    if (confirmed) {
      await removeStoryData(story.id);
      await loadStories();
    }
  };

  const handleEdit = (story: StoryPreview) => {
    navigate(`/makeStory/${story.id}`);
  };

  const handleExport = async (story: StoryPreview) => {
    try {
      await exportStory(story.id);
    } catch (e) {
      console.error("Export failed:", e);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header title={LL.MANAGE_TITLE()} rightExtra={<ImportButton onImportSuccess={loadStories} />} />
      <div className="mx-auto px-6">
        {loading ? (
          <LoadingScreen
            title={LL.MANAGE_LOADING_TITLE()}
            description={LL.MANAGE_LOADING_DESC()}
            imageSrc="/ManageStory.svg"
          />
        ) : stories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-medium">{LL.MANAGE_EMPTY()}</p>
            <Button onClick={() => navigate('/makeStory')} cls="mt-6 !bg-transparent !text-talesorang-500 hover:underline">
              {LL.MANAGE_CREATE_FIRST()}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={{
                  id: story.id,
                  name: story.name,
                  description: story.description,
                  image: story.thumbnailUrl,
                  chapter: []
                } as any}
                actions={
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(story)}
                      cls="flex-1 !rounded-xl !py-3 !h-12 !bg-talesblu-600 hover:!bg-talesblu-700 shadow-md transition-all font-bold uppercase text-[10px] tracking-widest"
                    >
                      {LL.MANAGE_EDIT_STORY()}
                    </Button>
                    <Button
                      onClick={() => handleExport(story)}
                      cls="!bg-talesorang-50 !text-talesorang-500 !text-white hover:!bg-talesorang-500 !w-12 !h-12 !rounded-xl !py-3 !px-4 shadow-sm transition-all flex items-center justify-center"
                      title={LL.MANAGE_EXPORT_STORY()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 16V4M8 8l4-4 4 4" />
                      </svg>
                    </Button>
                    <Button
                      onClick={() => handleDelete(story)}
                      cls="!bg-red-50 !text-red-500 hover:!bg-red-500 !w-12 !h-12 hover:!text-white !rounded-xl !py-3 !px-4 shadow-sm transition-all flex items-center justify-center"
                      title={LL.MANAGE_DELETE_STORY()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 8: Replace strings in MakeStory page

**Files:**
- Modify: `src/app/makeStory/page.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/makeStory/page.tsx`**

```tsx
import { Header } from "@components";
import { useState } from "react";
import { useParams } from "react-router-dom";
import MakeStoryCard from "./components/MakeStoryCard";
import { useI18nContext } from "@/i18n/i18n-react";

export default function makeStory() {
  const [showToolTip, setShowToolTip] = useState(false);
  const { folderName } = useParams();
  const { LL } = useI18nContext();

  return (
    <main className="h-screen bg-gray-50">
      <Header
        onHelpHover={setShowToolTip}
        title={folderName ? LL.MAKE_TITLE_EDIT() : LL.MAKE_TITLE_NEW()}
      />
      <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-8">
        <MakeStoryCard folderName={folderName} />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 9: Replace strings in StoryOverview page

**Files:**
- Modify: `src/app/storyOverview/page.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/storyOverview/page.tsx`**

```tsx
import { Center, Header, LargerButton, ToolTip, ImportButton, LoadingScreen } from "@components";
import { useState, useEffect, useCallback } from "react";
import StoryCard from "../components/StoryCard";
import Modal from "../components/Modal";
import PlayStoryButton from "./PlayStoryButton";
import CalibrationModal from "../components/CalibrationModal";
import { getStoriesOverview, StoryPreview } from "@/utils/storyIO";
import { useI18nContext } from "@/i18n/i18n-react";
import type { TranslationFunctions } from "@/i18n/i18n-types";

type Mode = "view" | "edit";

interface StoryCardData {
  id: string;
  internalId: string;
  name: string;
  description: string;
  image: string;
}

export default function StoryOverview({ mode = "view" }: { mode: Mode }) {
  const [stories, setStories] = useState<StoryCardData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<StoryCardData | null>(null);
  const [showToolTip, setShowToolTip] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { LL } = useI18nContext();

  const fetchStories = useCallback(() => {
    getStoriesOverview()
      .then((previews: StoryPreview[]) => {
        const storyCards = previews.map((preview) => ({
          id: preview.id,
          internalId: preview.internalId,
          name: preview.name,
          description: preview.description,
          image: preview.thumbnailUrl,
        }));
        setStories(storyCards);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching stories:", error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  return (
    <main className="bg-white h-screen">
      <Header onHelpHover={setShowToolTip} title={LL.OVERVIEW_TITLE()} />
      {showToolTip && (<ToolTip text={LL.OVERVIEW_TOOLTIP()} cls="top-20 right-4" absolute />)}
      <div className="h-80 flex justify-center items-center flex-wrap">
        {isLoading ? (
          <LoadingScreen
            title={LL.OVERVIEW_LOADING_TITLE()}
            description={LL.OVERVIEW_LOADING_DESC()}
            imageSrc="/PlayStory.svg"
          />
        ) : stories.length > 0 ? stories.map((element) => (
          <StoryCard
            key={element.id}
            story={element as any}
            onClick={(story) => {
              setSelectedStory(story as any);
              setIsOpen(true);
            }}
          />
        )) : (
          <Center>
            <p className="text-2xl py-4">{LL.OVERVIEW_EMPTY()}</p>
            <LargerButton label={LL.OVERVIEW_MAKE_FIRST()} link="/makeStory" imageLink="/MakeStory.svg" />
          </Center>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        width="70%"
        height="70%"
        setIsOpen={setIsOpen}
        onClose={() => setSelectedStory(null)}
      >
        {selectedStory ? StoryModal(selectedStory, mode, () => setIsCalibrationOpen(true), LL) : null}
      </Modal>

      {selectedStory && (
        <CalibrationModal
          isOpen={isCalibrationOpen}
          setIsOpen={setIsCalibrationOpen}
          storyId={selectedStory.internalId}
          storyName={selectedStory.id}
        />
      )}
    </main>
  );
}

function StoryModal(
  selectedStory: StoryCardData,
  mode: Mode,
  onCalibrate: () => void,
  LL: TranslationFunctions,
) {
  return (
    <div className="relative h-full">
      <img
        width={"100%"}
        height={"100%"}
        src={selectedStory.image}
        className="h-full w-full object-cover rounded-2xl"
        alt={LL.OVERVIEW_IMAGE_ALT()}
      />
      <div className="p-4 absolute bottom-0 w-full bg-black/70 rounded-b-2xl">
        <div className="py-2">
          <h1 className="text-2xl text-white">{selectedStory.name}</h1>
          <p className="text-white">{selectedStory.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {mode === "view" ? <PlayStoryButton id={selectedStory.id} /> : <h3 className="text-white">{LL.OVERVIEW_EDIT_STORY()}</h3>}
          <button
            onClick={onCalibrate}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors backdrop-blur-sm border border-white/30"
          >
            {LL.OVERVIEW_CALIBRATE()}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type check**

```bash
pnpm tsc
```
Expected: no errors.

---

### Task 10: Replace strings in Help page and final verification

**Files:**
- Modify: `src/app/help/page.tsx`

- [ ] **Step 1: Replace the entire content of `src/app/help/page.tsx`**

```tsx
import { Header } from "@components";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Help() {
  const { LL } = useI18nContext();

  return (
    <main className="bg-white h-screen">
      <Header />
      <div className="h-screen flex justify-center items-center">
        <h1>{LL.HELP_TITLE()}</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Final type check — all files**

```bash
pnpm tsc
```
Expected: no errors. This confirms every `LL.KEY()` call uses a valid key and every key has been given the right argument shape.

- [ ] **Step 3: Smoke test the app**

```bash
pnpm dev
```

Open the app. Verify:
1. The header shows **EN** (highlighted) and **NL** buttons.
2. Clicking **NL** switches all visible text to Dutch immediately.
3. Clicking **EN** switches back to English.
4. Reload the app — the language you last selected is still active (persisted via localStorage).
5. Navigate between pages (Home, Manage, Make, Overview, Help) — all text is in the selected language on every page.
