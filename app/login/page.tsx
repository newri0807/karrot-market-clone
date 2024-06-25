"use client"; // -> for useForm

import React from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import CustomInput from "@/components/ui/csinput";
import CustomButton from "@/components/ui/csbutton";
import {useForm} from "react-hook-form";
import {loginAction} from "./action";
import {loginSchema} from "@/lib/validators";
import {error} from "console";

type FormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
    });

    const [error, setError] = React.useState<string | null>(null);

    const onSubmit = async (data: FormData) => {
        const result = await loginAction(data);
        console.log(result);

        if (result?.error) {
            setError(result.error);
            return;
        }

        // 성공적인 경우, 리디렉션은 loginAction에서 처리됩니다.
    };

    return (
        <>
            <div className="my-2">
                <h1 className="text-xl font-bold">로그인</h1>
                <p className="text-sm">이메일과 비밀번호를 입력하세요!</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-3">
                <CustomInput type="email" name="email" placeholder="이메일" register={register} error={errors.email?.message} />
                <CustomInput type="password" name="password" placeholder="비밀번호" register={register} error={errors.password?.message} />
                {error && <p className="my-2 text-red-600 text-sm">{error}</p>}
                <CustomButton text="로그인" />
            </form>
        </>
    );
};

export default LoginPage;
