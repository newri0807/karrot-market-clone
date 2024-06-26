"use client"; // -> for useForm

import {productSchema} from "@/lib/validators";
import React, {useState, useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import CustomButton from "@/components/ui/csbutton";
import {useRouter} from "next/navigation";
import {ProductWithUser} from "@/lib/type";
import {getProductById} from "../../view/[id]/actions";
import {deleteProductAction, updateProductAction} from "./actions";
import CustomInput from "@/components/ui/csinput";

type FormData = z.infer<typeof productSchema>;

const EditProductPage = ({params}: {params: {id: string}}) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: {errors},
    } = useForm<FormData>({
        resolver: zodResolver(productSchema),
    });
    const [preview, setPreview] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<ProductWithUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            const productData = await getProductById(Number(params.id));
            setProduct(productData);
            if (productData) {
                setValue("title", productData.title);
                setValue("description", productData.description);
                setValue("price", productData.price);
                setPreview(productData.photo);
            }
            setLoading(false);
        }

        fetchProduct();
    }, [params.id, setValue]);

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
        let photoData = null;
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                photoData = {
                    name: file.name,
                    data: (reader.result as string).split(",")[1], // Base64 데이터만 추출
                };
                const result = await updateProductAction({
                    ...data,
                    photo: photoData,
                    id: Number(params.id),
                    existingPhoto: product?.photo,
                });
                if (result?.errors) {
                    console.error(result.errors);
                    return;
                }
                router.push(`/products/${params.id}`);
            };
        } else {
            console.log("No photo file provided.----------");
            const result = await updateProductAction({
                ...data,
                id: Number(params.id),
                existingPhoto: product?.photo,
            });
            if (result?.errors) {
                console.error(result.errors);
                return;
            }
            router.push(`/products/${params.id}`);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProductAction(Number(params.id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <>
            <div className="my-2">
                <h1 className="text-xl font-bold">상품 수정</h1>
                <p className="text-sm">아래 폼을 작성하여 상품을 수정하세요!</p>
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
                            <div className="text-neutral-400 text-sm">
                                사진을 추가해주세요.
                                {errors.photo?.message}
                            </div>
                        </>
                    ) : null}
                </label>
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
                <CustomButton text="update product" />
            </form>
            <CustomButton text="delete product" className="bg-red-700 mt-3 hover:bg-red-800" onClick={handleDelete} />
        </>
    );
};

export default EditProductPage;
