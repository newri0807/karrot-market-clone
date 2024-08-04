export default function Loading() {
    return (
        <div className="flex flex-col space-y-4 p-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-5 my-3 animate-pulse">
                    <div className="relative size-28 rounded-md overflow-hidden border-neutral-600 border bg-neutral-700"></div>
                    <div className="flex flex-col gap-1 justify-center text-left w-2/3">
                        <div className="h-6 bg-neutral-700 rounded"></div>
                        <div className="h-4 bg-neutral-700 rounded mt-2"></div>
                        <div className="h-6 bg-neutral-700 rounded mt-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
