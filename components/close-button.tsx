"use client";

import {XMarkIcon} from "@heroicons/react/24/solid";
import {useRouter} from "next/navigation";

interface CloseButtonProps {
    productId: number;
}

export default function CloseButton({productId}: CloseButtonProps) {
    const router = useRouter();

    const onCloseClick = () => {
        window.location.reload();
    };

    return (
        <button onClick={onCloseClick} className="absolute right-0 top-[10rem] text-neutral-200">
            <XMarkIcon className="size-10" />
        </button>
    );
}
