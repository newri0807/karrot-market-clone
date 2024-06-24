import TabMenu from "@/components/ui/tabMenu";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "Proudcts",
};

export default function TabLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative">
            {children}
            <TabMenu />
        </div>
    );
}
