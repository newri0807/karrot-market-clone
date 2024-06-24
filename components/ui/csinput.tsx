import React from "react";
import {Input} from "@/components/ui/Input";

interface InputProps {
    name: string;
    type: string;
    placeholder?: string;
    className?: string;
    error?: string;
    register: any; // react-hook-form의 register 함수
}

const CustomInput: React.FC<InputProps> = ({name, type, placeholder, className, error, register}) => {
    return (
        <div>
            <Input type={type} name={name} placeholder={placeholder} className={className} {...register(name)} />
            {error && <p className="my-2 text-red-600 text-sm">{error}</p>}
        </div>
    );
};

export default CustomInput;
