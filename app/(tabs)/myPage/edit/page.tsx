"use client";

import React, {useState, useEffect} from "react";
import {useForm, SubmitHandler} from "react-hook-form";
import CustomInput from "@/components/ui/csinput";
import CustomButton from "@/components/ui/csbutton";
import {getUserById, updateUser} from "./action";
import {useRouter, useSearchParams} from "next/navigation";
import {User} from "@/lib/type";

interface FormValues {
    username: string;
    email: string;
    phone: string;
    avatar?: string;
}

export default function UpdateUserForm() {
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: {errors},
    } = useForm<FormValues>();
    const [preview, setPreview] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null); // 일반 오류 메시지 상태
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            const userData = await getUserById(id as string);

            if (userData) {
                setUserInfo({
                    ...userData,
                    email: userData.email || "",
                    phone: userData.phone || "",
                    avatar: userData.avatar || "",
                });
                setValue("username", userData.username || "");
                setValue("email", userData.email || "");
                setValue("phone", userData.phone || "");
                if (userData.avatar) {
                    setPreview(userData.avatar);
                }
            }
        }

        fetchData();
    }, [id, setValue, setError]);

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!id) {
            setGeneralError("사용자를 찾을 수 없습니다.");
            return;
        }

        try {
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = async () => {
                    const base64data = reader.result as string;
                    const avatarData = {
                        name: file.name,
                        data: base64data.split(",")[1], // Base64 데이터만 추출
                    };
                    await updateUser({...data, avatar: avatarData, userId: id});
                };
            } else {
                const result = await updateUser({...data, existingPhoto: userInfo?.avatar, userId: id});

                if (result?.errors) {
                    return result.errors.forEach((error: any) => {
                        setError(error.path[0], {type: "manual", message: error.message});
                    });
                }
            }

            router.push(`/myPage`);
        } catch (error) {
            setGeneralError("업데이트 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5">
            <div className="flex justify-center w-full">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 border-dashed cursor-pointer bg-center bg-cover rounded-full h-40 w-40 mx-center bg-white"
                    style={{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    {preview === "" ? (
                        <>
                            <svg
                                data-slot="icon"
                                fill="none"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-10"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                ></path>
                            </svg>
                            <div className="text-neutral-400 text-sm">사진을 추가해주세요.</div>
                        </>
                    ) : null}
                </label>
                <input id="photo" type="file" onChange={onImageChange} className="hidden" />
                {errors.avatar?.message && typeof errors.avatar.message === "string" && <p className="text-red-500">{errors.avatar.message}</p>}
            </div>
            <CustomInput type="text" name="username" placeholder="Username" register={register} error={errors.username?.message as string} />
            <CustomInput type="email" name="email" placeholder="Email" register={register} error={errors.email?.message as string} />
            <CustomInput type="tel" name="phone" placeholder="010-xxxx-xxxx" register={register} error={errors.phone?.message as string} />
            {generalError && <p className="text-red-500">{generalError}</p>} {/* 일반 오류 메시지 표시 */}
            <CustomButton text="Update" />
        </form>
    );
}
