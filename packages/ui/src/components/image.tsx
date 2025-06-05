import { useImage } from "react-image";
import { cn } from "../lib/utils";

interface ImageProps {
    src: string | string[];
    alt: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    loading?: "lazy" | "eager";
    onLoad?: () => void;
    onError?: () => void;
}

export const Image = ({
    src,
    alt,
    className,
    width,
    height,
    loading = "lazy",
    onLoad,
    onError,
}: ImageProps) => {
    const srcList = Array.isArray(src)
        ? [...src, "/unpocketme.png"]
        : [src, "/unpocketme.png"];

    const { src: imageSrc, isLoading } = useImage({
        srcList,
        useSuspense: false,
    });

    const handleLoad = () => {
        onLoad?.();
    };

    const handleError = () => {
        onError?.();
    };

    if (isLoading) {
        return (
            <div
                className={cn("bg-muted animate-pulse", className)}
                style={{ width, height }}
            />
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
};
