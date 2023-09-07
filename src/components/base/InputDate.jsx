import { useState } from "react";

const Input = ({
    field,
    onChangeValue,
    error,
    text = "",
    className = "w-full",
    inputClassName = "",
    type = "",
    placeHolder = "",
    editable = true,
    hide = false,
}) => {
    const [displayingText, setDisplayingText] = useState(text || "");

    return (
        <div className={className}>
            <label>{field}</label>
            <div>
                <input
                    className={`rouned-lg border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 ${inputClassName} ${
                        text === "" ? "" : " mt-2"
                    }`}
                    onChange={(e) => {
                        setDisplayingText(e.target.value);
                        if (editable && onChangeValue) {
                            onChangeValue(e.target.value);
                        }
                    }}
                    placeholder={placeHolder}
                    type={type}
                    value={displayingText}
                    suppressContentEditableWarning={true}
                    readOnly={!editable}
                    disabled ={hide}
                />
            </div>
            {error && error.trim() !== "" && <p className='text-danger-500'>{error}</p>}
        </div>
    );
};

export default Input;
