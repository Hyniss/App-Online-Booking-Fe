import React from "react";

export const Photo = (props) => {
    const [imageType, setImageType] = React.useState("DEFAULT");
    const {
        src,
        className = "",
        errorSrc = null,
        innerRef,
        alt = "Không xác định",
        ...others
    } = props;

    React.useState(() => {
        setImageType("DEFAULT");
    }, [props.src]);

    if (src || imageType === "DEFAULT") {
        if (src) {
            return (
                <img
                    {...others}
                    ref={innerRef}
                    src={src}
                    alt=''
                    className={`border ${className}`}
                    onError={() => setImageType("ALTERNATIVE")}
                />
            );
        }
        setImageType("ALTERNATIVE");
    }
    if (imageType === "ALTERNATIVE" && errorSrc) {
        return (
            <img
                {...others}
                ref={innerRef}
                src={errorSrc}
                alt=''
                className={`border ${className}`}
                onError={() => setImageType("UNKNOWN")}
            />
        );
    }

    return (
        <div
            {...others}
            ref={innerRef}
            className={`${className} border bg-gray-200 flex items-center justify-center font-bold text-center`}>
            {alt}
        </div>
    );
};
