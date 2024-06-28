// store/userStore.ts
import create from "zustand";

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string | null;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    clearUser: () => set({user: null}),
}));
