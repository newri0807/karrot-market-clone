"use client";

import {createComment, getComments, updateComment, deleteComment} from "@/app/(tabs)/living/comment/actions";
import getSession from "@/lib/session";
import {useState, useEffect} from "react";
import {useOptimistic} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import CustomInput from "./ui/csinput";
import CustomButton from "./ui/csbutton";
import Image from "next/image";
import {PencilIcon, TrashIcon, UserCircleIcon} from "@heroicons/react/24/outline";
import {handleFailure, handleSuccess} from "@/lib/utils";

interface Comment {
    id: number;
    payload: string;
    userId: number;
    postId: number;
    user: {
        username: string;
        avatar?: string;
    };
    created_at: string;
}

interface UserClientProps {
    postId: number;
    userId: number;
}

interface CommentFormInput {
    payload: string;
}

export default function CommentList({postId, userId}: UserClientProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [optimisticComments, setOptimisticComments] = useOptimistic(comments);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm<CommentFormInput>();
    const [username, setUsername] = useState<string>("");
    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [buttonText, setButtonText] = useState<string>(editCommentId ? "Update" : "작성");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSessionAndComments = async () => {
            const fetchedComments = await getComments(postId);
            setComments(fetchedComments);
            setLoading(false);
        };

        fetchSessionAndComments();
    }, [postId]);

    const defaultText = editCommentId ? "Update" : "작성";

    const handleAddComment: SubmitHandler<CommentFormInput> = async ({payload}) => {
        if (!userId) return;

        setButtonText("Saving...");

        if (editCommentId) {
            // Handle editing
            try {
                const updatedComment = await updateComment(editCommentId, payload);
                setComments(comments.map((comment) => (comment.id === editCommentId ? {...comment, payload: updatedComment.payload} : comment)));
                setOptimisticComments(
                    optimisticComments.map((comment) => (comment.id === editCommentId ? {...comment, payload: updatedComment.payload} : comment))
                );
                setEditCommentId(null);
                handleSuccess(setButtonText, reset, defaultText, "Success👌", "comment");
            } catch (error) {
                handleFailure(setButtonText, defaultText, error);
            }
        } else {
            // Handle adding new comment
            try {
                const addedComment = await createComment(payload, userId, postId);
                const formattedComment: Comment = {
                    ...addedComment,
                };
                setOptimisticComments([...optimisticComments, formattedComment]);
                setComments([...comments, formattedComment]);
                handleSuccess(setButtonText, reset, defaultText, "Success👌", "comment");
            } catch (error) {
                handleFailure(setButtonText, defaultText, error);
            }
        }
    };

    const handleEditClick = (comment: Comment) => {
        setValue("payload", comment.payload);
        setEditCommentId(comment.id);
    };

    const handleDeleteClick = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter((comment) => comment.id !== commentId));
            setOptimisticComments(optimisticComments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const CommentListSkeleton = () => {
        return (
            <ul className="my-4 border-neutral-600 border-t border-b px-2">
                {[...Array(3)].map((_, index) => (
                    <li key={index} className="my-3 w-full text-left">
                        <div className="flex justify-between items-start flex-wrap">
                            <p className="flex-grow break-words w-full">
                                <span className="text-neutral-700 ">ㄴ</span>
                                <span className="bg-neutral-700 h-4 w-3/4 inline-block rounded"></span>
                            </p>
                            <div className="w-full flex items-center gap-1 justify-end text-neutral-700  text-sm my-1">
                                <span>by</span>
                                <UserCircleIcon className="size-8 bg-neutral-700 rounded-full" />
                                <span className="bg-neutral-700 h-4 w-20 inline-block rounded"></span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    if (loading) {
        return <CommentListSkeleton />;
    }

    return (
        <div>
            <ul className="my-4 border-neutral-600 border-t border-b px-2 ">
                {optimisticComments.map((comment) => (
                    <li key={comment.id} className="my-3 w-full text-left">
                        <div className="flex justify-between items-start flex-wrap">
                            <p className="flex-grow break-words w-full">
                                <span className="text-neutral-400">ㄴ</span> {comment.payload}
                            </p>
                            <div className="w-full flex items-center gap-1 justify-end text-neutral-400 text-sm my-1">
                                <span>by</span>
                                {comment?.user?.avatar ? (
                                    <Image
                                        src={comment?.user?.avatar}
                                        alt={comment?.user?.username}
                                        width={40}
                                        height={40}
                                        className="rounded-full size-8"
                                    />
                                ) : (
                                    <UserCircleIcon className="size-8" />
                                )}
                                <span>{comment.user.username}</span>
                                {userId === comment.userId && (
                                    <div className="flex gap-2 ml-2">
                                        <CustomButton
                                            onClick={() => handleEditClick(comment)}
                                            text={<PencilIcon className="w-5 h-5" />}
                                            className="p-2 bg-neutral-600 hover:bg-neutral-800"
                                        />
                                        <CustomButton
                                            onClick={() => handleDeleteClick(comment.id)}
                                            text={<TrashIcon className="w-5 h-5" />}
                                            className="p-2  bg-red-700 hover:bg-red-800"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit(handleAddComment)} className="flex gap-2 my-2 w-full">
                <CustomInput
                    type="text"
                    name="payload"
                    placeholder="코멘트"
                    register={register}
                    error={errors.payload?.message}
                    className="w-[250px]"
                />
                <CustomButton text={buttonText} className="w-[60px]" />
            </form>
        </div>
    );
}
