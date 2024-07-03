"use client";

import React from "react";
import Image from "next/image";
import CustomButton from "@/components/ui/csbutton";
import {useRouter} from "next/navigation";

interface Product {
    id: number;
    title: string;
    photo: string;
    sold?: boolean;
    reviews?: any[];
    userId: number;
    buyerId: number | null;
}

interface ProductListProps {
    products: Product[];
    type: "sold" | "purchased";
    userId: number;
}

const ProductList: React.FC<ProductListProps> = ({products, type, userId}) => {
    console.log(products);
    const router = useRouter();

    const handleReviewClick = (event: React.MouseEvent<HTMLButtonElement>, productId: number, targetUserId?: number) => {
        event.stopPropagation(); // 부모 이벤트 전파 막기

        if (targetUserId) {
            console.log(targetUserId, "-----");
            router.push(`/review/${productId}/${targetUserId}`);
        } else {
            router.push(`/review/${productId}/${userId}`);
        }
    };

    // 헷갈려..
    // product.buyerId === userId : 현재 구매자가 로그인 한거
    // 그 반대면 판매자가 로그인 한거

    const renderButton = (product: Product, userId: number) => {
        // Check if there are reviews and if there are reviews by other users
        const hasReviews = product.reviews && product.reviews.length > 0;
        const hasOtherUserReview = hasReviews && product.reviews && product.reviews.some((review) => review.userId !== userId);

        console.log(product, "product----", hasOtherUserReview);

        return (
            <>
                {hasReviews && hasOtherUserReview && (
                    <CustomButton text="상대방 리뷰" onClick={(event) => handleReviewClick(event, product.id, product.buyerId!)} className="mb-2" />
                )}
                {!product.reviews || product.reviews.length === 0 || product.reviews.every((review: any) => review.userId !== userId) ? (
                    <CustomButton text="리뷰 남기기" onClick={(event) => handleReviewClick(event, product.id)} />
                ) : (
                    <CustomButton
                        text="내 리뷰"
                        onClick={(event) => handleReviewClick(event, product.id)}
                        className="bg-neutral-600 hover:bg-neutral-700"
                    />
                )}
            </>
        );
    };

    return (
        <ul>
            {products.map((product) => (
                <li
                    key={product.id}
                    className="flex justify-between items-center border-b border-neutral-600 pb-2 last:border-b-0 cursor-pointer"
                    onClick={() => router.push(`/products/view/${product.id}`)}
                >
                    <div className="flex items-center justify-between my-2 w-full gap-4">
                        <div className="relative w-24 h-24 border-neutral-600 border rounded-md flex-shrink-0">
                            <Image fill src={product.photo} alt={product.title} className="object-cover rounded-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{product.title}</p>
                        </div>
                        <div className="w-20 flex-shrink-0">{renderButton(product, userId)}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
