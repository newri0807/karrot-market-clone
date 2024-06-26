import TabMenu from "@/components/ui/tabMenu";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market Proudcts",
        default: "Karrot Market",
    },
};

export default function TabLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
            <TabMenu />
        </div>
    );
}
