"use server";

import {z} from "zod";
import db from "@/lib/db";
import bcrypt from "bcrypt"; // 비밀번호 확인을 위해 bcrypt 사용
import {redirect} from "next/navigation";
import getSession from "@/lib/session";
import {loginSchema} from "@/lib/validators";

export async function loginAction(data: any) {
    const {email, password} = data;

    // 유효성 검사
    const result = loginSchema.safeParse({email, password});
    if (!result.success) {
        return {errors: result.error.errors};
    }

    const user = await db.user.findUnique({
        where: {email},
    });

    if (!user) {
        return {error: "존재하지 않는 이메일입니다."};
    }

    if (!user.password) {
        return {error: "비밀번호가 설정되어 있지 않습니다."};
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return {error: "비밀번호가 일치하지 않습니다."};
    }

    // 로그인 성공 후 세션 생성
    const session = await getSession();
    session.id = user.id;
    await session.save();

    return redirect("/products"); // 로그인 후 리디렉션
}
