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
  HOME_TOOLTIP_TEST_CONNECTION: 'Test je Whisper-lezer verbinding!',

  // Manage Story page
  MANAGE_TITLE: 'Beheer Mijn Verhalen',
  MANAGE_LOADING_TITLE: 'Verhalen beheren...',
  MANAGE_LOADING_DESC: 'Even geduld, we laden je bibliotheek...',
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
  MAKE_CARD_NAME_REQUIRED: 'Voer een verhaalnaam in',
  MAKE_CARD_NAME_LABEL: 'Verhaalnaam',
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
  NODE_AUTO_ADVANCE: 'Automatisch doorgaan na afronding audio',
  NODE_AUTO_ADVANCE_DESC: 'Ga automatisch door zodra de vertelling eindigt',
  NODE_AUTO_ADVANCE_DISABLED: '* NFC-tags genegeerd door automatisch doorgaan',
  NODE_TRANSITION_LABEL_OPTIONAL: 'Overgangslabel (optioneel)',
  NODE_LINK_TO: 'Naar:',
  NODE_LINK_SELECT_HINT: 'Klik om dit hoofdstuk te selecteren op het canvas',

  // StoryCanvas component
  CANVAS_NO_IMAGE: 'Geen afbeelding',
  CANVAS_HINT: 'Klik + sleep om te pannen \n Klik op een hoofdstuk om het te selecteren \n Scroll om in te zoomen \n Gebruik de knop hierboven om een nieuw hoofdstuk toe te voegen',
  CANVAS_RECENTER: 'Canvas hercentreren & zoom herstellen',

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

  // AudioSettingsModal component
  AUDIO_SETTINGS_TITLE: 'Hoofdstuk Geluidsbeheer',
  AUDIO_SETTINGS_DESC: 'Configureer en neem vertel- en foutieve actie (fail) feedback-audio op/upload.',
  AUDIO_NARRATION_TITLE: 'Vertel-audio',
  AUDIO_NARRATION_DESC: 'Wordt afgespeeld wanneer de gebruiker dit hoofdstuk opent.',
  AUDIO_FAIL_TITLE: 'Feedback / Fout-audio',
  AUDIO_FAIL_DESC: 'Wordt afgespeeld als de gebruiker een onjuist label gebruikt in dit hoofdstuk (optioneel).',
  AUDIO_RECORD: 'Neem audio op',
  AUDIO_RECORDING: 'Opnemen...',
  AUDIO_STOP_RECORD: 'Stop & Opslaan',
  AUDIO_UPLOAD_FILE: 'Upload Bestand',
  AUDIO_PLAYBACK: 'Afspeelvoorbeeld',
  AUDIO_NO_AUDIO: 'Geen audio geconfigureerd.',
  AUDIO_CLEAR: 'Verwijder Audio',
  AUDIO_STATUS_READY: 'Gereed',
  AUDIO_STATUS_EMPTY: 'Leeg',
  AUDIO_TAP_RECORD: 'Tik op opnemen om te beginnen met spreken',
  AUDIO_MIC_PERMISSION_ERROR: 'Kan geen toegang krijgen tot de microfoon. Controleer uw systeemrechten.',
  AUDIO_MIC_LINUX_ERROR: 'Microfoonopname wordt momenteel niet ondersteund in Tauri op Linux vanwege WebKit2GTK-beperkingen. Neem op met de standaard geluidsrecorder van uw systeem en upload het bestand.',
  AUDIO_DROP_HERE: 'Sleep audiobestand hierheen',
  AUDIO_SETUP: 'Audio-instellingen',
  AUDIO_MANAGE_BUTTON: 'Beheer Audio',
  AUDIO_READY: 'Gereed',
  AUDIO_OPTIONAL: 'Optioneel',
  AUDIO_MISSING: 'Ontbreekt',
} satisfies Translation

export default nl
