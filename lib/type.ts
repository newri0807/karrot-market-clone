export interface Product {
    id: number;
    title: string;
    price: number;
    photo: string;
    description: string;
    created_at: string;
    updated_at: string;
    userId: number;
}
export interface User {
    id: number;
    email: string;
    username: string | null;
    avatar: string | null;
    phone: string | null;
}

export interface ProductWithUser extends Product {
    user: User;
}
