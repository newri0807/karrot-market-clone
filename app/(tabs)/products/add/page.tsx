"use client"; // -> for useForm

import {productSchema} from "@/lib/validators";
import React, {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {addProductAction} from "./actions";
import CustomInput from "@/components/ui/csinput";
import CustomButton from "@/components/ui/csbutton";
import {useRouter} from "next/navigation";
import {handleFailure, handleSuccess} from "@/lib/utils";

type FormData = z.infer<typeof productSchema>;

const AddProductpage = () => {
    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(productSchema),
    });
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [buttonText, setButtonText] = useState<string>("add product");

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = event.target;
        if (files && files.length > 0) {
            const file = files[0];
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };
    const onSubmit = async (data: FormData) => {
        setButtonText("Saving...");
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                const base64data = reader.result as string;
                const photoData = {
                    name: file.name,
                    data: base64data.split(",")[1], // Base64 데이터만 추출
                };
                const result = await addProductAction({...data, photo: photoData});

                if (result?.errors) {
                    console.error(result.errors);
                    handleFailure(setButtonText, "add product", result.errors);
                    return;
                }
                handleSuccess(setButtonText, reset, "add product", "Success👌");
            };
        } else {
            setError("photo", {
                type: "manual",
                message: "사진을 추가해주세요.",
            });
            setButtonText("add product");
            return;
        }
    };

    return (
        <div className="*:justify-center">
            <div className="my-2">
                <h1 className="text-xl font-bold">상품 등록</h1>
                <p className="text-sm">아래 폼을 작성하여 상품을 등록하세요!</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-3">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
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
                                className="w-20"
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
                {errors.photo?.message && <p className="my-2 text-red-600 text-sm">{errors.photo?.message}</p>}
                <Controller
                    control={control}
                    name="photo"
                    render={({field}) => (
                        <input
                            {...field}
                            onChange={(e) => {
                                field.onChange(e);
                                onImageChange(e);
                            }}
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            className="hidden"
                        />
                    )}
                />
                <CustomInput type="text" name="title" placeholder="상품명" register={register} error={errors.title?.message} />
                <CustomInput type="text" name="description" placeholder="상품설명" register={register} error={errors.description?.message} />
                <CustomInput type="number" name="price" placeholder="가격" register={register} error={errors.price?.message} />
                <CustomButton text={buttonText} />
            </form>
        </div>
    );
};

export default AddProductpage;
