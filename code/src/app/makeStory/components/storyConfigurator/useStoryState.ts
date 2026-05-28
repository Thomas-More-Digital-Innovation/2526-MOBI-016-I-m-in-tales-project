import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadStoryData, saveStoryData } from "@utils/storyIO";
import { getStoryCalibration } from "@utils/tagMapping";
import { message } from "@tauri-apps/plugin-dialog";

export type StoryLink = {
  targetId: string;
  itemId: string;
  itemLabel: string;
};

export type ChapterNode = {
  id: string;
  title: string;
  description: string;
  audio: string | null;
  audioSrc?: string | null;
  audioBytes?: Uint8Array | null;
  failAudioSrc?: string | null;
  failAudioBytes?: Uint8Array | null;
  image: CanvasImageSource | null;
  imageSrc?: string | null;
  imageBytes?: Uint8Array | null;
  x: number;
  y: number;
  links: StoryLink[];
};

export function useStoryState(folderName: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as { story: any } | null;

  const [storyId, setStoryId] = useState<string | null>(initialState?.story?.id || null);
  const [storyMetadata, setStoryMetadata] = useState<any>(initialState?.story || null);
  const [nodes, setNodes] = useState<ChapterNode[]>([
    {
      id: crypto.randomUUID(),
      title: "Intro",
      description: "Intro Scene",
      image: null,
      audio: null,
      x: 200,
      y: 200,
      links: [],
    },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(nodes[0]?.id || null);
  const [calibrations, setCalibrations] = useState<Record<string, string>>({});
  const [linking, setLinking] = useState(false);
  const [linkingRootId, setLinkingRootId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(true);
  const [loading, setLoading] = useState(folderName !== "new");

  useEffect(() => {
    if (folderName && folderName !== "new") {
      loadStoryData(folderName)
        .then(async (data) => {
          if (data.story?.id) {
            setStoryId(data.story.id);
            setStoryMetadata(data.story);

            if (data.story.chapter && data.story.chapter.length > 0) {
              const loadedNodes = data.story.chapter.map((ch: any) => {
                const node: ChapterNode = {
                  id: ch.id,
                  title: ch.title,
                  description: ch.description,
                  audio: null,
                  audioBytes: ch.audio,
                  audioSrc: ch.audio ? URL.createObjectURL(new Blob([ch.audio as any])) : null,
                  image: null,
                  imageBytes: ch.image,
                  imageSrc: ch.image ? URL.createObjectURL(new Blob([ch.image as any])) : null,
                  failAudioBytes: ch.failAudio,
                  failAudioSrc: ch.failAudio ? URL.createObjectURL(new Blob([ch.failAudio as any])) : null,
                  x: Math.random() * 400,
                  y: Math.random() * 400,
                  links: ch.option?.map((opt: any) => ({
                    targetId: opt.nextChapter,
                    itemId: opt.item,
                    itemLabel: "Loaded Item"
                  })) || []
                };

                if (node.imageSrc) {
                  const img = new window.Image();
                  img.onload = () => {
                    setNodes((prev) => prev.map((n) => (n.id === node.id ? { ...n, image: img } : n)));
                  };
                  img.src = node.imageSrc;
                }
                return node;
              });
              setNodes(loadedNodes);
              setSelectedId(loadedNodes[0].id);
            }
          }
          setLoading(false);
        })
        .catch((err) => {
          // if the zip doesn't exist, we treat it as a new story
          console.warn("Story file not found, initializing as new story:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [folderName]);


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (storyId) {
      getStoryCalibration(storyId).then(setCalibrations);
    }
  }, [storyId]);

  const createNewNode = () => {
    const newNode: ChapterNode = {
      id: crypto.randomUUID(),
      title: "New Chapter",
      description: "New Chapter Description",
      image: null,
      audio: null,
      x: 100,
      y: 100,
      links: [],
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedId(newNode.id);
    setIsDirty(true);
  };

  const deleteNode = (id: string) => {
    if (nodes.length <= 1) return; // Keep at least one node
    setNodes((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      // Also remove any links pointing to this node
      return filtered.map(n => ({
        ...n,
        links: n.links.filter(l => l.targetId !== id)
      }));
    });
    if (selectedId === id) {
      setSelectedId(nodes.find(n => n.id !== id)?.id || null);
    }
    setIsDirty(true);
  };

  const updateNode = (id: string, updates: Partial<ChapterNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    setIsDirty(true);
  };

  const updateCalibrations = (updated: Record<string, string>) => {
    setCalibrations(updated);
    setIsDirty(true);
  };

  const toggleLinking = (id: string | null) => {
    setLinking(!linking);
    setLinkingRootId(id);
  };

  const saveFile = async () => {
    const hasEmptyLabels = nodes.some((node) =>
      node.links.some((link) => !link.itemLabel.trim())
    );

    if (hasEmptyLabels) {
      await message("Please fill in all interaction labels before saving.", {
        title: "Validation Error",
        kind: "error",
      });
      return;
    }

    const items: { itemId: string; linkedTo: string; label: string }[] = [];
    const chapters = nodes.map((node) => {
      const options = node.links.map((link) => {
        items.push({
          itemId: link.itemId,
          linkedTo: link.targetId,
          label: link.itemLabel
        });
        return {
          nextChapter: link.targetId,
          audio: null,
          item: link.itemId,
        };
      });

      return {
        id: node.id,
        title: node.title,
        description: node.description,
        audio: node.audioBytes ?? null,
        image: node.imageBytes ?? null,
        failAudio: node.failAudioBytes ?? null,
        option: options,
      };
    });

    const finalStoryName = storyMetadata?.name || folderName || "New Story";
    const finalFolderName = finalStoryName.trim().replace(/\s+/g, "_").toLowerCase();

    const dataToSave = {
      story: { ...storyMetadata, chapter: chapters },
      items: items,
    };

    await saveStoryData(finalFolderName, dataToSave);
    setIsDirty(false);
  };

  return {
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
    setNodes,
    storyId,
    calibrations,
    setCalibrations: updateCalibrations,
    storyMetadata,
    isDirty,
    loading
  };
}
