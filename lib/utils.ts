import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatToTimeAgo(date: string): string {
    const dayInMs = 1000 * 60 * 60 * 24;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = Math.round((time - now) / dayInMs);

    const formatter = new Intl.RelativeTimeFormat("ko"); // -3 => 3일전

    return formatter.format(diff, "days");
}

export function formatToWon(price: number): string {
    return price.toLocaleString("ko-KR"); // 1000 -> 1,000
}


// form > submit button text -- 관리
export const resetButtonText = (setButtonText: React.Dispatch<React.SetStateAction<string>>, defaultText: string) => {
    setTimeout(() => {
        setButtonText(defaultText);
    }, 2000);
};

export const handleSuccess = (
    setButtonText: React.Dispatch<React.SetStateAction<string>>,
    reset: () => void,
    defaultText: string,
    message: string
) => {
    setButtonText(message);
    reset();
    resetButtonText(setButtonText, defaultText);
};

export const handleFailure = (setButtonText: React.Dispatch<React.SetStateAction<string>>, defaultText: string, error: any) => {
    console.error("Failed to update comment:", error);
    setButtonText("Fail😭");
    resetButtonText(setButtonText, defaultText);
};
