import Link from "next/link";
import React from "react";
import {formatToTimeAgo} from "@/lib/utils";
import {ChatBubbleBottomCenterIcon, HandThumbUpIcon} from "@heroicons/react/24/solid";
import {getPosts} from "./actions";

export const metadata = {
    title: "동네생활",
};

export default async function page() {
    const posts = await getPosts();
    return (
        <div className="p-5 flex flex-col *:text-left">
            {posts.length === 0 ? (
                <div className="flex flex-col justify-center item-center min-h-[85vh]">
                    <p className="text-neutral-400 text-center">등록된 포스트가 없습니다.</p>
                </div>
            ) : (
                posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/living/view/${post.id}`}
                        className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
                    >
                        <h2 className="text-white text-lg font-semibold">{post.title}</h2>
                        <p>{post.description}</p>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex gap-4 items-center">
                                <span>{formatToTimeAgo(post.created_at.toString())}</span>
                                <span>·</span>
                                <span>조회 {post.views}</span>
                            </div>
                            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                                <span className="flex items-center gap-1">
                                    <HandThumbUpIcon className="w-4 h-4" />
                                    {post._count.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <ChatBubbleBottomCenterIcon className="w-4 h-4" />
                                    {post._count.comments}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}
