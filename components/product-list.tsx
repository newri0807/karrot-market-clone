"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useState, useEffect} from "react";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {Product} from "@/lib/type";
import {getCachedProducts} from "@/app/(tabs)/home/actions";

const LOAD_MORE_COUNT = 1;

type ProductListProps = {
    initialProducts: Product[];
    initialTotalCount: number;
};

const ProductList: React.FC<ProductListProps> = ({initialProducts, initialTotalCount}) => {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
    const [skip, setSkip] = useState<number>(initialProducts.length);
    const [loading, setLoading] = useState<boolean>(false);

    async function loadMoreProducts() {
        setLoading(true);
        try {
            const {products: moreProducts} = await getCachedProducts(LOAD_MORE_COUNT, skip);
            const productsWithSold: Product[] = moreProducts.map((product: any) => ({
                ...product,
                sold: product.sold || false,
            }));
            setProducts((prevProducts) => [...prevProducts, ...productsWithSold]);
            setSkip((prevSkip) => prevSkip + LOAD_MORE_COUNT);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <>
            {products.map((product) => (
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

            {skip < totalCount && (
                <button
                    onClick={loadMoreProducts}
                    disabled={loading}
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
