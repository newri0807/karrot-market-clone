"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {fetchChatRooms} from "@/app/(tabs)/chat/actions";
import Link from "next/link";
import {UserCircleIcon} from "@heroicons/react/24/outline";

interface ChatRoom {
    id: string;
    users: {
        username: string;
        avatar: string | null;
    }[];
    lastMessage: string;
    unreadCount: number;
}

export default function ChatList() {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const rooms = await fetchChatRooms();
                setChatRooms(rooms);
            } catch (error) {
                console.error("채팅 목록을 가져오는 중 오류 발생:", error);
            }
        };

        loadChatRooms();
    }, []);

    return (
        <div>
            {chatRooms.map((room) => (
                <div
                    key={room.id}
                    className="flex items-center gap-4 p-4 border-b border-neutral-600 hover:bg-neutral-800 transition-colors justify-around"
                >
                    <Link href={`/chat/view/${room.id}`} className="flex items-center gap-4 w-full">
                        {room?.users[0]?.avatar ? (
                            <Image
                                src={room?.users[0]?.avatar || "./default-avatar.png"}
                                alt={room.users[0].username}
                                width={50}
                                height={50}
                                className="rounded-full object-cover border border-neutral-600"
                            />
                        ) : (
                            <UserCircleIcon className="size-8" />
                        )}
                        <div className="flex-3">
                            <div className="font-bold text-lg">{room.users[0].username}</div>
                            <div className="text-sm text-gray-600">{room.lastMessage}</div>
                        </div>
                        {room.unreadCount > 0 && (
                            <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {room.unreadCount}
                            </div>
                        )}
                    </Link>
                </div>
            ))}
        </div>
    );
}
