export interface StoryVisualsProps {
    image: string | undefined;
}

export default function StoryVisuals({ image }: StoryVisualsProps) {
    if (!image) return null;

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <img
                src={image}
                className="w-full h-full object-cover"
                alt="Story Background"
            />
        </div>
    );
}
