import React from "react";
import Link from "next/link";
import ProductList from "@/components/product-list";
import CustomButton from "@/components/ui/csbutton";
import {PlusIcon} from "@heroicons/react/24/outline";

export const metadata = {
    title: "Home",
};

export const dynamic = "force-dynamic";

function ProductPage() {
    return (
        <>
            <ProductList />
            <Link href="/products/add">
                <CustomButton
                    className="h-10 w-10 p-2 bg-[#ee761a] rounded-full absolute z-10 top-[90vh] right-2 hover:opacity-90"
                    text={<PlusIcon />}
                />
            </Link>
        </>
    );
}

export default ProductPage;
