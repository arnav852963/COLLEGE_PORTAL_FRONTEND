import React from "react";
import background from "../assets/background.png";

export const Background = ({
    image = background,
    blur = 10,
    dim = 0.55,
    className = "",
}) => {
    return (
        <div
            className={`absolute inset-0 z-0 ${className}`.trim()}
            aria-hidden="true"
        >
            <div
                className="absolute inset-0 -z-10 bg-center bg-cover"
                style={{
                    backgroundImage: `url(${image})`,
                    filter: `blur(${blur}px)`,
                    transform: "scale(1.05)",
                }}
            />
            <div className="absolute inset-0 -z-10 bg-gray-900" style={{ opacity: dim }} />
        </div>
    );
};
