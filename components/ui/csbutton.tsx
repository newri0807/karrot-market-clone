"use client";

import React, {ReactNode} from "react";
import {useRouter} from "next/navigation";
import {Button} from "./Button";

interface ButtonProps {
    text: ReactNode;
    className?: string;
    path?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton: React.FC<ButtonProps> = ({text, className, path, onClick}) => {
    const router = useRouter();

    const handleRedirect = (event: React.MouseEvent<HTMLButtonElement>, path?: string) => {
        event.stopPropagation(); // 부모 이벤트 전파 막기
        if (path) {
            router.push(`${path}`);
        }
    };

    return (
        <Button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                handleRedirect(event, path);
                if (onClick) onClick(event);
            }}
            className={`bg-[#FF822D] text-white hover:bg-[#ff812dc4] w-full ${className}`}
        >
            {text}
        </Button>
    );
};

export default CustomButton;
