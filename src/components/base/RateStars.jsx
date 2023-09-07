import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
export const RateStars = ({ rate, className }) => {
    return (
        <div className={`flex ${className}`}>
            {[1, 2, 3, 4, 5].map((star, index) => {
                if (star <= Math.floor(rate)) {
                    return (
                        <StarOutlinedIcon
                            key={index}
                            className='block h-[1rem] text-orange-500 scale-75 -mr-1'
                        />
                    );
                }

                if (0 < star - rate && star - rate < 1) {
                    return (
                        <StarHalfOutlinedIcon
                            key={index}
                            className='block h-[1rem] text-orange-400 scale-75 -mr-1'
                        />
                    );
                }
                return (
                    <StarBorderOutlinedIcon
                        key={index}
                        className='block h-[1rem] text-orange-300 scale-75 -mr-1'
                    />
                );
            })}
        </div>
    );
};
