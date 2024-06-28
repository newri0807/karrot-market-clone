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
    // 현재 세션을 가져옵니다.
    const session = await getSession();
    const userId = session?.id;

    // 사용자가 로그인되지 않은 경우 에러를 발생시킵니다.
    if (!userId) {
        throw new Error("로그인된 사용자가 없습니다.");
    }

    // 현재 사용자가 참여하고 있는 모든 채팅방을 가져옵니다.
    const chatRooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId, // 현재 사용자가 포함된 채팅방을 찾습니다.
                },
            },
        },
        include: {
            users: true, // 각 채팅방에 포함된 사용자 정보를 포함시킵니다.
            messages: {
                orderBy: {
                    created_at: "desc", // 메시지를 생성 날짜 기준으로 내림차순 정렬합니다.
                },
                take: 1, // 각 채팅방의 마지막 메시지 하나만 가져옵니다.
            },
        },
    });

    // 각 채팅방 객체를 변환하여 반환합니다.
    return chatRooms.map((room) => ({
        id: room.id, // 채팅방 ID
        users: room.users.map((user) => ({
            username: user.username, // 사용자의 이름
            avatar: user.avatar, // 사용자의 아바타
        })),
        lastMessage: room.messages[0]?.payload || "", // 마지막 메시지 내용 (없으면 빈 문자열)
        unreadCount: room.messages.filter((message) => !message.read && message.userId !== userId).length, // 읽지 않은 메시지 수 (현재 사용자가 보낸 메시지는 제외)
    }));
}
