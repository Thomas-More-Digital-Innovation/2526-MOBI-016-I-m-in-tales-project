export default function StoryForm() {
    return(
        <form action="" className="flex w-1/4">
            <div className="min-h-full">
                <div className="flex flex-col h-1/4">
                    <label htmlFor="StoryName">Story Name</label>
                    <input className="border rounded p-1 h-full" type="text" name="StoryName" id="StoryName" placeholder="My Story" />
                </div>

                <div className="flex flex-col h-1/2">
                    <label htmlFor="Description">Description</label>
                    <textarea className="border rounded px-1 h-full" name="Description" id="Description" placeholder="Something about the story" />
                </div>
            </div>
            {/* Make the image upload here via a component */}
            <div>
                <img className="border " width={200} height={200} src={"/file.svg"} alt="Input Image"/>
                <button type="submit">Next</button>
            </div>
        </form>
    )
}