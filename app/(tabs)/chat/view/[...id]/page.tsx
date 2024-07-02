"use client";
import {useEffect, useOptimistic, useRef, useState} from "react";
import {createClient, RealtimeChannel} from "@supabase/supabase-js";
import Image from "next/image";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {ArrowUpCircleIcon} from "@heroicons/react/24/solid";
import {fetchMessages, getUserFromSession, saveMessage, fetchProduct, purchaseProduct} from "./actions";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import CustomButton from "@/components/ui/csbutton";
import {useRouter} from "next/navigation";

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

type ChatRoomIdProps = {
    params: {id: string};
};

export default function ChatRoomPage({params}: ChatRoomIdProps) {
    const chatRoomId = params.id[0];
    const productId = Number(params.id[1]);
    const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState("");
    const channel = useRef<RealtimeChannel>();
    const [user, setUser] = useState<any>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [optimisticProduct, setOptimisticProduct] = useState<Product | null>(null);
    const router = useRouter();

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
                        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
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
        const fetchInitialData = async () => {
            if (chatRoomId) {
                try {
                    const messages = await fetchMessages(chatRoomId);
                    const formattedMessages = messages.map((message) => ({
                        ...message,
                        created_at: message.created_at.toString(), // Convert Date to string
                    }));
                    setInitialMessages(formattedMessages);
                    setMessages(formattedMessages);
                } catch (error) {
                    console.error("메시지를 가져오는 중 오류가 발생했습니다.", error);
                }
            }

            if (productId) {
                try {
                    const fetchedProduct = await fetchProduct(productId);
                    setProduct(fetchedProduct);
                    setOptimisticProduct(fetchedProduct);
                } catch (error) {
                    console.error("상품 정보를 가져오는 중 오류가 발생했습니다.", error);
                }
            }
        };

        fetchInitialData();
    }, [chatRoomId, productId]);

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

    if (!chatRoomId || !user) return <div>Loading...</div>;

    return (
        <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
            {product && user.id !== product.id && (
                <div
                    className={`flex items-center gap-4 p-5 bg-gray-100 rounded-md absolute top-3 left-0 w-full ${
                        optimisticProduct && optimisticProduct.sold ? "opacity-50" : ""
                    }`}
                >
                    <Image src={product.photo} alt={product.title} width={150} height={150} className="rounded-md" />
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-black">{product.title}</h2>
                        <span className="text-lg text-green-600">{formatToWon(product.price)}원</span>
                        {optimisticProduct && !optimisticProduct.sold ? ( // 현재 사용자가 제품 소유자가 아닌 경우에만 버튼 표시
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
