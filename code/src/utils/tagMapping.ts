import { BaseDirectory, readTextFile, writeTextFile, exists } from "@tauri-apps/plugin-fs";

const MAPPING_FILE = "tag_calibrations.json";

/**
 * Structure: 
 * {
 *   "story_id": {
 *      "item_id": "hardware_uid"
 *   }
 * }
 */
export interface StoryCalibrations {
    [storyId: string]: {
        [itemId: string]: string;
    };
}

export async function loadAllCalibrations(): Promise<StoryCalibrations> {
    try {
        const fileExists = await exists(MAPPING_FILE, { baseDir: BaseDirectory.AppData });
        if (!fileExists) return {};
        
        const content = await readTextFile(MAPPING_FILE, { baseDir: BaseDirectory.AppData });
        return JSON.parse(content);
    } catch (e) {
        console.warn("Could not load calibrations", e);
        return {};
    }
}

export async function saveAllCalibrations(calibrations: StoryCalibrations): Promise<void> {
    try {
        await writeTextFile(MAPPING_FILE, JSON.stringify(calibrations, null, 2), {
            baseDir: BaseDirectory.AppData,
        });
    } catch (e) {
        console.error("Failed to save calibrations", e);
    }
}

export async function getStoryCalibration(storyId: string): Promise<Record<string, string>> {
    const all = await loadAllCalibrations();
    return all[storyId] || {};
}

export async function addCalibration(storyId: string, itemId: string, hardwareUid: string): Promise<void> {
    const all = await loadAllCalibrations();
    if (!all[storyId]) all[storyId] = {};
    all[storyId][itemId] = hardwareUid;
    await saveAllCalibrations(all);
}

/**
 * Resolves a hardware UID to a Story Item ID based on the active story context.
 */
export function resolveTagForStory(uid: string, storyId: string, calibrations: StoryCalibrations): string | null {
    const storyMap = calibrations[storyId];
    if (!storyMap) return null;

    // Find the item ID that is mapped to this UID
    const entry = Object.entries(storyMap).find(([_, hUid]) => hUid === uid);
    return entry ? entry[0] : null;
}
