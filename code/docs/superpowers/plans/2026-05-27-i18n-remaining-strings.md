# i18n Remaining Strings — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate every remaining hardcoded string in the app (components, placeholders, Dutch-only strings) through the typesafe-i18n system.

**Architecture:** Same pattern as the first i18n pass — add keys to locale files, regenerate types, then replace hardcoded strings in each component with `LL.KEY()` calls via `useI18nContext()`.

**Tech Stack:** typesafe-i18n 5.27.1 (React adapter), React 19, Vite, TypeScript, Tailwind CSS v4

---

### Task 1: Add all new translation keys to locale files

**Files:**
- Modify: `src/i18n/en/index.ts`
- Modify: `src/i18n/nl/index.ts`

- [ ] **Step 1: Replace `src/i18n/en/index.ts` with the full updated English translations**

```ts
import type { BaseTranslation } from '../i18n-types'

const en = {
  // Home page
  HOME_PLAY_STORY: 'Play a story',
  HOME_MANAGE_STORY: 'Manage story',
  HOME_MAKE_STORY: 'Make a story',
  HOME_TOOLTIP_PLAY: 'Play stories made by you or others!',
  HOME_TOOLTIP_MANAGE: 'Click here to edit stories!',
  HOME_TOOLTIP_MAKE: 'Click here to make a new story!',
  HOME_TEST_CONNECTION: 'test connection',

  // Manage Story page
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

  // Make Story page
  MAKE_TITLE_NEW: 'Create A New Story',
  MAKE_TITLE_EDIT: 'Edit Your Story',

  // Story Overview page
  OVERVIEW_TITLE: 'My Stories',
  OVERVIEW_TOOLTIP: 'Select a story to play',
  OVERVIEW_LOADING_TITLE: 'Loading stories...',
  OVERVIEW_LOADING_DESC: "Please wait a moment, we're loading your library...",
  OVERVIEW_EMPTY: 'No stories found',
  OVERVIEW_MAKE_FIRST: 'Make your first story',
  OVERVIEW_IMAGE_ALT: 'story image not found',
  OVERVIEW_EDIT_STORY: 'Edit story',
  OVERVIEW_CALIBRATE: 'Calibrate Tags',

  // Help page
  HELP_TITLE: 'Help',

  // StoryCard component
  STORY_CARD_EXPORT: 'Export story',
  STORY_CARD_DELETE: 'Delete story',
  STORY_CARD_CONFIRM_TITLE: 'Delete story?',
  STORY_CARD_CONFIRM_MSG: '"{name:string}" will be permanently deleted.',
  STORY_CARD_CANCEL: 'Cancel',
  STORY_CARD_DELETE_BTN: 'Delete',

  // ImageUpload component
  IMAGE_NO_IMAGE: 'No Image',

  // AudioUpload component
  AUDIO_CHANGE: 'Change Audio',
  AUDIO_UPLOAD: 'Upload Audio',

  // NfcBadge component
  NFC_ACTIVE: 'Whisper Active',
  NFC_ERROR: 'Whisper Error',
  NFC_OFFLINE: 'Whisper Offline',
  NFC_TITLE: 'Whisper is the codename for the NFC reader',

  // CalibrationModal component
  CALIB_TITLE: 'Calibrate Story:',
  CALIB_DESC: 'Link your physical tags to the items in this story.',
  CALIB_UNNAMED: 'Unnamed Item',
  CALIB_LINKED_TAG: 'Linked Tag',
  CALIB_NOT_CALIBRATED: 'Not calibrated',
  CALIB_SCANNING: 'Scanning...',
  CALIB_BTN: 'Calibrate',
  CALIB_RECALIBRATE: 'Re-calibrate',
  CALIB_CONNECT_READER: 'Connect Whisper reader...',
  CALIB_PLACE_TAG: 'Place tag on reader...',
  CALIB_CONFIRM_LINK: 'Confirm Link',
  CALIB_NO_ITEMS: 'This story has no interactive items.',
  CALIB_DONE: 'Done',

  // MakeStoryCard component
  MAKE_CARD_NAME_REQUIRED: 'Please enter a story name',
  MAKE_CARD_NAME_LABEL: 'Story Name',
  MAKE_CARD_NAME_PLACEHOLDER: 'Story Title',
  MAKE_CARD_DESC_LABEL: 'Description',
  MAKE_CARD_DESC_PLACEHOLDER: 'Tell a bit about your story...',
  MAKE_CARD_UPDATE: 'Update & Continue',
  MAKE_CARD_START: 'Start Telling Your Story',

  // Configurator component
  CONFIG_LOADING_TITLE: 'Loading design environment',
  CONFIG_LOADING_DESC: 'Loading chapters and interactive paths...',
  CONFIG_UNSAVED_MSG: 'Are you sure you want to leave? Unsaved changes will not be saved.',
  CONFIG_UNSAVED_TITLE: 'Unsaved Changes',
  CONFIG_NEW_STORY: 'New Story',
  CONFIG_CHAPTER_SINGULAR: 'Chapter',
  CONFIG_CHAPTER_PLURAL: 'Chapters',
  CONFIG_ADD_CHAPTER: '+ Add New Chapter',
  CONFIG_SAVE: 'Save Changes',
  CONFIG_SAVED: 'Saved',

  // NodeSidebar component
  NODE_SELECT_HINT: 'Select a chapter to start editing',
  NODE_EDIT_CHAPTER: 'Edit Chapter',
  NODE_DELETE_CHAPTER: 'Delete Chapter',
  NODE_CHAPTER_TITLE_LABEL: 'Chapter Title',
  NODE_CHAPTER_TITLE_PH: 'Name your chapter...',
  NODE_DESC_LABEL: 'Description',
  NODE_DESC_PH: 'What happens in this chapter?',
  NODE_ILLUSTRATION: 'Illustration',
  NODE_NARRATION: 'Narration',
  NODE_FAIL_AUDIO: 'Fail Audio (Optional)',
  NODE_LINKS: 'Links & Interactions',
  NODE_ADD_LINK: '+ Add Link',
  NODE_LINKING: 'Linking...',
  NODE_INTERACTION_PH: 'Name your interaction...',
  NODE_INTERACTION_REQUIRED: 'Label is required for this interaction',
  NODE_TAG_NOT_LINKED: 'Tag: Not Linked',
  NODE_UPDATE: 'Update',
  NODE_LINK_TAG: 'Link Tag',
  NODE_WAIT_TAG: 'Wait Tag...',
  NODE_OFFLINE: 'Offline',

  // StoryCanvas component
  CANVAS_NO_IMAGE: 'No Image',
  CANVAS_HINT: 'Click + drag to pan \n Click on a chapter to select it \n Scroll to zoom in \n Use the button above to add a new chapter',

  // PlayStory page
  PLAY_LOADING_TITLE: 'Loading story',
  PLAY_LOADING_DESC: "We're getting the interactive experience ready for you...",
  PLAY_NOT_FOUND: 'Story not found',
  PLAY_LOADING: 'Loading...',

  // SettingsModal component
  SETTINGS_TEXT_SIZE: 'Text Size',
  SETTINGS_VOLUME: 'Volume',

  // StoryHeader component
  STORY_SETTINGS: 'Settings',
  STORY_REPLAY_AUDIO: 'Replay audio',

  // StoryOverlay component
  STORY_END: 'This is the end of the story. Press any key to close the story.',

  // StoryOptions component
  STORY_OPTION_AUDIO: '(Audio)',

  // StoryVisuals component
  STORY_BG_ALT: 'Story Background',

  // TestBoard page
  TEST_TITLE: 'Whisper Tester',
  TEST_SCANNER_STATUS: 'Scanner Status',
  TEST_ACTIVE_POLLING: 'Active & Polling',
  TEST_HARDWARE_UID: 'Hardware UID',
  TEST_NDEF_CONTENT: 'NDEF Content',
  TEST_ASSIGNED_LABELS: 'Assigned Labels',
  TEST_SEARCHING: 'Searching stories...',
  TEST_NO_CALIBRATIONS: 'No active calibrations found for this tag in any story.',
  TEST_OFFLINE: 'Whisper Offline',
  TEST_WAITING: 'Waiting for Tag...',
  TEST_CONNECTION_ISSUE: 'Connection Issue',

  // AssignedLabelsTable component
  TABLE_STORY: 'Story',
  TABLE_LABEL: 'Label',

  // PlayStoryButton component
  PLAY_BTN: 'Start story',
} satisfies BaseTranslation

export default en
```

- [ ] **Step 2: Replace `src/i18n/nl/index.ts` with the full updated Dutch translations**

```ts
import type { Translation } from '../i18n-types'

const nl = {
  // Home page
  HOME_PLAY_STORY: 'Speel een verhaal',
  HOME_MANAGE_STORY: 'Beheer verhaal',
  HOME_MAKE_STORY: 'Maak een verhaal',
  HOME_TOOLTIP_PLAY: 'Speel verhalen die door jou of anderen zijn gemaakt!',
  HOME_TOOLTIP_MANAGE: 'Klik hier om verhalen te bewerken!',
  HOME_TOOLTIP_MAKE: 'Klik hier om een nieuw verhaal te maken!',
  HOME_TEST_CONNECTION: 'test verbinding',

  // Manage Story page
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

  // Make Story page
  MAKE_TITLE_NEW: 'Maak een nieuw verhaal',
  MAKE_TITLE_EDIT: 'Bewerk je verhaal',

  // Story Overview page
  OVERVIEW_TITLE: 'Mijn Verhalen',
  OVERVIEW_TOOLTIP: 'Selecteer een verhaal om af te spelen',
  OVERVIEW_LOADING_TITLE: 'Verhalen laden...',
  OVERVIEW_LOADING_DESC: 'Even geduld, we laden je bibliotheek...',
  OVERVIEW_EMPTY: 'Geen verhalen gevonden',
  OVERVIEW_MAKE_FIRST: 'Maak je eerste verhaal',
  OVERVIEW_IMAGE_ALT: 'verhaal afbeelding niet gevonden',
  OVERVIEW_EDIT_STORY: 'Bewerk verhaal',
  OVERVIEW_CALIBRATE: 'Kalibreer labels',

  // Help page
  HELP_TITLE: 'Help',

  // StoryCard component
  STORY_CARD_EXPORT: 'Exporteer verhaal',
  STORY_CARD_DELETE: 'Verwijder verhaal',
  STORY_CARD_CONFIRM_TITLE: 'Verhaal verwijderen?',
  STORY_CARD_CONFIRM_MSG: '"{name}" wordt permanent verwijderd.',
  STORY_CARD_CANCEL: 'Annuleren',
  STORY_CARD_DELETE_BTN: 'Verwijderen',

  // ImageUpload component
  IMAGE_NO_IMAGE: 'Geen afbeelding',

  // AudioUpload component
  AUDIO_CHANGE: 'Verander audio',
  AUDIO_UPLOAD: 'Upload audio',

  // NfcBadge component
  NFC_ACTIVE: 'Whisper actief',
  NFC_ERROR: 'Whisper fout',
  NFC_OFFLINE: 'Whisper offline',
  NFC_TITLE: 'Whisper is de codenaam voor de NFC-lezer',

  // CalibrationModal component
  CALIB_TITLE: 'Verhaal kalibreren:',
  CALIB_DESC: 'Koppel je fysieke labels aan de items in dit verhaal.',
  CALIB_UNNAMED: 'Naamloos item',
  CALIB_LINKED_TAG: 'Gekoppeld label',
  CALIB_NOT_CALIBRATED: 'Niet gekalibreerd',
  CALIB_SCANNING: 'Scannen...',
  CALIB_BTN: 'Kalibreren',
  CALIB_RECALIBRATE: 'Opnieuw kalibreren',
  CALIB_CONNECT_READER: 'Sluit Whisper-lezer aan...',
  CALIB_PLACE_TAG: 'Leg label op lezer...',
  CALIB_CONFIRM_LINK: 'Koppeling bevestigen',
  CALIB_NO_ITEMS: 'Dit verhaal heeft geen interactieve items.',
  CALIB_DONE: 'Klaar',

  // MakeStoryCard component
  MAKE_CARD_NAME_REQUIRED: 'Voer een verhaalname in',
  MAKE_CARD_NAME_LABEL: 'Verhaalname',
  MAKE_CARD_NAME_PLACEHOLDER: 'Verhaal titel',
  MAKE_CARD_DESC_LABEL: 'Beschrijving',
  MAKE_CARD_DESC_PLACEHOLDER: 'Vertel iets over je verhaal...',
  MAKE_CARD_UPDATE: 'Bijwerken & doorgaan',
  MAKE_CARD_START: 'Begin je verhaal te vertellen',

  // Configurator component
  CONFIG_LOADING_TITLE: 'Ontwerpomgeving laden',
  CONFIG_LOADING_DESC: 'We laden de hoofdstukken en interactieve paden in...',
  CONFIG_UNSAVED_MSG: 'Weet je zeker dat je wilt vertrekken? Niet-opgeslagen wijzigingen gaan verloren.',
  CONFIG_UNSAVED_TITLE: 'Niet-opgeslagen wijzigingen',
  CONFIG_NEW_STORY: 'Nieuw verhaal',
  CONFIG_CHAPTER_SINGULAR: 'Hoofdstuk',
  CONFIG_CHAPTER_PLURAL: 'Hoofdstukken',
  CONFIG_ADD_CHAPTER: '+ Nieuw hoofdstuk toevoegen',
  CONFIG_SAVE: 'Wijzigingen opslaan',
  CONFIG_SAVED: 'Opgeslagen',

  // NodeSidebar component
  NODE_SELECT_HINT: 'Selecteer een hoofdstuk om te bewerken',
  NODE_EDIT_CHAPTER: 'Hoofdstuk bewerken',
  NODE_DELETE_CHAPTER: 'Hoofdstuk verwijderen',
  NODE_CHAPTER_TITLE_LABEL: 'Hoofdstuktitel',
  NODE_CHAPTER_TITLE_PH: 'Naam je hoofdstuk...',
  NODE_DESC_LABEL: 'Beschrijving',
  NODE_DESC_PH: 'Wat gebeurt er in dit hoofdstuk?',
  NODE_ILLUSTRATION: 'Illustratie',
  NODE_NARRATION: 'Vertelling',
  NODE_FAIL_AUDIO: 'Fout audio (optioneel)',
  NODE_LINKS: 'Koppelingen & interacties',
  NODE_ADD_LINK: '+ Koppeling toevoegen',
  NODE_LINKING: 'Koppelen...',
  NODE_INTERACTION_PH: 'Naam je interactie...',
  NODE_INTERACTION_REQUIRED: 'Label is verplicht voor deze interactie',
  NODE_TAG_NOT_LINKED: 'Label: niet gekoppeld',
  NODE_UPDATE: 'Bijwerken',
  NODE_LINK_TAG: 'Label koppelen',
  NODE_WAIT_TAG: 'Wacht op label...',
  NODE_OFFLINE: 'Offline',

  // StoryCanvas component
  CANVAS_NO_IMAGE: 'Geen afbeelding',
  CANVAS_HINT: 'Klik + sleep om te pannen \n Klik op een hoofdstuk om het te selecteren \n Scroll om in te zoomen \n Gebruik de knop hierboven om een nieuw hoofdstuk toe te voegen',

  // PlayStory page
  PLAY_LOADING_TITLE: 'Verhaal laden',
  PLAY_LOADING_DESC: 'We maken de interactieve ervaring voor je klaar...',
  PLAY_NOT_FOUND: 'Verhaal niet gevonden',
  PLAY_LOADING: 'Laden...',

  // SettingsModal component
  SETTINGS_TEXT_SIZE: 'Tekst grootte',
  SETTINGS_VOLUME: 'Volume',

  // StoryHeader component
  STORY_SETTINGS: 'Instellingen',
  STORY_REPLAY_AUDIO: 'Geluid opnieuw spelen',

  // StoryOverlay component
  STORY_END: 'Dit is het einde van het verhaal. Druk op een toets om het verhaal af te sluiten.',

  // StoryOptions component
  STORY_OPTION_AUDIO: '(Audio)',

  // StoryVisuals component
  STORY_BG_ALT: 'Verhaal achtergrond',

  // TestBoard page
  TEST_TITLE: 'Whisper tester',
  TEST_SCANNER_STATUS: 'Scannerstatus',
  TEST_ACTIVE_POLLING: 'Actief & polling',
  TEST_HARDWARE_UID: 'Hardware UID',
  TEST_NDEF_CONTENT: 'NDEF inhoud',
  TEST_ASSIGNED_LABELS: 'Toegewezen labels',
  TEST_SEARCHING: 'Verhalen zoeken...',
  TEST_NO_CALIBRATIONS: 'Geen actieve kalibraties gevonden voor dit label in een verhaal.',
  TEST_OFFLINE: 'Whisper offline',
  TEST_WAITING: 'Wachten op label...',
  TEST_CONNECTION_ISSUE: 'Verbindingsprobleem',

  // AssignedLabelsTable component
  TABLE_STORY: 'Verhaal',
  TABLE_LABEL: 'Label',

  // PlayStoryButton component
  PLAY_BTN: 'Start verhaal',
} satisfies Translation

export default nl
```

---

### Task 2: Regenerate typesafe-i18n types

**Files:**
- Regenerated (auto): `src/i18n/i18n-types.ts`, `src/i18n/i18n-util.ts`, `src/i18n/i18n-util.sync.ts`

- [ ] **Step 1: Run the generator**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm typesafe-i18n
```

Wait for output showing files generated, then **Ctrl+C**.

- [ ] **Step 2: Verify `i18n-types.ts` has all new keys**

Open `src/i18n/i18n-types.ts` and confirm `RootTranslation` and `TranslationFunctions` include representative new keys like `STORY_CARD_EXPORT`, `CALIB_DONE`, `NODE_OFFLINE`, `PLAY_BTN`, `TEST_CONNECTION_ISSUE`.

Also confirm `STORY_CARD_CONFIRM_MSG` is typed as `(arg: { name: string }) => LocalizedString`.

---

### Task 3: Update StoryCard, ImageUpload, AudioUpload, NfcBadge

**Files:**
- Modify: `src/app/components/StoryCard.tsx`
- Modify: `src/app/components/ImageUpload.tsx`
- Modify: `src/app/components/AudioUpload.tsx`
- Modify: `src/app/components/NfcBadge.tsx`

- [ ] **Step 1: Replace `src/app/components/StoryCard.tsx`**

```tsx
import { useState, ReactNode } from "react";
import { Story } from "@/types/story.type";
import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
  story: Story;
  onClick?: (story: Story) => void;
  onDelete?: (story: Story) => void;
  onExport?: (story: Story) => void;
  actions?: ReactNode;
}

export default function StoryCard({ story, onClick, onDelete, onExport, actions }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { LL } = useI18nContext();

  return (
    <div
      onClick={onClick ? () => onClick(story) : undefined}
      className={`
            relative flex flex-col items-center border border-talesblu-400 bg-white ease-in-out duration-300 p-2 rounded-2xl m-2
            w-xs h-96 min-h-0 ${onClick ? 'cursor-pointer hover:bg-talesorang-400  hover:text-white hover:border-white' : ''}`}
    >
      <img src={story.image} alt="cover" className="w-full h-48 object-cover rounded-lg mb-2" />
      <h3 className="text-2xl text-center font-bold">{story.name}</h3>
      <p className="text-center text-sm flex-1">{story.description}</p>

      <div className="absolute bottom-3 right-3 flex gap-1">
        {onExport && (
          <button
            onClick={(e) => { e.stopPropagation(); onExport(story); }}
            className="p-2 rounded-lg cursor-pointer transition-all duration-150
                       hover:scale-110 hover:border hover:border-gray-300 hover:bg-white/90 hover:shadow-sm"
            title={LL.STORY_CARD_EXPORT()}
          >
            <img src="/export.svg" alt="export" width={18} height={18} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
            className="p-2 rounded-lg cursor-pointer transition-all duration-150
                       hover:scale-110 hover:border hover:border-gray-300 hover:bg-white/90 hover:shadow-sm"
            title={LL.STORY_CARD_DELETE()}
          >
            <img src="/trash.svg" alt="delete" width={18} height={18} />
          </button>
        )}
      </div>

      {showConfirm && (
        <div
          className="absolute inset-0 bg-talesblu-500/95 rounded-2xl flex flex-col items-center justify-center gap-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <img src="/trash.svg" alt="" width={28} height={28} style={{ filter: "brightness(0) invert(1)" }} />
          <p className="text-white text-center font-semibold px-4 text-lg">
            {LL.STORY_CARD_CONFIRM_TITLE()}
          </p>
          <p className="text-talesblu-100 text-sm text-center px-6">
            {LL.STORY_CARD_CONFIRM_MSG({ name: story.name })}
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
              className="px-4 py-2 rounded-xl bg-talesblu-400 hover:bg-talesblu-300 text-white text-sm font-medium transition-colors duration-150"
            >
              {LL.STORY_CARD_CANCEL()}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete!(story); setShowConfirm(false); }}
              className="px-4 py-2 rounded-xl bg-talesorang-400 hover:bg-talesorang-500 text-white text-sm font-medium transition-colors duration-150"
            >
              {LL.STORY_CARD_DELETE_BTN()}
            </button>
          </div>
        </div>
      )}

      {actions && (
        <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/app/components/ImageUpload.tsx`**

```tsx
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

type ImageUploadProps = {
    onImageBytes?: (bytes: Uint8Array<ArrayBuffer>) => void;
    cls?: string;
    value?: string | null;
};

export default function ImageUpload({
    onImageBytes,
    cls = "",
    value = null,
}: ImageUploadProps) {
    const [thumbnail, setThumbnail] = useState<string | null>(value);
    const createdUrlRef = useRef<string | null>(null);
    const { LL } = useI18nContext();

    useEffect(() => {
        setThumbnail(value);
    }, [value]);

    useEffect(() => {
        return () => {
            if (createdUrlRef.current) {
                URL.revokeObjectURL(createdUrlRef.current);
            }
        };
    }, []);

    const fileSelector = async () => {
        const selectedThumbnail = await open({
            multiple: false,
            extensions: ["png", "jpeg"],
        });
        if (!selectedThumbnail) return;

        const bytes = await readFile(selectedThumbnail.toString());
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);

        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
        }
        createdUrlRef.current = url;

        setThumbnail(url);
        onImageBytes?.(bytes);
    };

    return (
        <div
            className={`${cls} relative flex justify-center items-center w-full h-full bg-foreground/10 rounded-2xl border-3 border-foreground/20 overflow-hidden`}>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    className="object-cover w-full h-full"
                    alt="preview"
                />
            ) : (
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">{LL.IMAGE_NO_IMAGE()}</div>
            )}
            <button
                className="absolute text-2xl font-bold bg-white/80 backdrop-blur-sm w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:scale-110 duration-200 ease-in-out hover:shadow-lg text-talesorang-500 border border-talesorang-200"
                type="button"
                onClick={fileSelector}>
                +
            </button>
        </div>
    );
}
```

- [ ] **Step 3: Replace `src/app/components/AudioUpload.tsx`**

```tsx
import { open } from "@tauri-apps/plugin-dialog";
import { readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState, useRef } from "react";
import { Button } from "@components";
import { useI18nContext } from "@/i18n/i18n-react";

type AudioUploadProps = {
    onAudioBytes?: (bytes: Uint8Array<ArrayBuffer>) => void;
    cls?: string;
    value?: string | null;
};

export default function AudioUpload({
    onAudioBytes,
    cls = "",
    value = null,
}: AudioUploadProps) {
    const [audioSrc, setAudioSrc] = useState<string | null>(value);
    const createdUrlRef = useRef<string | null>(null);
    const { LL } = useI18nContext();

    useEffect(() => {
        setAudioSrc(value);
    }, [value]);

    useEffect(() => {
        return () => {
            if (createdUrlRef.current) {
                URL.revokeObjectURL(createdUrlRef.current);
            }
        };
    }, []);

    const fileSelector = async () => {
        const selectedAudio = await open({
            multiple: false,
            extensions: ["mp3", "wav"],
        });
        if (!selectedAudio) return;

        const path = selectedAudio.toString();
        const bytes = await readFile(path);
        const blob = new Blob([bytes]);
        const url = URL.createObjectURL(blob);

        if (createdUrlRef.current) {
            URL.revokeObjectURL(createdUrlRef.current);
        }
        createdUrlRef.current = url;

        setAudioSrc(url);
        onAudioBytes?.(bytes);
    };

    return (
        <div className={`${cls} flex flex-col gap-2`}>
            {audioSrc && (
                <audio controls src={audioSrc} className="w-full h-10" />
            )}
            <Button
                onClick={fileSelector}
                cls="text-sm !px-4 !py-2 w-full"
            >
                {audioSrc ? LL.AUDIO_CHANGE() : LL.AUDIO_UPLOAD()}
            </Button>
        </div>
    );
}
```

- [ ] **Step 4: Replace `src/app/components/NfcBadge.tsx`**

```tsx
import { useNfc } from "@components/NfcProvider";
import { useI18nContext } from "@/i18n/i18n-react";

export function NfcBadge() {
    const { status, error } = useNfc();
    const { LL } = useI18nContext();

    const label = status === "Active" ? LL.NFC_ACTIVE() : status === "Error" ? LL.NFC_ERROR() : LL.NFC_OFFLINE();

    return (
        <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-colors duration-300 ${status === "Active"
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : status === "Error" || error
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}
            title={error || status}
        >
            <div className={`w-2 h-2 rounded-full ${status === "Active" ? "bg-emerald-500 animate-pulse" : status === "Error" ? "bg-red-500" : "bg-slate-400"
                }`} />
            <span title={LL.NFC_TITLE()} className="text-[10px] font-black uppercase tracking-widest leading-none">
                {label}
            </span>
        </div>
    )
}
```

- [ ] **Step 5: Type check**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm tsc
```
Expected: no errors.

---

### Task 4: Update CalibrationModal and MakeStoryCard

**Files:**
- Modify: `src/app/components/CalibrationModal.tsx`
- Modify: `src/app/makeStory/components/MakeStoryCard.tsx`

- [ ] **Step 1: Replace `src/app/components/CalibrationModal.tsx`**

```tsx
import { useState, useEffect } from "react";
import { Modal, Button } from "@components";
import { useNfc } from "./NfcProvider";
import { StoriesData, Item } from "@/types";
import { loadStoryData } from "@utils/storyIO";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";

interface CalibrationModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    storyId: string;
    storyName: string;
}

export default function CalibrationModal({ isOpen, setIsOpen, storyId, storyName }: CalibrationModalProps) {
    const { tagUid, status } = useNfc();
    const [items, setItems] = useState<Item[]>([]);
    const [calibrations, setCalibrations] = useState<Record<string, string>>({});
    const [calibratingItemId, setCalibratingItemId] = useState<string | null>(null);
    const { LL } = useI18nContext();

    useEffect(() => {
        if (isOpen) {
            loadStoryData(storyName).then(data => {
                const mappedItems: Item[] = (data.items || []).map(i => ({
                    item_id: i.itemId,
                    linkedTo: i.linkedTo,
                    label: i.label
                }));
                setItems(mappedItems);
            });
            getStoryCalibration(storyId).then(setCalibrations);
        }
    }, [isOpen, storyId, storyName]);

    const handleCalibrate = async (itemId: string) => {
        if (!tagUid) return;
        await addCalibration(storyId, itemId, tagUid);
        const updated = await getStoryCalibration(storyId);
        setCalibrations(updated);
        setCalibratingItemId(null);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="60%" height="80%">
            <div className="p-8 h-full flex flex-col">
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-talesblu-800 uppercase tracking-tight">
                        {LL.CALIB_TITLE()} <span className="text-talesorang-500">{storyName}</span>
                    </h2>
                    <p className="text-gray-500 font-medium">{LL.CALIB_DESC()}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {items.map((item) => (
                        <div key={item.item_id} className={`p-5 rounded-2xl border-2 transition-all ${
                            calibrations[item.item_id]
                                ? 'bg-emerald-50 border-emerald-100'
                                : 'bg-slate-50 border-slate-100'
                        }`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-talesblu-800">{item.label || LL.CALIB_UNNAMED()}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{item.item_id}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {calibrations[item.item_id] ? (
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase">{LL.CALIB_LINKED_TAG()}</p>
                                            <p className="text-xs font-mono font-bold text-emerald-700">{calibrations[item.item_id]}</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs font-bold text-amber-500 italic">{LL.CALIB_NOT_CALIBRATED()}</p>
                                    )}

                                    <Button
                                        onClick={() => setCalibratingItemId(item.item_id)}
                                        cls={`text-xs !px-4 !py-2 ${calibratingItemId === item.item_id ? 'animate-pulse !bg-talesorang-600' : ''}`}
                                    >
                                        {calibratingItemId === item.item_id
                                            ? LL.CALIB_SCANNING()
                                            : calibrations[item.item_id]
                                                ? LL.CALIB_RECALIBRATE()
                                                : LL.CALIB_BTN()}
                                    </Button>
                                </div>
                            </div>

                            {calibratingItemId === item.item_id && (
                                <div className="mt-4 p-4 bg-white rounded-xl border-2 border-dashed border-talesorang-300 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-talesblu-600">
                                            {status !== 'Active' ? LL.CALIB_CONNECT_READER() : LL.CALIB_PLACE_TAG()}
                                        </p>
                                        {tagUid && (
                                            <div className="flex items-center gap-3">
                                                <p className="text-xs font-mono font-bold bg-talesorang-50 px-2 py-1 rounded">UID: {tagUid}</p>
                                                <Button onClick={() => handleCalibrate(item.item_id)} cls="text-[10px] !px-3 !py-1 !bg-emerald-500">{LL.CALIB_CONFIRM_LINK()}</Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold italic">{LL.CALIB_NO_ITEMS()}</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={() => setIsOpen(false)} cls="!bg-talesblu-800">{LL.CALIB_DONE()}</Button>
                </div>
            </div>
        </Modal>
    );
}
```

- [ ] **Step 2: Replace `src/app/makeStory/components/MakeStoryCard.tsx`**

```tsx
import { useState, useEffect, useMemo } from "react";
import { ImageUpload, Button } from "@components";
import { useNavigate } from "react-router-dom";
import { loadStoryData, bytesToUrl } from "@utils/storyIO";
import { useI18nContext } from "@/i18n/i18n-react";

export default function MakeStoryCard({ folderName }: { folderName?: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailBytes, setThumbnailBytes] = useState<Uint8Array | null>(null);
  const [existingStory, setExistingStory] = useState<any>(null);
  const navigate = useNavigate();
  const { LL } = useI18nContext();

  const thumbnailUrl = useMemo(() => {
    if (thumbnailBytes) {
      return bytesToUrl(thumbnailBytes, "image/png");
    }
    return null;
  }, [thumbnailBytes]);

  useEffect(() => {
    if (folderName) {
      loadStoryData(folderName).then((data) => {
        setName(data.story.name);
        setDescription(data.story.description);
        setThumbnailBytes(data.story.thumbnail as Uint8Array | null);
        setExistingStory(data.story);
      });
    }
  }, [folderName]);

  const handleNext = () => {
    if (!name.trim()) {
      alert(LL.MAKE_CARD_NAME_REQUIRED());
      return;
    }

    const finalFolderName = name.trim().replace(/\s+/g, "_").toLowerCase();

    navigate(`/makeStory/storyConfigurator/${finalFolderName}`, {
      state: {
        story: {
          ...existingStory,
          id: existingStory?.id || crypto.randomUUID(),
          name: name.trim(),
          description: description.trim(),
          thumbnail: thumbnailBytes ? Array.from(thumbnailBytes) : null,
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center border border-talesblu-400 bg-white p-4 rounded-3xl shadow-xl w-xl h-125 transition-all hover:shadow-2xl">
      <div className="w-full h-48 mb-6 overflow-hidden rounded-2xl">
        <ImageUpload
          onImageBytes={(bytes) => setThumbnailBytes(bytes)}
          value={thumbnailUrl}
        />
      </div>

      <div className="w-full space-y-4 px-2">
        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_NAME_LABEL()}</label>
          <input
            type="text"
            placeholder={LL.MAKE_CARD_NAME_PLACEHOLDER()}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-center w-full outline-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-2 transition-all placeholder:text-gray-300 text-talesblu-800"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-[10px] text-center text-gray-400 uppercase font-black tracking-widest mt-1">{LL.MAKE_CARD_DESC_LABEL()}</label>
          <textarea
            placeholder={LL.MAKE_CARD_DESC_PLACEHOLDER()}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="text-sm text-center w-full outline-none resize-none border-2 border-dashed border-gray-100 focus:border-talesorang-400 bg-gray-50/30 rounded-2xl px-4 py-3 transition-all placeholder:text-gray-300 italic text-gray-600 leading-relaxed"
          />
        </div>
      </div>

      <div className="mt-auto w-full pt-4">
        <Button onClick={handleNext} cls="w-full !rounded-2xl !py-4 shadow-lg shadow-talesorang-100 hover:scale-[1.02] active:scale-[0.98] transition-transform">
          {folderName ? LL.MAKE_CARD_UPDATE() : LL.MAKE_CARD_START()}
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type check**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm tsc
```
Expected: no errors.

---

### Task 5: Update Configurator, NodeSidebar, StoryCanvas

**Files:**
- Modify: `src/app/makeStory/components/storyConfigurator/Configurator.tsx`
- Modify: `src/app/makeStory/components/storyConfigurator/NodeSidebar.tsx`
- Modify: `src/app/makeStory/components/storyConfigurator/StoryCanvas.tsx`

- [ ] **Step 1: Replace `src/app/makeStory/components/storyConfigurator/Configurator.tsx`**

```tsx
import { useState } from "react";
import { Button, Header, LoadingScreen } from "@components";
import { useNavigate, useBlocker } from "react-router-dom";
import { ask } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import { useStoryState } from "./useStoryState";
import StoryCanvas from "./StoryCanvas";
import NodeSidebar from "./NodeSidebar";
import { useI18nContext } from "@/i18n/i18n-react";

type ConfiguratorProps = {
  folderName?: string;
  showToolTipState?: boolean;
};

export default function Configurator({
  folderName = "",
}: ConfiguratorProps) {
  const [showToolTip, setShowToolTip] = useState(false);
  const {
    nodes,
    selectedId,
    setSelectedId,
    createNewNode,
    deleteNode,
    updateNode,
    saveFile,
    linking,
    linkingRootId,
    toggleLinking,
    storyId,
    calibrations,
    setCalibrations,
    storyMetadata,
    isDirty,
    loading
  } = useStoryState(folderName);

  const navigate = useNavigate();
  const { LL } = useI18nContext();

  const [scale, setScale] = useState(1);

  if (loading) {
    return (
      <LoadingScreen
        title={LL.CONFIG_LOADING_TITLE()}
        description={LL.CONFIG_LOADING_DESC()}
        imageSrc="/MakeStory.svg"
      />
    );
  }

  const handleSelect = (nodeId: string) => {
    if (linking && linkingRootId) {
      const newLinks = [
        ...(nodes.find(n => n.id === linkingRootId)?.links || []),
        {
          targetId: nodeId,
          itemId: crypto.randomUUID(),
          itemLabel: ""
        }
      ];
      updateNode(linkingRootId, { links: newLinks });
      toggleLinking(null);
    } else {
      setSelectedId(nodeId);
    }
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = async () => {
        const confirmed = await ask(
          LL.CONFIG_UNSAVED_MSG(),
          { title: LL.CONFIG_UNSAVED_TITLE(), kind: "warning" }
        );
        if (confirmed) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      };
      confirmLeave();
    }
  }, [blocker]);

  const handleBack = () => {
    navigate("/");
  };

  const selectedNode = selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null;

  return (
    <div className="flex flex-col w-full h-screen">
      <Header onBack={handleBack} onHelpHover={setShowToolTip} />

      <div className="flex gap-4 w-full h-[calc(100vh-100px)] px-4">
        <div className="flex-[2.5] flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-talesblu-900 uppercase">{storyMetadata?.name || LL.CONFIG_NEW_STORY()}</h2>
              <div className="h-6 w-px bg-gray-200" />
              <p className="text-gray-400 text-sm font-medium">
                {nodes.length} {nodes.length !== 1 ? LL.CONFIG_CHAPTER_PLURAL() : LL.CONFIG_CHAPTER_SINGULAR()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={createNewNode} cls="text-[12px] !px-6 !py-2 !rounded-full shadow-md hover:shadow-lg transition-all bg-white !text-talesblu-800 border-2 border-gray-100">
                {LL.CONFIG_ADD_CHAPTER()}
              </Button>
              <Button onClick={saveFile} cls={`text-[12px] !px-8 !py-2 !rounded-full shadow-lg transition-all flex items-center gap-2 ${isDirty ? 'shadow-talesorang-200 ring-2 ring-talesorang-100' : 'shadow-gray-100 opacity-80 hover:opacity-100'}`}>
                {isDirty && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                {isDirty ? LL.CONFIG_SAVE() : LL.CONFIG_SAVED()}
              </Button>
            </div>
          </div>

          <StoryCanvas
            nodes={nodes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNodeDragMove={(id, e) => {
              const { x, y } = e.target.position();
              updateNode(id, { x, y });
            }}
            scale={scale}
            onScaleChange={setScale}
            showToolTipState={showToolTip}
            linking={linking}
            linkingRootId={linkingRootId}
          />
        </div>

        <div className="w-100 flex-none">
          <NodeSidebar
            selectedNode={selectedNode}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onLink={toggleLinking}
            onSave={saveFile}
            linking={linking}
            storyId={storyId}
            calibrations={calibrations}
            onCalibrationsUpdate={setCalibrations}
            showToolTipState={showToolTip}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `src/app/makeStory/components/storyConfigurator/NodeSidebar.tsx`**

```tsx
import { InputLabel, TextAreaLabel, ImageUpload, AudioUpload, Button, ToolTip } from "@components";
import { ChapterNode, StoryLink } from "./useStoryState";
import { useNfc } from "../../../components/NfcProvider";
import { addCalibration, getStoryCalibration } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";
import type { TranslationFunctions } from "@/i18n/i18n-types";

type NodeSidebarProps = {
  selectedNode: ChapterNode | null;
  onUpdate: (id: string, updates: Partial<ChapterNode>) => void;
  onDelete: (id: string) => void;
  onLink: (id: string) => void;
  onSave: () => void;
  linking: boolean;
  storyId: string | null;
  calibrations: Record<string, string>;
  onCalibrationsUpdate: (calibrations: Record<string, string>) => void;
  showToolTipState?: boolean;
};

import { memo } from "react";

const NodeSidebar = memo(({
  selectedNode,
  onUpdate,
  onDelete,
  onLink,
  onSave,
  linking,
  storyId,
  calibrations,
  onCalibrationsUpdate,
  showToolTipState = false
}: NodeSidebarProps) => {
  const { tagUid, status } = useNfc();
  const { LL } = useI18nContext();

  if (!selectedNode) {
    return (
      <div className="flex-1 min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-8 flex flex-col justify-center items-center text-gray-400">
        <p className="text-lg font-medium italic">{LL.NODE_SELECT_HINT()}</p>
      </div>
    );
  }

  const handleQuickLink = async (itemId: string) => {
    if (!storyId || !tagUid) return;
    await addCalibration(storyId, itemId, tagUid);
    const updated = await getStoryCalibration(storyId);
    onCalibrationsUpdate(updated);
  };

  const handleMediaBytes = (field: keyof ChapterNode, bytes: Uint8Array) => {
    const blob = new Blob([bytes as any]);
    const url = URL.createObjectURL(blob);

    const updates: Partial<ChapterNode> = { [field]: bytes };
    if (field === 'imageBytes') {
      const img = new window.Image();
      img.onload = () => onUpdate(selectedNode.id, { ...updates, image: img, imageSrc: url });
      img.src = url;
    } else if (field === 'audioBytes') {
      onUpdate(selectedNode.id, { ...updates, audioSrc: url });
    } else if (field === 'failAudioBytes') {
      onUpdate(selectedNode.id, { ...updates, failAudioSrc: url });
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[320px] border-2 border-gray-100 rounded-3xl m-3 p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <h3 className="text-talesblu-900 text-xl font-black uppercase tracking-tight">{LL.NODE_EDIT_CHAPTER()}</h3>
        {selectedNode.title !== "Intro" && (
          <button
            onClick={() => onDelete(selectedNode.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
            title={LL.NODE_DELETE_CHAPTER()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_CHAPTER_TITLE_LABEL()}</p>
          <input
            value={selectedNode.title}
            onChange={(e) => onUpdate(selectedNode.id, { title: e.target.value })}
            className="w-full text-lg font-bold border-2 border-dashed border-gray-200 focus:border-talesorang-500 bg-gray-50/50 rounded-xl px-4 py-2 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-300"
            placeholder={LL.NODE_CHAPTER_TITLE_PH()}
          />
        </div>

        <TextAreaLabel
          label={LL.NODE_DESC_LABEL()}
          rows={3}
          onChangeText={(e) => onUpdate(selectedNode.id, { description: e.target.value })}
          value={selectedNode.description}
          placeholder={LL.NODE_DESC_PH()}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_ILLUSTRATION()}</p>
          <div className="h-32">
            <ImageUpload
              onImageBytes={(b) => handleMediaBytes('imageBytes', b)}
              value={selectedNode.imageSrc}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_NARRATION()}</p>
          <div className="h-32">
            <AudioUpload
              onAudioBytes={(b) => handleMediaBytes('audioBytes', b)}
              value={selectedNode.audioSrc}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-50">
        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_FAIL_AUDIO()}</p>
        <AudioUpload
          onAudioBytes={(b) => handleMediaBytes('failAudioBytes', b)}
          value={selectedNode.failAudioSrc}
        />
      </div>

      <div className="pt-6 border-t border-gray-50 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{LL.NODE_LINKS()}</p>
          <Button
            onClick={() => onLink(selectedNode.id)}
            cls={`text-[10px] !px-3 !py-1 ${linking ? 'bg-talesorang-600' : ''}`}
          >
            {linking ? LL.NODE_LINKING() : LL.NODE_ADD_LINK()}
          </Button>
        </div>

        <ul className="space-y-3">
          {selectedNode.links.map((link) => (
            <LinkItem
              key={link.itemId}
              link={link}
              calibratedTag={calibrations[link.itemId]}
              onUpdateLabel={(label: string) => {
                const newLinks = selectedNode.links.map(l => l.itemId === link.itemId ? { ...l, itemLabel: label } : l);
                onUpdate(selectedNode.id, { links: newLinks });
              }}
              onDelete={() => {
                const newLinks = selectedNode.links.filter(l => l.itemId !== link.itemId);
                onUpdate(selectedNode.id, { links: newLinks });
              }}
              onLinkTag={() => handleQuickLink(link.itemId)}
              tagUid={tagUid}
              nfcStatus={status}
              LL={LL}
            />
          ))}
        </ul>
      </div>
    </div>
  );
});

function LinkItem({ link, calibratedTag, onUpdateLabel, onDelete, onLinkTag, tagUid, nfcStatus, LL }: any) {
  const isLabelEmpty = !link.itemLabel.trim();

  return (
    <li className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 transition-all hover:border-talesorang-200">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex flex-col min-w-0">
          <input
            className={`w-full text-sm font-bold placeholder:italic border-2 border-dashed rounded-xl px-3 py-1.5 outline-none transition-all focus:ring-0 text-talesblu-800 placeholder:text-gray-400 mr-2 ${
              isLabelEmpty
                ? "border-red-300 focus:border-red-500 bg-red-50/20"
                : "border-gray-200 focus:border-talesorang-500 focus:bg-white bg-white/60 hover:bg-white hover:border-gray-300"
            }`}
            value={link.itemLabel}
            onChange={(e) => onUpdateLabel(e.target.value)}
            placeholder={LL.NODE_INTERACTION_PH()}
          />
          {isLabelEmpty && (
            <span className="text-[10px] text-red-500 font-semibold mt-1 block">
              {LL.NODE_INTERACTION_REQUIRED()}
            </span>
          )}
        </div>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${calibratedTag ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
          <span className={`text-[9px] font-mono uppercase tracking-tighter ${calibratedTag ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
            {calibratedTag ? `Tag: ${calibratedTag.slice(0, 8)}` : LL.NODE_TAG_NOT_LINKED()}
          </span>
        </div>
        {nfcStatus === "Active" ? (
          tagUid ? (
            <Button onClick={onLinkTag} cls={`text-[8px] px-2! py-1! rounded-full font-black uppercase tracking-widest shadow-sm transition-all ${calibratedTag ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-talesorang-500 text-white'}`}>
              {calibratedTag ? LL.NODE_UPDATE() : LL.NODE_LINK_TAG()}
            </Button>
          ) : (
            <span className="text-[8px] text-amber-500 font-bold italic animate-pulse">{LL.NODE_WAIT_TAG()}</span>
          )
        ) : (
          <span className="text-[8px] text-gray-300 font-bold italic">{LL.NODE_OFFLINE()}</span>
        )}
      </div>
    </li>
  )
}

export default NodeSidebar;
```

- [ ] **Step 3: Replace `src/app/makeStory/components/storyConfigurator/StoryCanvas.tsx`**

Key changes:
- `ChapterNodeView` calls `useI18nContext()` to get `LL.CANVAS_NO_IMAGE()` for the canvas Text element
- `StoryCanvas` uses `LL.CANVAS_HINT()` for the ToolTip

```tsx
import { Stage, Layer, Group, Rect, Text, Image, Arrow } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { ToolTip } from "@components";
import { getEdgePoints, clamp } from "./StageNodeFunctions";
import { ChapterNode } from "./useStoryState";
import { useState, useRef, useEffect, memo } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

type StoryCanvasProps = {
  nodes: ChapterNode[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNodeDragMove: (id: string, e: KonvaEventObject<DragEvent>) => void;
  scale: number;
  onScaleChange: (newScale: number) => void;
  showToolTipState?: boolean;
  linking?: boolean;
  linkingRootId?: string | null;
};

const ChapterNodeView = memo(({
  node,
  isSelected,
  onSelect,
  onDragMove,
  isLinking
}: {
  node: ChapterNode,
  isSelected: boolean,
  onSelect: (id: string) => void,
  onDragMove: (id: string, e: KonvaEventObject<DragEvent>) => void,
  isLinking: boolean
}) => {
  const [hovered, setHovered] = useState(false);
  const { LL } = useI18nContext();

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable={!isLinking}
      onClick={() => onSelect(node.id)}
      onTap={() => onSelect(node.id)}
      onDragMove={(e) => onDragMove(node.id, e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Rect
        fill={isSelected ? "#ffffff" : "#fdfdfd"}
        stroke={isSelected || (isLinking && hovered) ? "#f97316" : "#e5e7eb"}
        strokeWidth={isSelected ? 3 : (isLinking && hovered ? 2 : 1)}
        dash={isLinking && hovered && !isSelected ? [10, 5] : undefined}
        shadowBlur={isSelected ? 10 : 2}
        shadowColor="rgba(0,0,0,0.1)"
        cornerRadius={20}
        width={150}
        height={150}
      />
      {node.image ? (
        <Image
          image={node.image}
          cornerRadius={16}
          x={2}
          y={2}
          width={146}
          height={110}
          listening={false}
        />
      ) : (
        <Group listening={false}>
          <Rect x={4} y={4} width={142} height={106} cornerRadius={16} fill="#f3f4f6" />
          <Text text={LL.CANVAS_NO_IMAGE()} x={45} y={50} fontSize={10} fill="#9ca3af" fontStyle="bold uppercase" />
        </Group>
      )}
      <Text
        text={node.title}
        x={10}
        y={120}
        width={130}
        fontSize={14}
        fontStyle="bold"
        fill={isSelected ? "#111827" : "#4b5563"}
        align="center"
        listening={false}
      />
    </Group>
  );
});

export default function StoryCanvas({
  nodes,
  selectedId,
  onSelect,
  onNodeDragMove,
  scale,
  onScaleChange,
  showToolTipState = false,
  linking = false,
  linkingRootId = null
}: StoryCanvasProps) {
  const stageContainerRef = useRef<HTMLDivElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { LL } = useI18nContext();

  const linkingRootNode = linkingRootId ? nodes.find(n => n.id === linkingRootId) : null;

  useEffect(() => {
    if (!stageContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setStageSize({ width, height: Math.max(height, 300) });
      }
    });

    resizeObserver.observe(stageContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (linking && linkingRootNode) {
      setMousePos({ x: linkingRootNode.x + 75, y: linkingRootNode.y + 75 });
    }
  }, [linking, linkingRootId]);

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!linking) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getRelativePointerPosition();
    if (pos) setMousePos(pos);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = clamp(scale * (direction > 0 ? scaleBy : 1 / scaleBy), 0.5, 2.5);
    onScaleChange(newScale);
  };

  return (
    <div ref={stageContainerRef} className="p-2 flex-1 min-w-0 flex flex-col items-end relative overflow-hidden">
      {showToolTipState && (
        <ToolTip
          text={LL.CANVAS_HINT()}
          absolute
          cls="left-4 top-4"
        />
      )}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="border-2 border-gray-100 rounded-3xl bg-gray-50 shadow-inner overflow-hidden"
        draggable={!linking}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {linking && linkingRootNode && (
            <Arrow
              points={[
                linkingRootNode.x + 75,
                linkingRootNode.y + 75,
                mousePos.x,
                mousePos.y
              ]}
              stroke="#f97316"
              fill="#f97316"
              strokeWidth={2}
              dash={[5, 5]}
              pointerLength={8}
              pointerWidth={8}
              listening={false}
            />
          )}
          {nodes.map((node) =>
            node.links.map((link) => {
              const destination = nodes.find((n) => n.id === link.targetId);
              if (!destination) return null;
              const pts = getEdgePoints(node, destination);
              const isSourceSelected = selectedId === node.id;
              return (
                <Arrow
                  key={`${node.id}->${link.targetId}`}
                  points={pts}
                  stroke={isSourceSelected ? "#f97316" : "#cbd5e1"}
                  fill={isSourceSelected ? "#f97316" : "#cbd5e1"}
                  strokeWidth={isSourceSelected ? 2 : 1}
                  pointerLength={6}
                  pointerWidth={6}
                  listening={false}
                />
              );
            })
          )}
          {nodes.map((node) => (
            <ChapterNodeView
              key={node.id}
              node={node}
              isSelected={selectedId === node.id}
              onSelect={onSelect}
              onDragMove={onNodeDragMove}
              isLinking={linking}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
```

- [ ] **Step 4: Type check**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm tsc
```
Expected: no errors.

---

### Task 6: Update PlayStory page and its components

**Files:**
- Modify: `src/app/playStory/page.tsx`
- Modify: `src/app/playStory/SettingsModal.tsx`
- Modify: `src/app/playStory/components/StoryHeader.tsx`
- Modify: `src/app/playStory/components/StoryOverlay.tsx`
- Modify: `src/app/playStory/components/StoryOptions.tsx`
- Modify: `src/app/playStory/components/StoryVisuals.tsx`

- [ ] **Step 1: Update `src/app/playStory/page.tsx`**

Add `useI18nContext` import and replace 3 hardcoded strings:

```tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import SettingsModal from "./SettingsModal";
import { storySettings } from "./Settings";
import { useStory } from "./useStory";
import { useFullscreen } from "./useFullscreen";
import StoryVisuals from "./components/StoryVisuals";
import StoryOverlay from "./components/StoryOverlay";
import StoryOptions from "./components/StoryOptions";
import StoryHeader from "./components/StoryHeader";
import { playAudio, stopAudio } from "./AudioPlayer";
import { StorySettings } from "@/types";
import { Center, LoadingScreen } from "../components";
import { useNfc } from "../components/NfcProvider";
import { loadAllCalibrations, resolveTagForStory } from "@utils/tagMapping";
import { useI18nContext } from "@/i18n/i18n-react";

export default function PlayStory() {
    const { id } = useParams();
    const { story, currentChapter, nextChapter, currentChapterRef } =
        useStory(id);
    useFullscreen();

    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    const [isLoading, setLoading] = useState(true);
    const [calibrations, setCalibrations] = useState({});
    const { LL } = useI18nContext();

    const { tagUid } = useNfc();

    useEffect(() => {
        loadAllCalibrations().then(setCalibrations);
    }, []);

    useEffect(() => {
        if (!tagUid || !story?.id || !currentChapter) return;

        const resolvedItemId = resolveTagForStory(tagUid, story.id, calibrations);
        if (resolvedItemId) {
            const matchingOption = currentChapter.option.find(o => o.item === resolvedItemId);
            if (matchingOption) {
                nextChapter(matchingOption);
            }
        }
    }, [tagUid, story?.id, currentChapter, calibrations, nextChapter]);

    const closeStory = useCallback(() => {
        stopAudio();
        window.history.back();
    }, []);

    useEffect(() => {
        function handleKeyPressed(e: KeyboardEvent) {
            if (showSettingsModal) return;

            if (
                e.key === "Escape" ||
                currentChapterRef.current?.option.length === 0
            ) {
                e.preventDefault();
                e.stopPropagation();
                closeStory();
            }
        }
        window.addEventListener("keydown", handleKeyPressed);
        return () => window.removeEventListener("keydown", handleKeyPressed);
    }, [currentChapterRef, showSettingsModal, closeStory]);

    useEffect(() => {
        if (story) {
            setLoading(false);
        }
    }, [story]);

    if (isLoading) {
        return (
            <LoadingScreen
                title={LL.PLAY_LOADING_TITLE()}
                description={LL.PLAY_LOADING_DESC()}
                imageSrc="/PlayStory.svg"
            />
        );
    } else if (!currentChapter && !story) {
        return <Center>
            <p className="text-2xl">{LL.PLAY_NOT_FOUND()}</p>
        </Center>
    }

    return (
        <main className="bg-white min-h-screen">
            <StoryHeader
                fontSizeSetting={settings.fontSize}
                onSettingsClick={() => setShowSettingsModal(true)}
                onCloseClick={closeStory}
                onReplayAudioClick={() => {
                    if (!currentChapter?.audio) return;
                    playAudio(currentChapter.audio);
                }}
            />

            {currentChapter ? (
                <div className="relative h-screen w-screen">
                    <StoryVisuals image={currentChapter.image} />
                    <StoryOverlay
                        title={currentChapter.title}
                        description={currentChapter.description}
                        fontSizeSetting={settings.fontSize}
                        options={currentChapter.option}
                    />
                </div>
            ) : (
                <p>{LL.PLAY_LOADING()}</p>
            )}

            <StoryOptions
                options={currentChapter?.option}
                onOptionClick={nextChapter}
                onErrorClick={() => {
                    if (!currentChapter?.failAudio) return;
                    playAudio(currentChapter.failAudio);
                }}
            />

            <SettingsModal
                isOpen={showSettingsModal}
                setIsOpen={setShowSettingsModal}
                onSettingsChange={setSettings}
            />
        </main>
    );
}
```

- [ ] **Step 2: Replace `src/app/playStory/SettingsModal.tsx`**

```tsx
import { useState } from "react";
import { fontSize, storySettings } from "./Settings";
import { Button, Modal } from "@components";
import { StorySettings, FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSettingsChange?: (settings: StorySettings) => void;
}

export default function SettingsModal({
    isOpen,
    setIsOpen,
    onSettingsChange,
}: Props) {
    const [settings, setSettings] = useState<StorySettings>(storySettings);
    const { LL } = useI18nContext();

    const updateSettings = (next: StorySettings) => {
        setSettings(next);
        storySettings.fontSize = next.fontSize;
        storySettings.volume = next.volume;
        onSettingsChange?.(next);
    };

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="70%" height="70%">
            <div className="p-4">
                <h3 className="text-3xl py-2">{LL.SETTINGS_TEXT_SIZE()}</h3>
                <div className="flex flex-wrap justify-between gap-1">
                    {Object.entries(fontSize).map(([key, value]) => (
                        <Button
                            key={key}
                            onClick={() =>
                                updateSettings({
                                    ...settings,
                                    fontSize: key as FontSize,
                                })
                            }
                            cls="flex-1"
                            primary={key === settings.fontSize}>
                            <span
                                className="flex flex-col"
                                style={{ fontSize: value + "px" }}>
                                {key}
                            </span>
                        </Button>
                    ))}
                </div>
                <div>
                    <h3 className="text-3xl py-2">{LL.SETTINGS_VOLUME()}</h3>
                    <span className="w-full flex gap-4">
                        <span>{settings.volume * 100}%</span>
                        <input
                            className="w-full accent-talesorang-500"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.volume}
                            onChange={(e) =>
                                updateSettings({
                                    ...settings,
                                    volume: Number(e.target.value),
                                })
                            }
                        />
                    </span>
                </div>
            </div>
        </Modal>
    );
}
```

- [ ] **Step 3: Replace `src/app/playStory/components/StoryHeader.tsx`**

```tsx
import { Button } from "@components";
import { fontSize } from "../Settings";
import { FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryHeaderProps {
    fontSizeSetting: FontSize;
    onSettingsClick: () => void;
    onCloseClick: () => void;
    onReplayAudioClick: () => void;
}

export default function StoryHeader({
    fontSizeSetting,
    onSettingsClick,
    onCloseClick,
    onReplayAudioClick,
}: StoryHeaderProps) {
    const baseFontSize = fontSize[fontSizeSetting];
    const { LL } = useI18nContext();

    return (
        <>
            <div className="absolute top-3 left-2 z-100 flex gap-2">
                <Button
                    onClick={onSettingsClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_SETTINGS()}
                </Button>
                <Button
                    onClick={onReplayAudioClick}
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_REPLAY_AUDIO()}
                </Button>
            </div>
            <Button
                onClick={onCloseClick}
                cls="absolute top-3 right-2 z-100"
                style={{
                    fontSize: baseFontSize + "px",
                }}>
                X
            </Button>
        </>
    );
}
```

- [ ] **Step 4: Replace `src/app/playStory/components/StoryOverlay.tsx`**

```tsx
import { fontSize } from "../Settings";
import { Option, FontSize } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryOverlayProps {
    title: string | undefined;
    description: string | undefined;
    fontSizeSetting: FontSize;
    options: Option[] | undefined;
}

export default function StoryOverlay({
    title,
    description,
    fontSizeSetting,
    options,
}: StoryOverlayProps) {
    const baseFontSize = fontSize[fontSizeSetting];
    const { LL } = useI18nContext();

    return (
        <>
            {title && (
                <h1
                    className="absolute top-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                    style={{
                        fontSize: baseFontSize * 2 + "px",
                    }}>
                    {title}
                </h1>
            )}
            {description && (
                <p
                    className="absolute bottom-0 left-0 text-center py-4 w-screen text-white bg-black/50"
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {description}
                </p>
            )}
            {options && options.length === 0 && (
                <div
                    className="absolute bottom-24 left-4 z-100 max-w-1/4 text-white bg-talesorang-500 p-4 rounded-lg"
                    style={{
                        fontSize: baseFontSize + "px",
                    }}>
                    {LL.STORY_END()}
                </div>
            )}
        </>
    );
}
```

- [ ] **Step 5: Replace `src/app/playStory/components/StoryOptions.tsx`**

```tsx
import { Button } from "@components";
import { Option } from "@/types";
import { useI18nContext } from "@/i18n/i18n-react";

export interface StoryOptionsProps {
    options: Option[] | undefined;
    onErrorClick: () => void;
    onOptionClick: (option: Option) => void;
}

export default function StoryOptions({
    options,
    onErrorClick,
    onOptionClick,
}: StoryOptionsProps) {
    const { LL } = useI18nContext();

    if (!options) return null;

    return (
        <div className="absolute flex flex-col bottom-4 right-4 z-100">
            {options.map((option) => (
                <Button
                    key={option.nextChapter}
                    onClick={() => onOptionClick(option)}
                    cls="m-2">
                    {option.item ?? "null"}
                    {option.audio && (
                        <>
                            <br />
                            {LL.STORY_OPTION_AUDIO()}
                        </>
                    )}
                </Button>
            ))}
            <Button onClick={() => onErrorClick()} cls="m-2 bg-red-500!">
                Error
            </Button>
        </div>
    );
}
```

- [ ] **Step 6: Replace `src/app/playStory/components/StoryVisuals.tsx`**

Read the current file first, then replace only the alt text. The current file has:
```tsx
alt="Story Background"
```
Replace with `alt={LL.STORY_BG_ALT()}` after adding `useI18nContext`. Read the file to get the full current content before replacing.

- [ ] **Step 7: Type check**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm tsc
```
Expected: no errors.

---

### Task 7: Update TestBoard, AssignedLabelsTable, and PlayStoryButton

**Files:**
- Modify: `src/app/testBoard/page.tsx`
- Modify: `src/app/testBoard/AssignedLabelsTable.tsx`
- Modify: `src/app/storyOverview/PlayStoryButton.tsx`

- [ ] **Step 1: Update `src/app/testBoard/page.tsx`**

Add `useI18nContext` and replace all hardcoded strings. The existing file has `Header title="Whisper Tester"` and many inline labels. Replace the file content with:

```tsx
"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useNfc } from "../components/NfcProvider";
import { loadAllCalibrations } from "@/utils/tagMapping";
import { getStoriesOverview, loadStoryData } from "@/utils/storyIO";
import { TagMatch } from "@/types/story.type";
import { AssignedLabelsTable } from "./AssignedLabelsTable";
import { useI18nContext } from "@/i18n/i18n-react";

export default function TestBoard() {
  const { status, tagUid, tagContent, error } = useNfc();
  const [matches, setMatches] = useState<TagMatch[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const { LL } = useI18nContext();

  useEffect(() => {
    if (!tagUid) {
      setMatches([]);
      return;
    }

    async function findMatches() {
      setIsLoadingMatches(true);
      try {
        const allCalibrations = await loadAllCalibrations();
        const storyPreviews = await getStoriesOverview();
        const foundMatches: TagMatch[] = [];

        for (const preview of storyPreviews) {
          const storyCalib = allCalibrations[preview.internalId];
          if (storyCalib) {
            const itemIds = Object.entries(storyCalib)
              .filter(([_, uid]) => uid === tagUid)
              .map(([itemId, _]) => itemId);

            if (itemIds.length > 0) {
              const storyData = await loadStoryData(preview.id);
              for (const itemId of itemIds) {
                const item = storyData.items?.find(i => i.itemId === itemId);
                if (item) {
                  foundMatches.push({
                    storyName: preview.name,
                    label: item.label || itemId
                  });
                }
              }
            }
          }
        }
        setMatches(foundMatches);
      } catch (err) {
        console.error("Failed to find tag matches:", err);
      } finally {
        setIsLoadingMatches(false);
      }
    }

    findMatches();
  }, [tagUid]);

  return (
    <main className="min-h-screen bg-white text-talesblu-900 font-sans">
      <Header title={LL.TEST_TITLE()} />

      <div className="max-w-2xl mx-auto">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between bg-talesblu-50 p-6 rounded-2xl border-2 border-talesblu-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500 animate-ping' : 'bg-slate-300'}`} />
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${status === 'Active' ? 'bg-talesorang-500' : 'bg-slate-300'}`} />
              </div>
              <div>
                <p className="text-xs font-black text-talesblu-400 uppercase tracking-widest">{LL.TEST_SCANNER_STATUS()}</p>
                <p className="text-xl font-bold text-talesblu-800">{status}</p>
              </div>
            </div>

            {status === 'Active' && (
              <div className="px-4 py-2 bg-talesorang-100 text-talesorang-600 rounded-full text-xs font-black uppercase tracking-tighter animate-pulse">
                {LL.TEST_ACTIVE_POLLING()}
              </div>
            )}
          </div>

          <div className="relative group">
            <div className={`relative bg-white border-4 ${(status !== 'Disconnected' && tagUid) ? 'border-talesorang-500 shadow-[0_0_20px_rgba(246,116,94,0.3)]' : 'border-talesblu-100'} rounded-2xl p-10 min-h-64 flex flex-col items-center justify-center text-center transition-all duration-300`}>
              {(status !== 'Disconnected' && tagUid) ? (
                <div className="animate-in fade-in zoom-in duration-300 w-full max-w-md">
                  <div className="w-16 h-16 bg-talesorang-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-talesblu-50 px-6 py-4 rounded-xl border-2 border-talesblu-100">
                      <span className="text-[10px] font-black text-talesblu-400 uppercase tracking-widest block mb-1">{LL.TEST_HARDWARE_UID()}</span>
                      <p className="text-2xl font-mono font-bold text-talesblu-800 break-all">{tagUid}</p>
                    </div>

                    {tagContent && (
                      <div className="bg-slate-50 px-6 py-4 rounded-xl border-2 border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{LL.TEST_NDEF_CONTENT()}</span>
                        <p className="text-sm font-medium text-slate-600 italic break-all">"{tagContent}"</p>
                      </div>
                    )}

                    <div className="mt-6 pt-6 border-t border-talesblu-100">
                      <span className="text-[10px] font-black text-talesblu-400 uppercase tracking-widest block mb-3 text-left">{LL.TEST_ASSIGNED_LABELS()}</span>

                      {isLoadingMatches ? (
                        <div className="py-4 text-talesblu-300 text-sm animate-pulse">{LL.TEST_SEARCHING()}</div>
                      ) : matches.length > 0 ? (
                        <AssignedLabelsTable matches={matches} />
                      ) : (
                        <div className="py-4 px-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-100 text-slate-400 text-xs font-medium">
                          {LL.TEST_NO_CALIBRATIONS()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-talesblu-300">
                  <div className="w-20 h-20 bg-talesblu-50 border-4 border-dashed border-talesblu-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold mb-1">
                    {status === 'Disconnected' ? LL.TEST_OFFLINE() : LL.TEST_WAITING()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 rounded-2xl flex items-start gap-4 animate-in slide-in-from-bottom-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">{LL.TEST_CONNECTION_ISSUE()}</p>
                <p className="text-sm font-medium opacity-80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Replace `src/app/testBoard/AssignedLabelsTable.tsx`**

```tsx
import type { TagMatch } from "@/types/story.type";
import { useI18nContext } from "@/i18n/i18n-react";

interface AssignedLabelProps {
    matches: TagMatch[];
}

export function AssignedLabelsTable({ matches }: AssignedLabelProps) {
    const { LL } = useI18nContext();

    return (
        <table className="w-full text-left border-collapse">
            <thead className="border-b-2 border-talesblu-500">
                <tr>
                    <th className="px-4 py-2 text-[10px] font-black text-talesblu-400 uppercase tracking-widest">{LL.TABLE_STORY()}</th>
                    <th className="px-4 py-2 text-[10px] font-black text-talesblu-400 uppercase tracking-widest text-right">{LL.TABLE_LABEL()}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-talesblu-100">
                {matches.map((match, i) => (
                    <tr key={i} className="hover:bg-talesorang-100/30 transition-colors group">
                        <td className="px-4 py-3 text-sm font-bold text-talesblu-800">{match.storyName}</td>
                        <td className="px-4 py-3 text-right">
                            <span className="inline-block px-2 py-1 bg-talesorang-50 text-talesorang-600 rounded-md text-[10px] font-black uppercase tracking-tight group-hover:bg-talesorang-100 transition-colors">
                                {match.label}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
```

- [ ] **Step 3: Replace `src/app/storyOverview/PlayStoryButton.tsx`**

```tsx
import Button from "@components/Button";
import { useNavigate } from "react-router-dom";
import { useI18nContext } from "@/i18n/i18n-react";

export default function PlayStoryButton({ id }: { id: string }) {
  const nav = useNavigate();
  const { LL } = useI18nContext();

  return (
    <Button
      primary={true}
      onClick={() => {
        nav(`/playStory/${id}`);
      }}
      cls="w-full">
      {LL.PLAY_BTN()}
    </Button>
  );
}
```

- [ ] **Step 4: Final type check**

```bash
cd /home/skid/Desktop/Projects/DI_Projects/2526-MOBI-016-I-m-in-tales-project/code
pnpm tsc
```
Expected: no errors.
