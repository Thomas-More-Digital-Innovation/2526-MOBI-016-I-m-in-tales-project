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
 * Allows prioritization of specific allowed item IDs to handle physical tag reuse.
 */
export function resolveTagForStory(
    uid: string,
    storyId: string,
    calibrations: StoryCalibrations,
    allowedItemIds?: string[]
): string | null {
    const storyMap = calibrations[storyId];
    if (!storyMap) return null;

    // Find all item IDs mapped to this UID
    const entries = Object.entries(storyMap).filter(([_, hUid]) => hUid === uid);
    if (entries.length === 0) return null;

    if (allowedItemIds && allowedItemIds.length > 0) {
        // Prioritize the entry that matches one of the allowed item IDs
        const allowedEntry = entries.find(([itemId]) => allowedItemIds.includes(itemId));
        if (allowedEntry) return allowedEntry[0];
    }

    // Fallback to the first matched item ID
    return entries[0][0];
}
