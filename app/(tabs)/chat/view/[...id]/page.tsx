import {Suspense} from "react";
import {fetchMessages, fetchProduct} from "./actions";
import ModalLoading from "@/app/(tabs)/home/@modal/loading";
import ChatRoom from "@/components/chatRoom/chatRoom";

interface ChatRoomPageProps {
    params: {id: string[]};
}

export const revalidate = 60; // 60초마다 페이지 재검증

export default async function ChatRoomPage({params}: ChatRoomPageProps) {
    const chatRoomId = params.id[0];
    const productId = Number(params.id[1]);

    const initialMessages = await fetchMessages(chatRoomId);
    const product = await fetchProduct(productId);

    return (
        <Suspense fallback={<ModalLoading />}>
            <ChatRoom chatRoomId={chatRoomId} productId={productId} initialMessages={initialMessages} initialProduct={product} />
        </Suspense>
    );
}
