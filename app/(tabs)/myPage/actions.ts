"use server";

import db from "@/lib/db";

export async function getUserPurchases(userId: number) {
    return await db.product.findMany({
        where: {buyerId: userId},
        include: {
            reviews: {
                where: {userId}, // 구매자가 리뷰를 작성했는지 확인
            },
        },
    });
}

export async function getUserSales(userId: number) {
    return await db.product.findMany({
        where: {userId},
        include: {
            reviews: {
                where: {userId}, // 판매자가 리뷰를 작성했는지 확인
            },
        },
    });
}

export async function markProductAsSold(productId: number) {
    await db.product.update({
        where: {id: productId},
        data: {sold: true},
    });
}

export async function leaveReview(productId: number, content: string, rating: number, userId: number) {
    await db.review.create({
        data: {
            productId,
            content,
            rating,
            userId,
        },
    });
}
