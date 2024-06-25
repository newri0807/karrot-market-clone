import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market",
        default: "Karrot Market",
    },
    description: "Sell and buy all the things!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning={true}>
                <main className="flex min-h-screen flex-col justify-center items-center bg-black text-white">
                    <div className="w-[360px] text-center flex flex-col justify-between h-screen py-5 relative">{children}</div>
                </main>
            </body>
        </html>
    );
}
