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
    modal?: React.ReactNode; // modal을 명확히 undefined로 정의
}

export default function TabLayout({children, modal}: LayoutProps) {
    const isModalOpen = !!modal;
    return (
        <div>
            {children}
            {modal && modal} {/* modal을 렌더링 하는 부분 추가 */}
            <TabMenu isModalOpen={isModalOpen} />
        </div>
    );
}
