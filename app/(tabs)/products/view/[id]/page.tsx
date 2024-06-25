import React, {useEffect, useState} from "react";
import {ProductWithUser} from "@/lib/type";
import getSession from "@/lib/session";
import Image from "next/image";
import {getProductById} from "./action";
import CustomButton from "@/components/ui/csbutton";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";

type ProductDetailPageProps = {
    params: {id: string};
};

async function ProductDetailPage({params}: ProductDetailPageProps) {
    const productData = await getProductById(Number(params.id));
    const sessionData = await getSession();

    if (!productData) {
        return <div>Product not found</div>;
    }

    return (
        <div className="flex flex-col space-y-3 text-left">
            <div className="relative w-full h-96 border-neutral-600 border rounded-md">
                <Image fill src={productData.photo} alt={productData.title} className="object-cover" />
            </div>
            {sessionData && productData.userId === sessionData.id && (
                <div className="mt-8 flex items-center">
                    {productData?.user?.avatar ? (
                        <Image src={productData.user.avatar} alt={productData.user.email} width={40} height={40} className="rounded-full" />
                    ) : (
                        <svg
                            fill="none"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            ></path>
                        </svg>
                    )}
                    <div className="ml-4">
                        <p className="text-lg font-semibold">{productData?.user?.email}</p>
                    </div>
                </div>
            )}
            <span className="text-lg">{productData.title}</span>
            <span className="text-sm text-neutral-500">{formatToTimeAgo(productData.created_at.toString())}</span>
            <span className="text-lg font-semibold">{formatToWon(productData.price)}</span>
            {sessionData && productData.userId === sessionData.id && <CustomButton text="edit" path={`/products/edit/${params.id}`} />}
        </div>
    );
}

export default ProductDetailPage;
