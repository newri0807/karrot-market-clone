"use server";

import db from "@/lib/db";
import {ProductWithUser} from "@/lib/type";

export async function getProductById(id: number): Promise<ProductWithUser | null> {
    const product = await db.product.findUnique({
        where: {id},
        include: {
            user: true, // User 정보를 포함하여 가져옴
        },
    });

    if (!product) {
        return null;
    }

    return {
        ...product,
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
    } as ProductWithUser;
}

export async function getProductTitleById(id: number): Promise<string | null> {
    const product = await db.product.findUnique({
        where: {id},
        select: {
            title: true,
        },
    });

    if (!product) {
        return null;
    }

    return product.title;
}
