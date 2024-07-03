import {NextRequest, NextResponse} from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/join": true,
};

export async function middleware(request: NextRequest) {
    // 고정 이름 middleware
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    console.log(exists);
    if (!session.id) {
        // 현재 로그인 상태x
        if (!exists) {
            // 현재 url 확인
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        // 현재 로그인 상태
        if (exists) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
    }

    // 제품 보기 페이지에서 뒤로 가기 버튼 클릭 시 루트 페이지로 리디렉션
    // const url = request.nextUrl.clone();
    // const referrer = request.headers.get("referer");

    // if (url.pathname.startsWith("/products/view")) {
    //     console.log("referrer---", referrer);
    //     // referrer가 존재하고 현재 페이지가 referrer와 동일하면 루트 페이지로 리디렉션
    //     if (referrer && referrer.endsWith(url.pathname)) {
    //         return NextResponse.redirect(new URL("/", request.url));
    //     }
    // }
    // // 위 조건에 해당하지 않으면 다음 미들웨어 또는 페이지로 이동합니다.
    // return NextResponse.next();
}

export const config = {
    // 고정 이름 config
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // 실행해야할 페이지나 실행하지 말아야할 페이지 추가 할수 있다
};
