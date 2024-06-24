"use server";

import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

interface SessionContent {
    id?: number; // 로그아웃할 경우 사용자 id 없을수도 있으니 ? 붙임
}

const sessionOptions = {
    cookieName: "delicious-karrot", // 네임명 너 마음대로 설정 가능
    password: process.env.COOKIE_PASSWORD!, // env 파일에 설정해야함 (https://1password.com/password-generator/ 참조)
};

export default async function getSession() {
    return getIronSession<SessionContent>(cookies(), sessionOptions);
}
