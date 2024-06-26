"use server";

import {signupSchema} from "@/lib/validators";
import {hashPassword} from "@/lib/hash";
import {redirect} from "next/navigation";
import getSession from "@/lib/session";
import {checkUniqueEmail, checkUniqueUsername} from "@/lib/check";
import db from "@/lib/db";

export async function signupAction(data: any) {
    const {username, email, password, confirmPassword} = data;

    // 유효성 검사
    const result = signupSchema.safeParse({username, email, password, confirmPassword});
    if (!result.success) {
        return {errors: result.error.errors};
    }

    // 유니크 이메일 및 사용자명 체크
    const isEmailUnique = await checkUniqueEmail(email);
    if (!isEmailUnique) {
        return {error: "이미 사용 중인 이메일입니다."};
    }

    const isUsernameUnique = await checkUniqueUsername(username);
    if (!isUsernameUnique) {
        return {error: "이미 사용 중인 사용자명입니다."};
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    // 가입 성공 후 세션 생성
    const session = await getSession();
    session.id = user.id;
    await session.save();

    return redirect("/myPage"); // 가입 후 리디렉션
}
