import TabMenu from "@/components/ui/tabMenu";

export default function HomeLayout({children, modal}: {children: React.ReactNode; modal: React.ReactNode}) {
    const isModalOpen = !!modal; // modal prop이 존재하면 modal이 열려있다고 판단

    return (
        <>
            {children}
            {modal}
            <TabMenu isModalOpen={isModalOpen} />
        </>
    );
}
