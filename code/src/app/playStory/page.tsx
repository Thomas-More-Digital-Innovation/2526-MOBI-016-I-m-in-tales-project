import { Header } from "@components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Story, StoriesData } from "../../types/story.type";

export default function PlayStory() {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch("/stories.json")
            .then((res) => res.json())
            .then((data: StoriesData) => {
                const found = (data.story || []).find((s) => s.id === id) || null;
                setStory(found);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <main className="bg-white min-h-screen">
            <Header />
            <div className="p-4">
                {loading ? (
                    <p>Loading...</p>
                ) : story ? (
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4">{story.name}</h1>
                        <img src={story.image} alt={story.name} className="w-full h-64 object-cover rounded mb-4" />
                        <p className="mb-4">{story.description}</p>
                        {/* Add play UI here */}
                    </div>
                ) : (
                    <p>Story not found</p>
                )}
            </div>
        </main>
    );
}


