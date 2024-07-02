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

    const renderButton = (product: Product) => {
        return (
            <>
                {product.sold && product.buyerId !== userId ? (
                    <CustomButton text="상대방 리뷰" onClick={(event) => handleReviewClick(event, product.id, product.buyerId!)} className="mb-2" />
                ) : (
                    <CustomButton text="상대방 리뷰" onClick={(event) => handleReviewClick(event, product.id, product.userId)} className="mb-2" />
                )}
                {product.reviews && product.reviews.length === 0 ? (
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
                    className="flex justify-around items-center border-b border-neutral-600 pb-2 last:border-b-0 cursor-pointer"
                    onClick={() => router.push(`/products/view/${product.id}`)}
                >
                    <div className="flex items-center justify-around gap-4 ">
                        <div className="relative w-24 h-24 border-neutral-600 border rounded-md">
                            <Image fill src={product.photo} alt={product.title} className="object-cover" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <p className="font-semibold min-w-[100px]">{product.title}</p>
                        </div>
                        <div className="w-1/4">{renderButton(product)}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
