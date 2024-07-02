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
}

interface ProductListProps {
    products: Product[];
    type: "sold" | "purchased";
    userId: number;
}

const ProductList: React.FC<ProductListProps> = ({products, type, userId}) => {
    console.log(products);
    const router = useRouter();

    const handleReviewClick = (event: React.MouseEvent<HTMLButtonElement>, productId: number) => {
        event.stopPropagation(); // 부모 이벤트 전파 막기
        router.push(`/review/${productId}/${userId}`);
    };

    const renderButton = (product: Product) => {
        if (product.reviews && product.reviews.length === 0) {
            return <CustomButton text="리뷰 남기기" onClick={(event) => handleReviewClick(event, product.id)} />;
        } else {
            return <CustomButton text="내 리뷰" onClick={(event) => handleReviewClick(event, product.id)} />;
        }
    };

    return (
        <ul>
            {products.map((product) => (
                <li
                    key={product.id}
                    className="flex justify-around items-center border-b border-neutral-600 pb-2 last:border-b-0 cursor-pointer"
                    onClick={() => router.push(`/products/view/${product.id}`)}
                >
                    <div className="flex items-center gap-4 ">
                        <div className="relative w-24 h-24 border-neutral-600 border rounded-md">
                            <Image fill src={product.photo} alt={product.title} className="object-cover" />
                        </div>
                        <div className="flex gap-4 items-center">
                            <p className="font-semibold min-w-[100px]">{product.title}</p>
                            {renderButton(product)}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
