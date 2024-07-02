"use client";
import {findOrCreateChatRoom, getUserFromSession} from "@/app/(tabs)/chat/view/[...id]/actions";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Button} from "./ui/Button";

interface ChatButtonProps {
    text: string;
    otherUserId: number;
    produdctId: number;
}

export default function ChatButton({text, otherUserId, produdctId}: ChatButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const user = await getUserFromSession();
            const chatRoom = await findOrCreateChatRoom(user.id, otherUserId, produdctId);
            router.push(`/chat/view/${chatRoom.id}/${produdctId}`);
        } catch (error) {
            console.error("Error creating or finding chat room", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleClick} className="bg-[#FF822D] text-white hover:bg-[#ff812dc4] w-full" disabled={loading}>
            {loading ? "Loading..." : text}
        </Button>
    );
}
