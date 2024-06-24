import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Join",
};

export default function JoinLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen flex-col justify-center items-center bg-black text-white">
            <div className="w-[360px] flex flex-col ">{children}</div>
        </main>
    );
}
