"use server";
import db from "@/lib/db";
import {unstable_cache as nextCache, revalidatePath} from "next/cache";

export async function getPosts() {
    const posts = await db.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            views: true,
            created_at: true,
            _count: {
                select: {
                    comments: true,
                    likes: true,
                },
            },
        },
    });

    return posts;
}


export async function revalidatePost() {
    await revalidatePath("/living");
}
