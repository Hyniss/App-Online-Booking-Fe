import { useState } from "react";

const InputByType = ({
    field,
    onChangeValue,
    error,
    errorStyle="",
    text = "",
    className = "w-full",
    inputClassName = "",
    type = "",
    placeHolder = "",
    editable = true,
    hide = false,
    required = false,
}) => {
    const [displayingText, setDisplayingText] = useState(text || "");

    return (
        <div className={className}>
            <label>
                {field} 
                {required && <span className='text-red-500 ml-1 font-bold text-xl'>*</span>} 
                </label>
            <div>
                <input
                    className={`!border-solid border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 ${inputClassName} ${
                        text === "" ? "" : ""
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
            {error && error.trim() !== "" && <p className={`text-danger-500 ${errorStyle}`}>{error}</p>}
        </div>
    );
};

export default InputByType;
