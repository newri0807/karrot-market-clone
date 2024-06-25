import React from "react";
import Link from "next/link";
import ProductList from "@/components/product-list";

export const metadata = {
    title: "Home",
};

export const dynamic = "force-dynamic";

function ProductPage() {
    return (
        <>
            <ProductList />
            {/* 제품 추가 페이지로 이동하는 버튼 */}
            <Link href="/products/add">
                <button className="h-10 w-10 p-2 bg-[#ee761a] rounded-full absolute z-10 top-[83vh] right-2 hover:opacity-90">
                    <svg
                        data-slot="icon"
                        fill="none"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                    </svg>
                </button>
            </Link>
        </>
    );
}

export default ProductPage;
