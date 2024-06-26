import {getProductById} from "@/app/(tabs)/products/view/[id]/actions";
import CloseButton from "@/components/close-button";
import {PhotoIcon} from "@heroicons/react/16/solid";
import Image from "next/image";
import {notFound} from "next/navigation";

export default async function Modal({params}: {params: {id: string}}) {
    const id = Number(params.id);
    if (isNaN(id)) return notFound();

    const product = await getProductById(id);
    return (
        <div className="absolute w-full h-full z-50 flex items-center justify-center bg-black bg-opacity-60 left-0 top-0">
            <CloseButton />
            <div className="h-1/2 flex justify-center">
                <>
                    {product && product.photo ? (
                        <Image src={product.photo} alt="Product Photo" width={500} height={500} className="object-cover" />
                    ) : (
                        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
                            <PhotoIcon className="h-28" />
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}
