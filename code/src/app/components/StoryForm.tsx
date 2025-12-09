import { InputLabel, TextAreaLabel, ImageUpload } from "@components";
import { useState } from "react";
export default function StoryForm() {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    return(
        <form action="" className="flex">
            <div className="min-h-full p-4">
                <div>
                    <InputLabel label="Story Name" nameId="StoryName" placeholder="My Amazing Story"/>
                </div>

                <div>
                    <TextAreaLabel cols={40} rows={3} nameId="Description" label="Description" placeholder="Something about the story" />
                </div>
            </div>
            {/* Make the image upload here via a component */}
            <div>
                <ImageUpload onThumbnailChange={setThumbnail}/>
                <button type="submit">Next</button>
            </div>
        </form>
    )
}