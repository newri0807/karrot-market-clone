import CustomButton from "@/components/ui/csbutton";
import db from "@/lib/db";
import getSession from "@/lib/session";
import {notFound, redirect} from "next/navigation";
import {Suspense} from "react";

async function getUser() {
    const session = await getSession();
    if (session.id) {
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

async function Username() {
    const user = await getUser();
    return <h1>Welcome! {user?.username}!</h1>;
}

export default async function MyPage() {
    const logOut = async () => {
        "use server";
        const session = await getSession();
        await session.destroy();

        redirect("/");
    };
    return (
        <div className="p-5 flex flex-col">
            <Suspense fallback={"Welcome!"}>
                <Username />
            </Suspense>
            <form action={logOut} className="my-3">
                <CustomButton text="Logout" />
            </form>
        </div>
    );
}
