"use server";

import db from "@/lib/db";

export async function createComment(payload: string, userId: number, postId: number) {
    const comment = await db.comment.create({
        data: {
            payload,
            userId,
            postId,
        },
        include: {
            user: true,
        },
    });

    return {
        id: comment.id,
        payload: comment.payload,
        userId: comment.userId,
        postId: comment.postId,
        user: {
            username: comment.user.username,
            avatar: comment.user.avatar || undefined,
        },
        created_at: comment.created_at.toISOString(),
    };
}

export async function getComments(postId: number) {
    const comments = await db.comment.findMany({
        where: {postId},
        include: {user: true},
    });

    return comments.map((comment) => ({
        ...comment,
        user: {
            username: comment.user.username,
            avatar: comment.user.avatar || undefined,
        },
        created_at: comment.created_at.toISOString(),
    }));
}


export async function updateComment(id: number, payload: string) {
    const updatedComment = await db.comment.update({
        where: {id},
        data: {payload},
        include: {user: true},
    });
    return {
        id: updatedComment.id,
        payload: updatedComment.payload,
        userId: updatedComment.userId,
        postId: updatedComment.postId,
        created_at: updatedComment.created_at.toISOString(),
        user: {
            username: updatedComment.user.username,
            avatar: updatedComment.user.avatar || undefined,
        },
    };
}

export async function deleteComment(id: number) {
    await db.comment.delete({
        where: { id },
    });
}
