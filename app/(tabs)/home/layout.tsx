import TabMenu from "@/components/ui/tabMenu";

export default function HomeLayout({children, modal}: {children: React.ReactNode; modal: React.ReactNode}) {
    return (
        <>
            {children}
            <TabMenu />
            {modal}
        </>
    );
}
