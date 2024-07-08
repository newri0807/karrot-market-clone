"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {postSchema} from "@/lib/validators";
import {permanentRedirect, redirect} from "next/navigation";
import {z} from "zod";
import {unstable_cache as nextCache, revalidatePath} from "next/cache";

type PostData = z.infer<typeof postSchema>;

type Post = {
    id: number;
    title: string;
    description: string | null;
};

type PostResult = Post | {error: string};

export async function handleAdd(data: PostData) {
    const session = await getSession();
    if (!session || !session.id) {
        return {error: "User session is not available"};
    }

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
        await revalidatePostDetail(newPost.id);
        // return {redirectUrl: `/living/view/${newPost.id}`};
        return redirect(`/living/view/${newPost.id}`);
    } else {
        return {error: "Failed to create new post"};
    }
}

export async function handleEdit(postId: number, data: PostData) {
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
        await revalidatePostDetail(updatedPost.id);
        //return {redirectUrl: `/living/view/${updatedPost.id}`};
        return redirect(`/living/view/${updatedPost.id}`);
    } else {
        return {error: "Failed to update post"};
    }
}

export async function handleDelete(postId: number) {
    const deletedPost = await db.post.delete({
        where: {id: postId},
    });

    if (deletedPost) {
        console.log("deletedPost--------------", deletedPost);
        return redirect("/living");
    } else {
        return {error: "Failed to delete post"};
    }
}

export async function getPostById(id: number): Promise<PostResult> {
    const post = await db.post.findUnique({
        where: {id},
        select: {
            id: true,
            title: true,
            description: true,
        },
    });

    if (post) {
        return post;
    } else {
        return {error: "Post not found"};
    }
}

export async function revalidatePostDetail(id: number) {
    await revalidatePath(`/living/view/${id}`);
}
