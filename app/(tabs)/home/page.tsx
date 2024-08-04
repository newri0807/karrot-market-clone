import React from "react";
import Link from "next/link";
import ProductList from "@/components/product-list";
import CustomButton from "@/components/ui/csbutton";
import {PlusIcon} from "@heroicons/react/24/outline";
import TabMenu from "@/components/ui/tabMenu";
import {getCachedProducts} from "./actions";

export const metadata = {
    title: "Home",
};

export const dynamic = "force-dynamic";

const INITIAL_LOAD = 5;

export default async function ProductPage() {
    const {products, totalCount} = await getCachedProducts(INITIAL_LOAD, 0);
    return (
        <>
            <ProductList initialProducts={products} initialTotalCount={totalCount} />
            <Link href="/products/add">
                <CustomButton
                    className="h-10 w-10 p-2 bg-[#ee761a] rounded-full absolute z-10 bottom-20 right-2 hover:opacity-90"
                    text={<PlusIcon />}
                />
            </Link>
        </>
    );
}
