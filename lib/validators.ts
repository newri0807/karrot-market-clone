import {z} from "zod";
import {PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR} from "./constants";

export const signupSchema = z
    .object({
        username: z.string().min(1, "이름을 입력해주세요."),
        email: z.string().email("올바른 이메일 형식을 입력해주세요."),
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH, `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자리 이상이어야 합니다.`)
            .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export const productSchema = z.object({
    photo: z.string().optional(),
    title: z.string().min(1, "상품명을 입력해주세요."),
    description: z.string().min(1, "설명을 입력해주세요."),
    price: z.coerce.number().positive("가격은 0보다 커야 합니다."),
});
const phoneRegex = new RegExp(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/);

export const userSchema = z.object({
    username: z.string().min(1, "이름을 입력해주세요."),
    email: z.string().email("올바른 이메일 형식을 입력해주세요."),
    phone: z.string().regex(phoneRegex, "올바른 핸드폰 번호를 입력해주세요."),
    avatar: z.string().optional(),
});
