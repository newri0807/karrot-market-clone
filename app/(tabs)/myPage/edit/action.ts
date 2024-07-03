"use server";

import db from "@/lib/db";
import sharp from "sharp";
import {userSchema} from "@/lib/validators";
import {storage} from "@/lib/firebase";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";

export async function updateUser(data: any) {
    const {username, email, phone, avatar, existingPhoto, userId} = data;

    try {
        let avatarUrl = existingPhoto;
        if (avatar) {
            // 이미지 데이터 디코딩
            const imageBuffer = Buffer.from(avatar.data, "base64");

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
            const storageRef = ref(storage, `avatars/${avatar.name}`);

            // 파일 업로드
            const snapshot = await uploadBytes(storageRef, finalImageBuffer);
            avatarUrl = await getDownloadURL(snapshot.ref);
        }

        // 유효성 검사
        const result = userSchema.safeParse({
            username,
            email,
            phone,
            avatar: avatarUrl ? avatarUrl : undefined,
        });

        if (result.success === false) {
            // Convert error to a plain object
            const errors = result.error.errors.map((err) => ({path: err.path, message: err.message}));

            console.log(result, "result----");
            return {success: false, errors};
        } else {
            // 업데이트 데이터 준비
            const updateData = {
                username: result.data.username,
                email: result.data.email,
                phone: result.data.phone,
                avatar: avatarUrl,
            };

            console.log(updateData, "updateData----");

            await db.user.update({
                where: {id: Number(userId)},
                data: updateData,
            });

            return {success: true};
        }
    } catch (error) {
        console.error(error);
        throw new Error("사용자 정보를 업데이트하는 중 오류가 발생했습니다.");
    }
}

export async function getUserById(userId: string) {
    try {
        const user = await db.user.findUnique({
            where: {
                id: Number(userId),
            },
        });

        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        return user;
    } catch (error) {
        console.error(error);
        throw new Error("사용자 정보를 가져오는 중 오류가 발생했습니다.");
    }
}
