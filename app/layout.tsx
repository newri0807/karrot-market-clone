import type {Metadata} from "next";
import {Inconsolata, Do_Hyeon} from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market",
        default: "Karrot Market",
    },
    description: "Sell and buy all the things!",
};

const engFont = Inconsolata({subsets: ["latin"]});
const korFont = Do_Hyeon({subsets: ["latin"], weight: "400"});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={`${engFont.className} ${korFont.className}`}>
            <body suppressHydrationWarning={true}>
                <main className="flex min-h-screen flex-col justify-center items-center bg-[#161616] text-white">
                    <div className="w-[360px] text-center flex flex-col justify-between h-screen relative overflow-y-auto">{children}</div>
                </main>
            </body>
        </html>
    );
}
