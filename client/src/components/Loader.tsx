import { cn } from "@/lib/utils";
import React from "react";

interface LoaderProps {
    size: number;
    fillParent?: boolean;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
    className,
    size,
    fillParent = false,
}) => {
    return (
        <div
            className={`flex justify-center items-center ${
                fillParent ? "h-screen" : ""
            }`}
        >
            <div
                className={cn(
                    `animate-spin rounded-full border-black`,
                    className
                )}
                style={{
                    borderBottomWidth: `${size / 64}rem`,
                    height: `${size / 4}rem`,
                    width: `${size / 4}rem`,
                }}
            />
        </div>
    );
};

export default Loader;
