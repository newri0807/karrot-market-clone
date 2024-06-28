"use client";
import {useEffect, useRef, useState} from "react";
import {createClient, RealtimeChannel} from "@supabase/supabase-js";
import Image from "next/image";
import {formatToTimeAgo} from "@/lib/utils";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";
import {fetchMessages, getUserFromSession, saveMessage} from "./actions";

const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

interface ChatMessage {
    id: number;
    payload: string;
    created_at: string;
    userId: number;
    user: {
        username: string;
        avatar: string | null;
    };
    read: boolean;
}

type ChatRoomIdProps = {
    params: {id: string};
};

export default function ChatRoomPage({params}: ChatRoomIdProps) {
    const chatRoomId = params.id;
    const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel>();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserFromSession();
                setUser(user);
            } catch (error) {
                console.error("사용자 정보를 가져오는 중 오류가 발생했습니다.", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (chatRoomId) {
            fetchMessages(chatRoomId).then((messages) => {
                const formattedMessages = messages.map((message) => ({
                    ...message,
                    created_at: message.created_at.toString(), // Convert Date to string
                }));
                setInitialMessages(formattedMessages);
                setMessages(formattedMessages);
            });
        }
    }, [chatRoomId]);

    useEffect(() => {
        if (chatRoomId) {
            const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
            channel.current = client.channel(`room-${chatRoomId}`);
            channel.current
                .on("broadcast", {event: "message"}, (payload) => {
                    setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
                })
                .subscribe();

            return () => {
                channel.current?.unsubscribe();
            };
        }
    }, [chatRoomId]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user) {
            console.error("사용자가 로그인되어 있지 않습니다.");
            return;
        }

        const newMessage = await saveMessage(chatRoomId, message, user.id);

        const chatMessage: ChatMessage = {
            id: newMessage.id,
            payload: newMessage.payload,
            created_at: new Date(newMessage.created_at).toISOString(), // Convert Date to string
            userId: user.id,
            user: {
                username: user.username,
                avatar: user.avatar,
            },
            read: newMessage.read,
        };

        setMessages((prevMsgs) => [...prevMsgs, chatMessage]);
        channel.current?.send({
            type: "broadcast",
            event: "message",
            payload: chatMessage,
        });
        setMessage("");
    };

    if (!chatRoomId || !user) return <div>Loading...</div>;

    return (
        <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
            {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 items-start ${message.userId === user?.id ? "justify-end" : "justify-start"}`}>
                    {message.userId !== user?.id && (
                        <Image
                            src={message.user.avatar || "/default-avatar.png"}
                            alt={message.user.username}
                            width={50}
                            height={50}
                            className="size-8 rounded-full"
                        />
                    )}
                    <div className={`flex flex-col gap-1 ${message.userId === user?.id ? "items-end text-right" : "items-start text-left"}`}>
                        <span className={`${message.userId === user?.id ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md`}>
                            {message.payload}
                        </span>
                        <span className="text-xs">{formatToTimeAgo(message.created_at)}</span>
                    </div>
                </div>
            ))}
            <form className="flex relative" onSubmit={onSubmit}>
                <input
                    required
                    onChange={onChange}
                    value={message}
                    className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
                    type="text"
                    name="message"
                    placeholder="Write a message..."
                />
                <button className="absolute right-0">
                    <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
                </button>
            </form>
        </div>
    );
}
