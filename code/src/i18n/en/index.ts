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
