import Center from "./Center";

interface LoadingScreenProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function LoadingScreen({
  title,
  description,
  imageSrc = "/Logo.svg",
  imageAlt = "loading",
}: LoadingScreenProps) {
  return (
    <Center>
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md p-8 bg-white/40 rounded-3xl border border-white/60 transition-all duration-300">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full bg-talesorang-400/20 blur-xl animate-pulse" />
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-48 h-48 object-contain animate-spin"
            style={{ animationDuration: "4s" }}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-talesblu-900 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-md font-medium text-gray-500 max-w-xs mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </Center>
  );
}
