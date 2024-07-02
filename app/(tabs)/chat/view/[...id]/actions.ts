"use server";

// 세션 처리 및 데이터베이스 연결 유틸리티를 가져옵니다.
import getSession from "@/lib/session";
import db from "@/lib/db";

/**
 * 현재 세션에서 사용자를 가져옵니다.
 *
 * @returns {Promise<Object>} 사용자 객체를 반환합니다.
 * @throws {Error} 세션이 유효하지 않거나 사용자를 찾을 수 없는 경우 에러를 발생시킵니다.
 */
export async function getUserFromSession() {
    // 현재 세션을 가져옵니다.
    const session = await getSession();
    if (!session?.id) {
        throw new Error("세션이 유효하지 않습니다."); // 유효하지 않은 세션일 경우 에러를 발생시킵니다.
    }

    // 세션 ID를 사용하여 사용자 정보를 데이터베이스에서 조회합니다.
    const user = await db.user.findUnique({
        where: {id: session?.id},
    });

    if (!user) {
        throw new Error("사용자를 찾을 수 없습니다."); // 사용자를 찾을 수 없을 경우 에러를 발생시킵니다.
    }

    // 사용자 정보를 반환합니다.
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar ?? null,
    };
}

/**
 * 특정 채팅방의 메시지를 가져옵니다.
 *
 * @param {string} chatRoomId - 채팅방 ID
 * @returns {Promise<Array>} 메시지 객체 배열을 반환합니다.
 * @throws {Error} 세션이 유효하지 않은 경우 에러를 발생시킵니다.
 */
export async function fetchMessages(chatRoomId: string) {
    // 현재 세션을 가져옵니다.
    const session = await getSession();
    if (!session?.id) {
        throw new Error("세션이 유효하지 않습니다."); // 유효하지 않은 세션일 경우 에러를 발생시킵니다.
    }

    // 특정 채팅방의 모든 메시지를 생성된 날짜 기준으로 오름차순 정렬하여 가져옵니다.
    const messages = await db.message.findMany({
        where: {chatRoomId},
        orderBy: {created_at: "asc"},
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    // 현재 사용자가 보낸 메시지를 제외하고, 해당 채팅방의 모든 읽지 않은 메시지를 읽음 상태로 업데이트합니다.
    await db.message.updateMany({
        where: {
            chatRoomId,
            userId: {
                not: session.id, // 현재 사용자가 보낸 메시지를 제외
            },
            read: false, // 읽지 않은 메시지만 업데이트
        },
        data: {
            read: true,
        },
    });

    // 메시지 객체를 변환하여 반환합니다.
    return messages.map((message) => ({
        id: message.id,
        payload: message.payload,
        created_at: message.created_at.toISOString(), // Date 객체를 문자열로 변환
        userId: message.userId,
        user: {
            username: message.user.username,
            avatar: message.user.avatar,
        },
        read: message.read,
    }));
}

/**
 * 새로운 메시지를 저장합니다.
 *
 * @param {string} chatRoomId - 채팅방 ID
 * @param {string} message - 메시지 내용
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 생성된 메시지 객체를 반환합니다.
 */
export async function saveMessage(chatRoomId: string, message: string, userId: number) {
    // 새로운 메시지를 생성합니다.
    const newMessage = await db.message.create({
        data: {
            chatRoomId,
            payload: message,
            userId,
            created_at: new Date().toISOString(),
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    // 생성된 메시지 객체를 반환합니다.
    return {
        id: newMessage.id,
        payload: newMessage.payload,
        created_at: newMessage.created_at.toISOString(), // Date 객체를 문자열로 변환
        userId: newMessage.userId,
        user: {
            username: newMessage.user.username,
            avatar: newMessage.user.avatar ?? null,
        },
        read: newMessage.read,
    };
}

/**
 * 사용자의 기존 채팅방을 찾거나, 새로운 채팅방을 생성합니다.
 *
 * @param {number} userId - 사용자 ID
 * @param {number} otherUserId - 상대방 사용자 ID
 * @returns {Promise<Object>} 채팅방 객체를 반환합니다.
 */
export async function findOrCreateChatRoom(userId: number, otherUserId: number, productId: number) {
    let chatRoom = await db.chatRoom.findFirst({
        where: {
            AND: [{users: {some: {id: userId}}}, {users: {some: {id: otherUserId}}}, {productId: productId}],
        },
    });

    if (!chatRoom) {
        chatRoom = await db.chatRoom.create({
            data: {
                users: {
                    connect: [{id: userId}, {id: otherUserId}],
                },
                productId: productId,
            },
        });
    }

    return chatRoom;
}

/**
 * 특정 제품의 정보를 가져옵니다.
 *
 * @param {string} productId - 제품 ID
 * @returns {Promise<Product>} 제품 객체를 반환합니다.
 */
export async function fetchProduct(productId: number) {
    const product = await db.product.findUnique({
        where: {id: productId},
        select: {
            id: true,
            title: true,
            photo: true,
            price: true,
            userId: true,
            sold: true,
        },
    });

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
}

/**
 * 특정 제품을 구매합니다.
 *
 * @param {number} productId - 제품 ID
 * @returns {Promise<Product>} 업데이트된 제품 객체를 반환합니다.
 */
export async function purchaseProduct(productId: number) {
    const session = await getSession();
    const userId = session?.id;

    if (!userId) {
        throw new Error("로그인된 사용자가 없습니다.");
    }

    const product = await db.product.update({
        where: {id: productId},
        data: {
            sold: true,
            buyerId: userId,
        },
        select: {
            id: true,
            title: true,
            price: true,
            photo: true,
            description: true,
            sold: true,
            buyerId: true,
            userId: true,
        },
    });

    if (!product) {
        throw new Error("제품을 찾을 수 없습니다.");
    }

    return product;
}
