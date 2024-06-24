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
            return NextResponse.redirect(new URL("/products", request.url));
        }
    }
}

export const config = {
    // 고정 이름 config
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // 실행해야할 페이지나 실행하지 말아야할 페이지 추가 할수 있다
};
