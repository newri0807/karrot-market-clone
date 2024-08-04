"use client";

import React, {useState, useEffect} from "react";
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

// 초기 로드 시 가져올 제품 수
const INITIAL_LOAD = 2;
// 버튼 클릭 시 추가로 가져올 제품 수
const LOAD_MORE_COUNT = 1;

const ProductList: React.FC<ProductListProps> = ({products: initialProducts, type, userId}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts.slice(0, INITIAL_LOAD));
    const [totalCount, setTotalCount] = useState<number>(initialProducts.length);
    const [skip, setSkip] = useState<number>(INITIAL_LOAD);
    const [loading, setLoading] = useState<boolean>(false);
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

    const loadMoreProducts = async () => {
        setLoading(true);
        try {
            // 서버 액션을 사용해 추가 제품 데이터를 가져옴 (더 많은 제품이 필요한 경우 이 부분을 수정)
            const moreProducts = initialProducts.slice(skip, skip + LOAD_MORE_COUNT);

            // 이전 제품 데이터에 추가 제품 데이터를 병합하여 상태를 업데이트
            setProducts((prevProducts) => [...prevProducts, ...moreProducts]);

            // 로드된 제품 수를 업데이트
            setSkip((prevSkip) => prevSkip + LOAD_MORE_COUNT);
            setTotalCount(initialProducts.length);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const renderButton = (product: Product) => {
        const reviews = product.reviews ?? [];
        const hasReviews = reviews.length > 0;
        const hasOtherUserReview = hasReviews && reviews.some((review) => review.userId !== userId);

        if (!hasReviews && (!product.sold || (reviews.length > 0 && reviews.every((review) => review.userId === userId)))) {
            return null;
        }

        return (
            <>
                {hasReviews && hasOtherUserReview && (
                    <CustomButton text="상대방 리뷰" onClick={(event) => handleReviewClick(event, product.id, product.buyerId!)} className="mb-2" />
                )}
                {product.sold && (
                    <>
                        {!hasReviews || reviews.every((review) => review.userId !== userId) ? (
                            <CustomButton text="리뷰 남기기" onClick={(event) => handleReviewClick(event, product.id)} />
                        ) : (
                            <CustomButton
                                text="내 리뷰"
                                onClick={(event) => handleReviewClick(event, product.id)}
                                className="bg-neutral-600 hover:bg-neutral-700"
                            />
                        )}
                    </>
                )}
            </>
        );
    };

    console.log(products);
    return (
        <>
            <ul>
                {products.map((product) => {
                    const buttonElement = renderButton(product);
                    return (
                        <li
                            key={product.id}
                            className="flex justify-between items-center border-b border-neutral-600 pb-2 last:border-b-0 cursor-pointer"
                            onClick={() => router.push(`/products/view/${product.id}`)}
                        >
                            <div className="flex items-center justify-between my-2 w-full gap-4">
                                <div className="relative w-24 h-24 border-neutral-600 border rounded-md flex-shrink-0">
                                    <Image fill src={product.photo} alt={product.title} className="object-cover rounded-sm" />
                                </div>
                                <div className={`flex-1 min-w-0 ${buttonElement ? "" : "w-full"}`}>
                                    <p className="font-semibold truncate text-left">{product.title}</p>
                                </div>
                                {buttonElement && <div className="w-20 flex-shrink-0">{buttonElement}</div>}
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* "Load more" 버튼 */}
            {skip < totalCount && (
                <button
                    onClick={loadMoreProducts} // 버튼 클릭 시 추가 제품을 로드
                    disabled={loading} // 로딩 중일 때 버튼 비활성화
                    className={`h-10 w-[100px] text-center p-2 bg-neutral-600 rounded-sm ${loading ? "cursor-not-allowed" : "hover:opacity-95"}`}
                >
                    {loading ? (
                        <span className="text-neutral-300 text-sm">Loading...</span>
                    ) : (
                        <span className="text-neutral-300 text-sm">Load more</span>
                    )}
                </button>
            )}
        </>
    );
};

export default ProductList;
