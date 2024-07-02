"use server";

import db from "@/lib/db";
import {redirect} from "next/navigation";

export async function addReview(content: string, rating: number, userId: number, productId: number) {
    if (!content || rating < 1 || !userId || !productId) {
        throw new Error("유효하지 않은 입력입니다.");
    }
    await db.review.create({
        data: {
            content,
            rating,
            user: {connect: {id: userId}}, // 관계 연결
            product: {connect: {id: productId}}, // 관계 연결
        },
    });
    redirect("/myPage");
}

// 리뷰 업데이트 함수
export async function updateReview(id: number, content: string, rating: number) {
    if (!content || rating < 1 || !id) {
        throw new Error("유효하지 않은 입력입니다.");
    }
    console.log("id", id, content, rating);
    const updatedReview = await db.review.update({
        where: {id},
        data: {
            content,
            rating,
        },
    });

    console.log("Updated review:", updatedReview);

    redirect("/myPage");
}

export async function fetchReviewById(productId: number, userId: number) {
    const review = await db.review.findFirst({
        where: {
            productId,
            userId,
        },
    });
    return review;
}
