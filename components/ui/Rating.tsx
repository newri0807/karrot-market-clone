import React, {useState, useEffect} from "react";

type RatingProps = {
    value: number;
    onChange: (value: number) => void;
};

const Rating: React.FC<RatingProps> = ({value, onChange, ...args}) => {
    const [rating, setRating] = useState(value);

    useEffect(() => {
        setRating(value);
    }, [value]);

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        onChange(newRating);
    };

    return (
        <div className="rating gap-1" {...args}>
            {["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-green-400"].map((bgColor, index) => (
                <input
                    key={index}
                    type="radio"
                    name="rating-3"
                    className={`mask mask-heart ${bgColor}`}
                    value={index + 1}
                    checked={rating === index + 1}
                    onChange={() => handleRatingChange(index + 1)}
                />
            ))}
        </div>
    );
};

export default Rating;
