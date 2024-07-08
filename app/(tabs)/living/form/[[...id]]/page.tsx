"use client";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useRouter} from "next/navigation";
import {postSchema} from "@/lib/validators";
import {getPostById, handleAdd, handleDelete, handleEdit} from "./actions";
import CustomInput from "@/components/ui/csinput";
import CustomButton from "@/components/ui/csbutton";
import {handleFailure, handleSuccess} from "@/lib/utils";

type PostFormProps = {
    params: {id: string};
};

type FormData = z.infer<typeof postSchema>;

const PostForm: React.FC<PostFormProps> = ({params}: {params: {id: string}}) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(postSchema),
    });
    const [buttonText, setButtonText] = useState<string>(params.id ? "Edit Post" : "Add Post");
    const [buttonText2, setButtonText2] = useState<string>("delete");

    useEffect(() => {
        async function fetchPost() {
            const postData = await getPostById(Number(params.id));

            if (postData) {
                setValue("title", postData.title);
                setValue("description", postData?.description || "");
            }
        }

        if (params.id) fetchPost();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: z.infer<typeof postSchema>) => {
        try {
            let result;
            if (params.id) {
                result = await handleEdit(Number(params.id), data);
            } else {
                result = await handleAdd(data);
            }
            if (result?.redirectUrl) {
                handleSuccess(setButtonText, reset, params.id ? "Edit Post" : "Add Post", "Success👌");
                router.push(result?.redirectUrl);
            }
        } catch (error: any) {
            console.error("Failed to submit the form:", error.message);
            handleFailure(setButtonText, params.id ? "Edit Post" : "Add Post", error);
        }
    };

    return (
        <div className="space-y-4 p-5">
            <div className="my-2">
                <h1 className="text-xl font-bold">포스팅 등록</h1>
                <p className="text-sm">아래 폼을 작성하여 글을 등록하세요!</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <CustomInput type="title" name="title" placeholder="제목" register={register} error={errors.title?.message as string} />
                </div>
                <div>
                    <textarea
                        className="textarea textarea-bordered textarea-md w-full text-black "
                        {...register("description", {required: "내용을 입력하세요"})}
                        placeholder="내용을 입력하세요"
                    ></textarea>
                </div>
                <CustomButton text={buttonText} />
            </form>
            {params.id && (
                <CustomButton
                    onClick={async () => {
                        await handleDelete(Number(params.id));
                        handleSuccess(setButtonText2, reset, "delete", "Success👌");
                        router.push("/living");
                    }}
                    text={buttonText2}
                    className="bg-red-700 mt-3 hover:bg-red-800"
                />
            )}
        </div>
    );
};

export default PostForm;
