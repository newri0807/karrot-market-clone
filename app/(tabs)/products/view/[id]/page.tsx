import React from "react";
import getSession from "@/lib/session";
import Image from "next/image";
import {getProductById, getProductTitleById} from "./actions";
import CustomButton from "@/components/ui/csbutton";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {Metadata} from "next";
import {UserCircleIcon} from "@heroicons/react/24/outline";

type ProductDetailPageProps = {
    params: {id: string};
};

export async function generateMetadata({params}: ProductDetailPageProps): Promise<Metadata> {
    const productTitle = await getProductTitleById(Number(params.id));

    return {
        title: productTitle,
    };
}

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
                        <UserCircleIcon className="size-10" />
                    )}
                    <div className="ml-4">
                        <p className="text-lg font-semibold">{productData?.user?.email}</p>
                    </div>
                </div>
            )}
            <span className="text-lg">{productData.title}</span>
            <span className="text-sm text-neutral-500">{formatToTimeAgo(productData.created_at.toString())}</span>

            <div className="w-[360px] fixed bottom-0 z-30 bg-[#232323]">
                <ul className="flex justify-between  items-center h-10 m-3 text-white">
                    <li>
                        <span className="text-white">{formatToWon(productData.price)}원</span>
                    </li>
                    <div className="flex gap-2">
                        {sessionData && productData.userId === sessionData.id && (
                            <li>
                                <CustomButton text="edit" path={`/products/edit/${params.id}`} className="bg-neutral-600 hover:bg-neutral-700" />
                            </li>
                        )}
                        <li>
                            <CustomButton text="채팅하기" />
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    );
}

export default ProductDetailPage;
