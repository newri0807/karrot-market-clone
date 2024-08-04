import TabMenu from "@/components/ui/tabMenu";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: {
        template: "%s | Karrot Market Proudcts",
        default: "Karrot Market",
    },
};

export default function TabLayout({children, modal}: {children: React.ReactNode; modal?: React.ReactNode}) {
    const isModalOpen = !!modal;
    return (
        <div>
            {children}
            <TabMenu isModalOpen={isModalOpen} />
        </div>
    );
}
