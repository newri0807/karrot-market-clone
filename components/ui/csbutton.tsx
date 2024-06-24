"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "./Button";

interface ButtonProps {
    text: string;
    className?: string;
    path?: string;
    onClick?: () => void;
}

const CustomButton = ({text, className, path, onClick}: ButtonProps) => {
    const router = useRouter();

    const handleRedirect = (path?: string) => {
        router.push(`${path}`);
    };

    return (
        <Button
            onClick={() => {
                if (path) handleRedirect(path);
                if (onClick) onClick();
            }}
            className={`bg-[#FF822D] text-white hover:bg-[#ff812dc4] w-full ${className}`}
        >
            {text}
        </Button>
    );
};

export default CustomButton;
