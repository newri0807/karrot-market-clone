"use client";

import {useEffect, useOptimistic, useRef, useState} from "react";
import {createClient, RealtimeChannel} from "@supabase/supabase-js";
import Image from "next/image";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";

import {UserCircleIcon} from "@heroicons/react/24/outline";
import CustomButton from "@/components/ui/csbutton";
import {useRouter} from "next/navigation";
import { getUserFromSession, purchaseProduct, saveMessage } from '@/app/(tabs)/chat/view/[...id]/actions';

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

interface Product {
    id: number;
    title: string;
    photo: string;
    price: number;
    userId: number;
    sold: boolean;
}

interface ChatRoomProps {
    chatRoomId: string;
    productId: number;
    initialMessages: ChatMessage[];
    initialProduct: Product;
}

export default function ChatRoom({chatRoomId, productId, initialMessages, initialProduct}: ChatRoomProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel>();
    const [user, setUser] = useState<any>(null);
    const [product, setProduct] = useState<Product>(initialProduct);
    const [optimisticProduct, setOptimisticProduct] = useState<Product>(initialProduct);
    const router = useRouter();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        const setupChatRoom = async () => {
            if (chatRoomId) {
                const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
                channel.current = client.channel(`room-${chatRoomId}`);
                channel.current
                    .on("broadcast", {event: "message"}, (payload) => {
                        setMessages((prevMsgs) => {
                            // 중복 검사
                            if (prevMsgs.some((msg) => msg.id === payload.payload.id)) {
                                return prevMsgs;
                            }
                            return [...prevMsgs, payload.payload];
                        });
                    })
                    .subscribe();

                return () => {
                    channel.current?.unsubscribe();
                };
            }
        };

        setupChatRoom();
    }, [chatRoomId]);

    useEffect(() => {
        if (product) {
            setOptimisticProduct(product);
        }
    }, [product]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user || isSending) {
            return;
        }

        setIsSending(true);

        try {
            const newMessage = await saveMessage(chatRoomId, message, user.id);

            const chatMessage: ChatMessage = {
                id: newMessage.id,
                payload: newMessage.payload,
                created_at: new Date(newMessage.created_at).toISOString(),
                userId: user.id,
                user: {
                    username: user.username,
                    avatar: user.avatar,
                },
                read: newMessage.read,
            };

            // 옵티미스틱 업데이트
            setMessages((prevMessages) => [...prevMessages, chatMessage]);

            channel.current?.send({
                type: "broadcast",
                event: "message",
                payload: chatMessage,
            });
            setMessage("");
        } catch (error) {
            console.error("메시지 전송 중 오류가 발생했습니다.", error);
        } finally {
            setIsSending(false);
        }
    };

    const handlePurchase = async () => {
        if (!productId) {
            console.error("Product ID is missing.");
            return;
        }
        // Optimistic UI 상태 업데이트
        setOptimisticProduct((prev) => (prev ? {...prev, sold: true} : prev));

        try {
            const updatedProduct = await purchaseProduct(productId);
            setProduct(updatedProduct);
            setOptimisticProduct(updatedProduct);
            router.push(`/review/${productId}/${user.id}`);
        } catch (error) {
            console.error("구매 처리 중 오류가 발생했습니다.", error);
            setOptimisticProduct(product); // 오류 발생 시 상태 되돌리기
        }
    };

    if (!chatRoomId || !user) return null;

    return (
        <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
            {product && (
                <div
                    className={`flex items-center gap-4 p-5 bg-gray-100 rounded-md absolute top-3 left-0 w-full ${
                        optimisticProduct && optimisticProduct.sold ? "opacity-50" : ""
                    }`}
                >
                    <Image src={product.photo} alt={product.title} width={150} height={150} className="rounded-md size-36 object-cover" />
                    <div className="flex flex-col min-w-[50%]">
                        <h2 className="text-xl font-bold text-black">{product.title}</h2>
                        <span className="text-lg text-green-600">{formatToWon(product.price)}원</span>
                        {optimisticProduct && !optimisticProduct.sold ? (
                            <CustomButton text="구매하기" onClick={handlePurchase} className="mt-2 bg-blue-500 hover:bg-blue-700" />
                        ) : (
                            <CustomButton text="구매완료" className="mt-2 bg-neutral-700 cursor-not-allowed hover:bg-neutral-700 " />
                        )}
                    </div>
                </div>
            )}
            {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 items-start ${message.userId === user?.id ? "justify-end" : "justify-start"}`}>
                    {message.userId !== user?.id &&
                        (message?.user?.avatar ? (
                            <Image
                                src={message.user.avatar || "/default-avatar.png"}
                                alt={message.user.username}
                                width={50}
                                height={50}
                                className="size-8 rounded-full"
                            />
                        ) : (
                            <UserCircleIcon className="size-8" />
                        ))}

                    <div className={`flex flex-col gap-1 ${message.userId === user?.id ? "items-end text-right" : "items-start text-left"}`}>
                        <span className={`${message.userId === user?.id ? "bg-neutral-500" : "bg-orange-500"} p-2.5 rounded-md`}>
                            {message.payload}
                        </span>
                        <span className="text-xs">{formatToTimeAgo(message.created_at)}</span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
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
                <button className="absolute right-0" disabled={isSending}>
                    <ArrowUpCircleIcon
                        className={`size-10 transition-colors ${
                            isSending ? "text-gray-400 cursor-not-allowed" : "text-orange-500 hover:text-orange-300"
                        }`}
                    />
                </button>
            </form>
        </div>
    );
}
