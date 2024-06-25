"use server";
import db from "@/lib/db";

export async function getProducts(take: number, skip: number) {
    const [products, totalCount] = await Promise.all([
        db.product.findMany({
            select: {
                title: true,
                price: true,
                created_at: true,
                photo: true,
                id: true,
                description: true,
                updated_at: true,
                userId: true,
            },
            take,
            skip,
            orderBy: {
                created_at: "desc",
            },
        }),
        db.product.count(),
    ]);

    const formattedProducts = products.map((product) => ({
        ...product,
        created_at: product.created_at.toISOString(),
        updated_at: product.updated_at.toISOString(),
    }));

    return {products: formattedProducts, totalCount};
}
