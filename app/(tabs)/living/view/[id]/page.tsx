import getSession from "@/lib/session";
import {formatToTimeAgo} from "@/lib/utils";
import {EyeIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import {notFound} from "next/navigation";
import LikeButton from "@/components/like-button";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import {createCachedLikeStatus, getCachedPost} from "./actions";
import CommentList from "@/components/comment-list";
import CustomButton from "@/components/ui/csbutton";
import {revalidatePath} from "next/cache";
import {handleDelete} from "../../form/[[...id]]/actions";

export default async function PostDetail({params}: {params: {id: string}}) {
    const id = Number(params.id);
    
    if (isNaN(id)) {
        return notFound();
    }

    const post = await getCachedPost(id);
    if (!post) {
        return notFound();
    }

    const session = await getSession();
    const userId = session.id!;

    const getCachedLikesStatus = await createCachedLikeStatus(id);
    const {likeCount, isLiked} = await getCachedLikesStatus(userId);

    return (
        <div className="p-5 text-white">
            <div className="flex items-center gap-2 mb-2 *:text-left">
                {post?.user?.avatar ? (
                    <Image width={28} height={28} className="size-10 rounded-full" src={post.user.avatar!} alt={post.user.username} />
                ) : (
                    <UserCircleIcon className="size-10" />
                )}
                <div>
                    <span className="text-sm font-semibold">{post.user.username}</span>
                    <div className="text-xs">
                        <span>{formatToTimeAgo(post.created_at.toString())}</span>
                    </div>
                </div>
            </div>
            <div className="py-10">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="mb-5">{post.description}</p>
            </div>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <span>조회 {post.views}</span>
                </div>
                <div className="flex items-center justify-between w-full gap-2 text-neutral-400 text-sm">
                    <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
                    {userId === post.userId && (
                        <div className="flex gap-2">
                            <CustomButton path={`/living/form/${id}`} text="edit" className="bg-neutral-600 hover:bg-neutral-800" />
                        </div>
                    )}
                </div>
            </div>
            <CommentList postId={id} userId={userId} />
        </div>
    );
}
