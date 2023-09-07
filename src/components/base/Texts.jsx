import React from "react";
export const XText = ({
    className,
    children,
    ellipsis = { maxLine: 3, canShowMore: true },
}) => {
    const textRef = React.useRef();

    const [isOverflow, setIsOverflow] = React.useState(false);
    const [expanding, setExpanding] = React.useState(false);

    const checkOverflow = (textContainer) => {
        if (!textContainer) {
            return false;
        }
        return (
            textContainer.offsetHeight < textContainer.scrollHeight ||
            textContainer.offsetWidth < textContainer.scrollWidth
        );
    };

    React.useEffect(() => {
        if (checkOverflow(textRef.current)) {
            setIsOverflow(true);
            return;
        }

        setIsOverflow(false);
    }, []);

    return (
        <div className='relative'>
            <div
                ref={textRef}
                className={className}
                style={{
                    maxWidth: "100%",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: expanding ? 10000 : ellipsis?.maxLine || 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}>
                {children}
            </div>
            {(ellipsis?.canShowMore ?? true) && isOverflow && expanding && (
                <button
                    onClick={() => setExpanding(false)}
                    className='underline text-sm font-bold'>
                    Ẩn
                </button>
            )}
            {(ellipsis?.canShowMore ?? true) && isOverflow && !expanding && (
                <button
                    onClick={() => setExpanding(true)}
                    className='underline text-sm font-bold'>
                    Xem thêm
                </button>
            )}
        </div>
    );
};
