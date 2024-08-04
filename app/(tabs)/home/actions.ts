"use server";
import db from "@/lib/db";
import {unstable_cache as nextCache, revalidatePath} from "next/cache";

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
                sold: true,
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
// 캐싱을 적용하여 데이터를 가져오는 함수
export const getCachedProducts = nextCache(getProducts, ["product-list"], {
    revalidate: 60,
    tags: ["product-detail"],
});
// 제품이 업로드되거나 편집될 때 캐시를 무효화하는 함수
export async function revalidateProductList() {
    revalidatePath("/home"); // 해당 경로를 무효화하여 최신 데이터로 갱신
}
