import { Header, StoryForm } from "@components";
export default function makeStory() {
    return(
        <main className="bg-white h-screen">
            <Header />
            <div className="h-screen flex justify-center items-center">
                <StoryForm />
            </div>
        </main>
    );
}