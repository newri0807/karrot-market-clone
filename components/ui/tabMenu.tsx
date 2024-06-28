"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

import {
    HomeIcon as SolidHomeIcon,
    NewspaperIcon as SolidNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
    VideoCameraIcon as SolidVideoCameraIcon,
    UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
    HomeIcon as OutlineHomeIcon,
    NewspaperIcon as OutlineNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
    VideoCameraIcon as OutlineVideoCameraIcon,
    UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
const TabMenu = () => {
    const currentPage = usePathname();
    const isProductsViewPath = currentPage.includes("/products/view/");
    const isChatViewPath = currentPage.includes("/chat/view/");

    if (isProductsViewPath || isChatViewPath) {
        return null;
    }
    return (
        <div className="w-[360px] fixed bottom-0 z-30 bg-[#232323] ">
            <ul className="grid grid-cols-5 items-center h-10 my-3 mx-1 *:text-white">
                <li className="flex flex-col items-center">
                    <Link href="/home">
                        {currentPage.includes("/home") || currentPage.includes("/products") ? (
                            <SolidHomeIcon className="w-7 h-7 mx-auto" />
                        ) : (
                            <OutlineHomeIcon className="w-7 h-7 mx-auto" />
                        )}
                        <span>홈</span>
                    </Link>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/living">
                        {currentPage.includes("/living") ? (
                            <SolidNewspaperIcon className="w-7 h-7 mx-auto" />
                        ) : (
                            <OutlineNewspaperIcon className="w-7 h-7 mx-auto" />
                        )}
                        <span className="text-white">동네생활</span>
                    </Link>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/chat">
                        {currentPage === "/chat" ? <SolidChatIcon className="w-7 h-7 mx-auto" /> : <OutlineChatIcon className="w-7 h-7 mx-auto" />}
                        <span className="text-white">채팅</span>
                    </Link>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/shop">
                        {currentPage === "/shop" ? (
                            <SolidVideoCameraIcon className="w-7 h-7 mx-auto" />
                        ) : (
                            <OutlineVideoCameraIcon className="w-7 h-7 mx-auto" />
                        )}
                        <span className="text-white">쇼핑</span>
                    </Link>
                </li>
                <li className="flex flex-col items-center">
                    <Link href="/myPage">
                        {currentPage === "/myPage" ? <SolidUserIcon className="w-7 h-7 mx-auto" /> : <OutlineUserIcon className="w-7 h-7 mx-auto" />}
                        <span className="text-white">나의당근</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default TabMenu;
