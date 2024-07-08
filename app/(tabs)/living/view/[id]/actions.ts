"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {revalidatePath, revalidateTag} from "next/cache";
import {unstable_cache as nextCache} from "next/cache";
import {revalidatePost} from "../../actions";

/**
 * 사용자에게 해당 게시물을 좋아요 표시하도록 하는 함수.
 * @param postId 게시물의 ID
 */
export async function likePost(postId: number) {
    const session = await getSession(); // 현재 사용자 세션 가져오기
    try {
        await db.like.create({
            data: {
                postId,
                userId: session.id!, // 사용자 ID 설정
            },
        });
        await revalidatePost();
        revalidateTag(`like-status-${postId}`); // 해당 태그를 가진 캐시 무효화
    } catch (e) {
        // 오류 무시
    }
}

/**
 * 사용자에게 해당 게시물의 좋아요 표시를 취소하도록 하는 함수.
 * @param postId 게시물의 ID
 */
export async function dislikePost(postId: number) {
    try {
        const session = await getSession(); // 현재 사용자 세션 가져오기
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId: session.id!, // 사용자 ID 설정
                },
            },
        });
        await revalidatePost();
        revalidateTag(`like-status-${postId}`); // 해당 태그를 가진 캐시 무효화
    } catch (e) {
        // 오류 무시
    }
}

/**
 * 게시물의 정보를 가져오고 조회수를 증가시키는 함수.
 * @param id 게시물의 ID
 * @returns 게시물 데이터 또는 null
 */
export async function getPost(id: number) {
    try {
        const post = await db.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1, // 조회수 증가
                },
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });

        return post; // 게시물 데이터 반환
    } catch (e) {
        return null; // 오류 시 null 반환
    }
}

/**
 * 캐시된 게시물 정보를 가져오는 함수.
 * @param id 게시물의 ID
 * @returns 캐시된 게시물 데이터 또는 null
 */
export const getCachedPost = nextCache(getPost, ["post-detail"], {
    tags: ["post-detail"], // 태그 지정
    revalidate: 60, // 60초마다 재검증
});

/**
 * 특정 사용자가 게시물을 좋아요 했는지 여부와 좋아요 수를 가져오는 함수.
 * @param postId 게시물의 ID
 * @param userId 사용자 ID
 * @returns 좋아요 수와 좋아요 여부
 */
export async function getLikeStatus(postId: number, userId: number) {
    if (!userId) return {likeCount: 0, isLiked: false}; // 사용자 ID가 없으면 기본 값 반환

    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });

    return {likeCount, isLiked: Boolean(isLiked)}; // 좋아요 수와 여부 반환
}

/**
 * 특정 게시물의 좋아요 상태를 캐싱하는 함수.
 * @param postId 게시물의 ID
 * @returns 캐시된 좋아요 상태 함수
 */
export async function createCachedLikeStatus(postId: number) {
    return nextCache((userId: number) => getLikeStatus(postId, userId), ["product-like-status"], {
        tags: [`like-status-${postId}`], // 태그 지정
    });
}
