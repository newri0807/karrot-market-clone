import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "login",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen flex-col justify-center items-center bg-[#161616] text-white">
            <div className="w-[360px] flex flex-col ">{children}</div>
        </main>
    );
}
