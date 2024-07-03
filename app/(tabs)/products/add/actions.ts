"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import {productSchema} from "@/lib/validators";
import {storage} from "@/lib/firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import sharp from "sharp";
import {redirect} from "next/navigation";
import {revalidateProductList} from "../../home/actions";

// Add product action
export async function addProductAction(data: any) {
    const {title, price, photo, description} = data;

    let photoUrl = "";

    if (photo) {
        // 이미지 데이터 디코딩
        const imageBuffer = Buffer.from(photo.data, "base64");

        // 이미지 크기 조정
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({width: 1024, height: 1024, fit: sharp.fit.inside, withoutEnlargement: true})
            .jpeg({quality: 80}) // JPEG 포맷으로 변환하여 압축률 조정
            .toBuffer();

        // 이미지 크기 확인
        let finalImageBuffer = resizedImageBuffer;
        if (resizedImageBuffer.length > 1 * 1024 * 1024) {
            // 이미지 크기가 1MB를 초과할 경우, 품질을 낮춰서 다시 압축
            finalImageBuffer = await sharp(resizedImageBuffer).jpeg({quality: 60}).toBuffer();
        }

        // Firebase Storage 경로 설정
        const storageRef = ref(storage, `products/${photo.name}`);

        // 파일 업로드
        const snapshot = await uploadBytes(storageRef, finalImageBuffer);
        photoUrl = await getDownloadURL(snapshot.ref);
    }

    // 유효성 검사
    const result = productSchema.safeParse({title, price, photo: photoUrl, description});
    if (!result.success) {
        return {errors: result.error.errors};
    }

    // 데이터베이스에 제품 추가
    const session = await getSession();
    if (session && session.id) {
        const product = await db.product.create({
            data: {
                title,
                description,
                price,
                photo: photoUrl,
                user: {
                    connect: {
                        id: session.id,
                    },
                },
            },
            select: {
                id: true,
            },
        });
        console.log("product----", product);

        await revalidateProductList(); // 캐시 무효화

        redirect(`/products/view/${product.id}`);
    } else {
        throw new Error("User session not found.");
    }
}
