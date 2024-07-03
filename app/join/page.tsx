"use client"; // -> for useForm

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signupSchema} from "@/lib/validators";
import CustomInput from "@/components/ui/csinput";
import CustomButton from "@/components/ui/csbutton";
import {z} from "zod";
import {signupAction} from "./actions";

type FormData = z.infer<typeof signupSchema>;

function SignupPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(signupSchema),
    });

    const [buttonText, setButtonText] = useState<string>("create account");

    const onSubmit = async (data: FormData) => {
        setButtonText("Saving...");
        const result = await signupAction(data);

        if (result?.error) {
            console.error(result?.errors);
            setButtonText("create account");
            return;
        }
        setButtonText("create account");

        // 성공적인 경우, 리디렉션은 signupAction에서 처리됩니다.
    };

    return (
        <>
            <div className="my-2">
                <h1 className="text-xl font-bold">안녕하세요!</h1>
                <p className="text-sm">아래 폼을 작성하여 가입하세요!</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-3">
                <CustomInput type="text" name="username" placeholder="이름" register={register} error={errors.username?.message} />
                <CustomInput type="email" name="email" placeholder="이메일" register={register} error={errors.email?.message} />
                <CustomInput type="password" name="password" placeholder="비밀번호" register={register} error={errors.password?.message} />
                <CustomInput
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    register={register}
                    error={errors.confirmPassword?.message}
                />
                <CustomButton text={buttonText} />
            </form>
        </>
    );
}

export default SignupPage;
