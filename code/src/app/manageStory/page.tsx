import { useEffect, useState } from "react";
import { Header, Button, StoryCard, ImportButton, LoadingScreen, NoStoriesCTA } from "@components";
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
          <NoStoriesCTA />
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
