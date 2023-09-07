import React from "react";
import ContentEditable from "react-contenteditable";
import { strings } from "../../utils/strings";

export const XContentEditable = ({ field = "", initValue = "", error = "", onChange = null, className = "", inputClassName = "", maxLength = 0, minLength = 0 }) => {
    const [value, setValue] = React.useState(initValue);
    return (
        <div className={className}>
            {field && <h5 className='font-bold font-xl mt-2 mb-2'>{field}</h5>}
            <ContentEditable
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                html={value}
                className={`!border-solid border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 focus:outline-1 focus:outline-blue-500 focus:border-blue-500 min-h-[8rem] break-all p-3 ${inputClassName}`}
            />
            <div className='flex mt-2'>
                {strings.isNotBlank(error) && <p className={`text-danger-500`}>{error}</p>}
                {maxLength > 0 && (
                    <h5 className='ml-auto'>
                        <span className={(value?.length ?? 0) > maxLength ? "text-danger-500" : ""}>{value?.length ?? 0}</span>
                        {` / ${maxLength} kí tự`}
                    </h5>
                )}
            </div>
        </div>
    );
};
