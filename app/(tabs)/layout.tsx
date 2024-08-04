import TabMenu from "@/components/ui/tabMenu";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market Products",
        default: "Karrot Market",
    },
};

interface LayoutProps {
    children: React.ReactNode;
}

export default function TabLayout({children}: LayoutProps) {
    return (
        <div>
            {children}
            <TabMenu isModalOpen={false} />
        </div>
    );
}
