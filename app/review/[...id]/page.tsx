"use client";

import {useForm} from "react-hook-form";
import {addReview, updateReview, fetchReviewById} from "./actions";
import CustomButton from "@/components/ui/csbutton";
import {useEffect, useState} from "react";
import Rating from "@/components/ui/Rating";
import {handleFailure, handleSuccess} from "@/lib/utils";

type IdProps = {
    params: {id: string};
};

type FormValues = {
    id?: number;
    content: string;
    rating: number;
};

function Page({params}: IdProps) {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState: {errors},
    } = useForm<FormValues>({
        defaultValues: {
            rating: 1,
        },
    });
    const productId = Number(params.id[0]);
    const userId = Number(params.id[1]);
    const [buttonText, setButtonText] = useState<string>("저장");

    const onSubmit = async (data: FormValues) => {
        setButtonText("Loading...");
        try {
            if (data.id) {
                // 업데이트 로직
                await updateReview(data.id, data.content, Number(data.rating));
            } else {
                // 추가 로직
                await addReview(data.content, Number(data.rating), userId, productId);
            }
            handleSuccess(setButtonText, reset, "저장", "Success👌");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error:", error.message);
            } else {
                console.error("Unknown error:", error);
            }

            handleFailure(setButtonText, "저장", error);
        }
    };

    // 기존 리뷰 데이터 로드
    useEffect(() => {
        const loadReview = async () => {
            const review = await fetchReviewById(productId, userId);

            if (review) {
                setValue("id", review.id);
                setValue("content", review.content);
                setValue("rating", review.rating);
            }
        };
        if (productId && userId) {
            loadReview();
        }
    }, [productId, userId, setValue]);

    const rating = watch("rating", 1); // watch를 사용하여 상태 변경 추적 및 초기값 1 설정

    useEffect(() => {
        console.log(rating); // rating 값이 설정된 후 확인용 로그
    }, [rating]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-4 items-center space-y-3 mt-3 ">
            {/* edit 인지 add 인지 구분을 위해 id Input 추가 */}
            <input type="hidden" {...register("id")} />
            <div className="my-2">
                <h1 className="text-xl font-bold">리뷰 등록</h1>
                <p className="text-sm">아래 폼을 작성하여 리뷰를 등록하세요!</p>
            </div>
            <textarea
                className="textarea textarea-bordered textarea-md w-full text-black "
                {...register("content", {required: "내용을 입력하세요"})}
                placeholder="리뷰 내용을 입력하세요"
            ></textarea>
            {errors.content && <p>{errors.content.message as React.ReactNode}</p>}

            <Rating value={getValues("rating")} onChange={(value) => setValue("rating", value)} />
            {errors.rating && <p>{errors.rating.message as React.ReactNode}</p>}

            <CustomButton text={buttonText} />
        </form>
    );
}

export default Page;
