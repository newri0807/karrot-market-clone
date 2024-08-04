import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {getProductById, getProductTitleById} from "./actions";
import CustomButton from "@/components/ui/csbutton";
import {formatToTimeAgo, formatToWon} from "@/lib/utils";
import {Metadata} from "next";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import getSession from "@/lib/session";
import { IronSession } from 'iron-session';

const ChatButton = dynamic(() => import("@/components/chatOpen-Button"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

type ProductDetailPageProps = {
    params: {id: string};
};

type User = {
    id: number;
    email: string;
    avatar?: string | null;
};

type ProductData = {
    id: number;
    title: string;
    photo: string;
    price: number;
    created_at: string;
    userId: number;
    sold: boolean;
    user: User;
};

type SessionContent = {
    id?: number;
};

type SessionData = IronSession<SessionContent>;

export async function generateMetadata({params}: ProductDetailPageProps): Promise<Metadata> {
    const productTitle = await getProductTitleById(Number(params.id));
    return {
        title: productTitle,
    };
}


const UserInfo: React.FC<{user: User}> = ({user}) => (
    <div className="mt-8 flex items-center">
        {user?.avatar ? (
            <Image src={user.avatar} alt={user.email} width={40} height={40} className="rounded-full size-12" />
        ) : (
            <UserCircleIcon className="size-12" />
        )}
        <div className="ml-4">
            <p className="text-lg font-semibold">{user?.email}</p>
        </div>
    </div>
);

const ProductImage: React.FC<{src: string; alt: string}> = ({src, alt}) => (
    <div className="relative w-full h-96 border-neutral-600 border rounded-md">
        <Image fill src={src} alt={alt} className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
    </div>
);

type ProductActionsProps = {
    sessionData: SessionData;
    productData: ProductData;
    params: {id: string};
};

const ProductActions: React.FC<ProductActionsProps> = ({sessionData, productData, params}) => (
    <div className="w-[360px] fixed bottom-0 z-30 bg-[#232323]">
        <ul className="flex justify-between items-center h-10 m-3 text-white">
            <li>
                <span className="text-white">{formatToWon(productData.price)}원</span>
            </li>
            <div className="flex gap-2">
                {sessionData && productData.userId === sessionData.id ? (
                    <li>
                        <CustomButton text="edit" path={`/products/edit/${params.id}`} className="bg-neutral-600 hover:bg-neutral-700" />
                    </li>
                ) : (
                    <li>
                        {productData && productData.sold ? (
                            <CustomButton text="SOLD OUT" className="bg-neutral-700 cursor-not-allowed hover:bg-neutral-700" />
                        ) : (
                            <ChatButton text="채팅하기" otherUserId={productData.userId} produdctId={productData.id} />
                        )}
                    </li>
                )}
            </div>
        </ul>
    </div>
);

export default async function ProductDetailPage({params}: ProductDetailPageProps) {
    const productData = await getProductById(Number(params.id));
    const sessionData = await getSession();

    if (!productData) {
        return <div>Product not found</div>;
    }

    return (
        <div className="flex flex-col space-y-3 text-left">
            <ProductImage src={productData.photo} alt={productData.title} />
            <UserInfo user={productData.user} />
            <span className="text-lg">{productData.title}</span>
            <span className="text-sm text-neutral-500">{formatToTimeAgo(productData.created_at.toString())}</span>
            <ProductActions sessionData={sessionData} productData={productData} params={params} />
        </div>
    );
}
