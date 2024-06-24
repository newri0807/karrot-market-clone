import CustomButton from "@/components/ui/csbutton";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="w-full h-[80vh] flex flex-col justify-center">
                <h1 className="text-8xl font-bold">🥕</h1>
                <p className="text-2xl py-2">당근</p>
                <p className="text-xl">당근 마켓에 어서오세요!</p>
            </div>
            <div className="w-full">
                <CustomButton text="시작하기" path="/join" />
                <p className="my-2">
                    이미 계정이 있나요?
                    <Link href="/login" className="ml-1 text-[#FF822D]">
                        로그인
                    </Link>
                </p>
            </div>
        </>
    );
}
