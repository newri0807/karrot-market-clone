import db from "./db";

export const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true,
        },
    });
    return !Boolean(user);
};

export const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return !Boolean(user);
};

export const checkUsername = (username: string) => !username.includes("potato");

export const checkPasswords = ({password, confirm_password}: {password: string; confirm_password: string}) => password === confirm_password;
