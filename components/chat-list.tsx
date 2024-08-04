"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {fetchChatRooms} from "@/app/(tabs)/chat/actions";
import Link from "next/link";
import {UserCircleIcon} from "@heroicons/react/24/outline";

interface ChatRoom {
    id: string;
    otherUser: {
        username: string;
        avatar: string | null;
    } | null;
    lastMessage: string;
    unreadCount: number;
    productId: number | null;
}

export default function ChatList() {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadChatRooms = async () => {
            setIsLoading(true);
            try {
                const rooms = await fetchChatRooms();
                setChatRooms(rooms);
            } catch (error) {
                console.error("채팅 목록을 가져오는 중 오류 발생:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadChatRooms();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[85vh] text-neutral-400">
                <p>채팅 목록을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div>
            {chatRooms.length === 0 ? (
                <div className="flex flex-col justify-center items-center min-h-[85vh] text-neutral-400">
                    <p className="text-neutral-400 text-center">현재 사용중인 채팅이 없습니다.</p>
                </div>
            ) : (
                chatRooms.map((room) => (
                    <div
                        key={room.id}
                        className="flex items-center gap-4 p-4 border-b border-neutral-600 hover:bg-neutral-800 transition-colors justify-around"
                    >
                        <Link href={`/chat/view/${room.id}/${room.productId}`} className="flex items-center gap-4 w-full">
                            {room.otherUser?.avatar ? (
                                <Image
                                    src={room.otherUser.avatar || "./default-avatar.png"}
                                    alt={room.otherUser.username}
                                    width={50}
                                    height={50}
                                    className="rounded-full size-14 object-cover border border-neutral-600"
                                />
                            ) : (
                                <UserCircleIcon className="size-14" />
                            )}
                            <div className="flex-3">
                                <div className="font-bold text-md text-left">@{room.otherUser?.username}</div>
                                <div className="text-sm text-gray-600">{room.lastMessage}</div>
                            </div>
                            {room.unreadCount > 0 && (
                                <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                    {room.unreadCount}
                                </div>
                            )}
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
}
