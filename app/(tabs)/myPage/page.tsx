import CustomButton from "@/components/ui/csbutton";
import db from "@/lib/db";
import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import {getUserPurchases, getUserSales} from "./actions";
import Image from "next/image";
import ProductList from "@/components/myPage/productList";
import {UserCircleIcon} from "@heroicons/react/24/outline";

async function getUser() {
    const session = await getSession();
    if (session?.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if (user) {
            return user;
        }
    }
    notFound();
}

async function UserInfo() {
    const user = await getUser();
    const avatarUrl = user.avatar ? `${user.avatar}?t=${Date.now()}` : null;

    return (
        <div className="flex justify-center items-center flex-col gap-3">
            {avatarUrl ? (
                <Image src={avatarUrl} alt={user?.username} width={140} height={140} className="rounded-full object-cover size-32 bg-white" />
            ) : (
                <UserCircleIcon className="size-32" />
            )}
            <h1>Welcome! {user?.username}!</h1>
        </div>
    );
}

export default async function MyPage() {
    const session = await getSession();
    const purchasedProducts = await getUserPurchases(session.id!);
    const soldProducts = await getUserSales(session.id!);

    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };

    return (
        <div className="p-5 flex flex-col justify-between min-h-screen">
            <div>
                <UserInfo />
                <div className="my-4">
                    <CustomButton text="Edit Profile" path={`/myPage/edit?id=${session.id!}`} />
                </div>
                <section className="my-4">
                    <h2 className="border-b border-neutral-600 mb-2 text-left">🥕 판매 상품</h2>
                    {soldProducts.length > 0 ? (
                        <ProductList products={soldProducts} type="sold" userId={session.id!} />
                    ) : (
                        <p className="h-7 text-neutral-500">판매한 상품이 없습니다.</p>
                    )}
                </section>
                <section className="my-4">
                    <h2 className="border-b border-neutral-600 mb-2 text-left">🥕 구매 상품</h2>
                    {purchasedProducts.length > 0 ? (
                        <ProductList products={purchasedProducts} type="purchased" userId={session.id!} />
                    ) : (
                        <p className="h-7 text-neutral-500">구매한 상품이 없습니다.</p>
                    )}
                </section>
            </div>
            <form action={logOut}>
                <CustomButton text="Log out" className="mb-[80px]" />
            </form>
        </div>
    );
}
