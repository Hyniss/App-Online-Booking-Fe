import React from "react";
import { useElementProp } from "../../CustomHooks/hooks";
import { Spinner } from "./Animations";
import { RefDecorator } from "./RefDecorator";

export const ApiButton = ({
    onClick = null,
    loading = false,
    children,
    className = "",
    disabled = false,
}) => {
    const [childRef, prop] = useElementProp();

    const [isLoadingg, setIsLoadingg] = React.useState(loading);
    const [width, setWidth] = React.useState(prop.width);
    const [height, setHeight] = React.useState(prop.height);

    React.useEffect(() => {
        setIsLoadingg(loading);
    }, [loading]);

    React.useEffect(() => {
        if (prop.width > 0) {
            setWidth(prop.width);
        }
        if (prop.height > 0) {
            setHeight(prop.height);
        }
    }, [prop.width, prop.height]);

    return isLoadingg ? (
        <div
            className={`btn__primary px-4 py-2 mt-4 flex items-center justify-center cursor-not-allowed ${className}`}>
            <div className='flex items-center justify-center' style={{ width, height }}>
                <Spinner className='w-4 h-4 text-white block' />
            </div>
        </div>
    ) : (
        <div
            disabled={disabled}
            onClick={() => !disabled && onClick && onClick()}
            className={`btn__primary px-4 py-2 mt-4 flex items-center justify-center ${className} ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}>
            <RefDecorator innerRef={childRef}>{children || ""}</RefDecorator>
        </div>
    );
};
