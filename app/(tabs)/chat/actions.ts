"use server";

// 데이터베이스 연결 및 세션 처리 유틸리티를 가져옵니다.
import db from "@/lib/db";
import getSession from "@/lib/session";

/**
 * 현재 로그인된 사용자의 채팅방 목록을 가져옵니다.
 *
 * @returns {Promise<Array>} 각 채팅방 객체의 배열을 반환합니다. 각 객체는 다음을 포함합니다:
 *  - id: 채팅방 ID
 *  - users: 채팅방에 있는 사용자 객체 배열 (각 사용자 객체는 username과 avatar를 포함)
 *  - lastMessage: 마지막 메시지 내용
 *  - unreadCount: 읽지 않은 메시지 수
 */
export async function fetchChatRooms() {
    const session = await getSession();
    const userId = session?.id;

    if (!userId) {
        throw new Error("로그인된 사용자가 없습니다.");
    }

    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId,
                },
            },
        },
        include: {
            users: true,
            messages: {
                orderBy: {
                    created_at: "desc",
                },
                take: 1,
            },
            Product: {
                select: {
                    id: true,
                },
            },
        },
    });

    return chatRooms.map((room) => {
        const otherUser = room.users.find((user) => user.id !== userId);
        return {
            id: room.id,
            otherUser: otherUser
                ? {
                      username: otherUser.username,
                      avatar: otherUser.avatar,
                  }
                : null,
            lastMessage: room.messages[0]?.payload || "",
            unreadCount: room.messages.filter((message) => !message.read && message.userId !== userId).length,
            productId: room.Product ? room.Product.id : null,
        };
    });
}
