"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {Product} from "@/lib/type";
import {getCachedProducts} from "@/app/(tabs)/home/actions";

// 초기 로드 시 가져올 제품 수
const INITIAL_LOAD = 5;

// 버튼 클릭 시 추가로 가져올 제품 수
const LOAD_MORE_COUNT = 1;

const ProductList = () => {
    // 제품 데이터를 저장할 상태
    const [products, setProducts] = useState<Product[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);

    // 현재 로드된 제품 수를 저장할 상태
    const [skip, setSkip] = useState<number>(0);

    // 로딩 상태를 저장할 상태
    const [loading, setLoading] = useState<boolean>(false);

    // 컴포넌트가 처음 마운트될 때 초기 제품을 로드하는 함수
    useEffect(() => {
        async function loadInitialProducts() {
            setLoading(true); // 로딩 상태를 true로 설정
            try {
                // 서버 액션을 사용해 초기 제품 데이터를 가져옴
                const {products: initialProducts, totalCount} = await getCachedProducts(INITIAL_LOAD, 0);
                console.log(initialProducts, totalCount, "initialProducts-----");

                // 'sold' 속성을 추가하여 제품 데이터를 변환
                const productsWithSold: Product[] = initialProducts.map((product: any) => ({
                    ...product,
                    sold: product.sold || false,
                }));

                // 제품 데이터를 상태에 저장
                setProducts(productsWithSold);
                setTotalCount(totalCount);

                // 로드된 제품 수를 업데이트
                setSkip(INITIAL_LOAD);
            } catch (error) {
                console.error(error);
            }
            setLoading(false); // 로딩 상태를 false로 설정
        }

        loadInitialProducts(); // 초기 제품 로드 함수 호출
    }, []);

    // "Load more" 버튼 클릭 시 추가 제품을 로드하는 함수
    async function loadMoreProducts() {
        setLoading(true); // 로딩 상태를 true로 설정
        try {
            // 서버 액션을 사용해 추가 제품 데이터를 가져옴
            const {products: moreProducts} = await getCachedProducts(LOAD_MORE_COUNT, skip);

            // 'sold' 속성을 추가하여 제품 데이터를 변환
            const productsWithSold: Product[] = moreProducts.map((product: any) => ({
                ...product,
                sold: product.sold || false,
            }));

            // 이전 제품 데이터에 추가 제품 데이터를 병합하여 상태를 업데이트
            setProducts((prevProducts) => [...prevProducts, ...productsWithSold]);

            // 로드된 제품 수를 업데이트
            setSkip((prevSkip) => prevSkip + LOAD_MORE_COUNT);
        } catch (error) {
            console.error(error);
        }
        setLoading(false); // 로딩 상태를 false로 설정
    }

    const renderSkeletons = () => {
        return Array.from({length: 5}).map((_, index) => (
            <div key={index} className="flex gap-5 my-3 animate-pulse">
                <div className="relative size-28  rounded-md overflow-hidden border-neutral-600 border bg-neutral-700"></div>
                <div className="flex flex-col gap-1 justify-center text-left w-2/3">
                    <div className="h-6 bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-neutral-700 rounded mt-2"></div>
                    <div className="h-6 bg-neutral-700 rounded mt-2"></div>
                </div>
            </div>
        ));
    };

    return (
        <>
            {loading && !products.length
                ? renderSkeletons()
                : products.map((product) => (
                      <Link key={product.id} href={`/products/view/${product.id}`} className="flex gap-5 my-3 hover:opacity-80">
                          <div className="relative size-28 rounded-md overflow-hidden border-neutral-600 border">
                              <Image fill src={product.photo} alt={product.title} className="object-cover" />
                          </div>
                          <div className="flex flex-col gap-1 justify-center text-left">
                              <span className="text-lg">{product.title}</span>
                              <span className="text-sm text-neutral-500">{formatToTimeAgo(product.created_at.toString())}</span>
                              <span className="text-lg font-semibold">{formatToWon(product.price)}</span>
                          </div>
                      </Link>
                  ))}

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
