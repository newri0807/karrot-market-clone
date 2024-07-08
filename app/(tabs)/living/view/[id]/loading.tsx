import {EyeIcon} from "@heroicons/react/24/solid";
import {UserCircleIcon} from "@heroicons/react/24/outline";

export default function PostDetailSkeleton() {
    return (
        <div className="p-5 text-white animate-pulse">
            <div className="flex items-center gap-2 mb-2 *:text-left">
                <UserCircleIcon className="size-10" />
                <div>
                    <div className="h-4 bg-neutral-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-neutral-700 rounded w-16"></div>
                </div>
            </div>
            <div className="py-10">
                <div className="h-6 bg-neutral-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-700 rounded w-full"></div>
            </div>
            <div className="flex flex-col gap-5 items-start">
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <EyeIcon className="size-5" />
                    <div className="h-4 bg-neutral-700 rounded w-12"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
        </div>
    );
}
