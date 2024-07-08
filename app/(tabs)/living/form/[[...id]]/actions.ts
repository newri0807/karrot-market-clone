"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {postSchema} from "@/lib/validators";
import {permanentRedirect, redirect} from "next/navigation";
import {z} from "zod";
import {revalidatePostList} from "../../actions";
import {unstable_cache as nextCache, revalidatePath} from "next/cache";

type PostData = z.infer<typeof postSchema>;

export async function handleAdd(data: PostData) {
    try {
        const session = await getSession();
        if (session && session.id) {
            const newPost = await db.post.create({
                data: {
                    title: data.title,
                    description: data.description,
                    user: {connect: {id: session.id}},
                },
                select: {
                    id: true,
                },
            });

            if (newPost.id) {
                await revalidatePostList();
                await revalidatePostDetail(newPost.id);
                return {redirectUrl: `/living/view/${newPost.id}`};
            }
        } else {
            throw new Error("User session is not available");
        }
    } catch (error: any) {
        throw new Error("Error adding post: " + error.message);
    }
}

export async function handleEdit(postId: number, data: PostData) {
    try {
        const updatedPost = await db.post.update({
            where: {id: postId},
            data: {
                title: data.title,
                description: data.description,
            },
            select: {
                id: true,
            },
        });
        if (updatedPost.id) {
            await revalidatePostList();
            await revalidatePostDetail(updatedPost.id);
            return {redirectUrl: `/living/view/${updatedPost.id}`};
        }
    } catch (error: any) {
        throw new Error("Error editing post: " + error?.message);
    }
}

export async function handleDelete(postId: number) {
    try {
        const deletedPost = await db.post.delete({
            where: {id: postId},
        });
        // return deletedPost;

        await revalidatePostList(); // 캐시 무효화
    } catch (error: any) {
        throw new Error("Error deleting post: " + error?.message);
    }
}

export async function getPostById(id: number) {
    try {
        const post = await db.post.findUnique({
            where: {id},
            select: {
                id: true,
                title: true,
                description: true,
            },
        });

        if (!post) {
            throw new Error("Post not found");
        }
        await revalidatePostList(); // 캐시 무효화
        return post;
    } catch (error: any) {
        throw new Error("Error fetching post: " + error?.message);
    }
}

//export const getCachedPostById = (id: string) => nextCache(() => getPostById(Number(id)), [`post-detail-${id}`]);

// 캐시 무효화 함수
export async function revalidatePostDetail(id: number) {
    await revalidatePath(`/living/view/${id}`);
}
