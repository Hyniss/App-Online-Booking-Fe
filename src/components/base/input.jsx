import React, { useState } from "react";
import { useElementProp, useLongPress } from "../../CustomHooks/hooks";
import { numbers } from "../../utils/numbers";
import { strings } from "../../utils/strings";

const Input = ({
    field,
    onChangeValue,
    error,
    errorStyle,
    text = "",
    className = "w-full",
    inputClassName = "",
    type = "text",
    placeHolder = "",
    editable = true,
    hide = false,
    required = false,
    upperCase = false,
}) => {
    const [displayingText, setDisplayingText] = useState(text || "");

    return (
        <div className={className}>
            {field && (
                <label>
                    {field}
                    {required && (
                        <span className='text-red-500 ml-1 font-bold text-xl'>*</span>
                    )}
                </label>
            )}
            <div>
                <input
                    className={`!border-solid border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 ${upperCase ? "text-transform: uppercase" : ""} ${inputClassName} ${
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
                    disabled={hide}
                />
            </div>
            {error && error.trim() !== "" && (
                <p className={`text-danger-500 ${errorStyle}`}>{error}</p>
            )}
        </div>
    );
};

export const NumberInput = ({
    min = null,
    max = null,
    onChangeValue = null,
    text = "",
    className = "w-full",
    placeHolder = "",
    editable = true,
}) => {
    const [displayingText, setDisplayingText] = useState(text || "");
    return (
        <input
            className={`!border-solid hover:outline border hover:border-2 hover:border-primary-400 focus:border-2 hover:outline-primary-300 focus:outline-primary-300 focus:outline focus:outline-[3px] focus:border-primary-400 rounded-md border-gray-300 h-full ${className}`}
            onChange={(e) => {
                if (!editable) {
                    return;
                }

                const input = e.target.value;

                if (
                    input.trim() !== "" &&
                    input.trim() !== "-" &&
                    !strings.isNumeric(input)
                ) {
                    return;
                }

                const value = input === "-" ? -0.01 : Number(input);
                if (min && value < min) {
                    return;
                }
                if (max && value > max) {
                    return;
                }

                setDisplayingText(input.trim());

                if (editable && onChangeValue) {
                    onChangeValue(input.trim());
                }
            }}
            placeholder={placeHolder}
            value={displayingText}
            suppressContentEditableWarning={true}
            readOnly={!editable}
        />
    );
};

export const NumberInputWithSteps = ({
    min = Number.MIN_VALUE * 10,
    max = Number.MAX_VALUE / 10,
    onChangeValue = null,
    text = "",
    className = "w-full",
    inputClassName = "w-full",
    placeHolder = "",
    step = 1,
    editable = true,
}) => {
    const [displayNumber, setDisplayNumber] = useState(
        strings.isNumeric(text) ? numbers.clamp(Number(text), min, max) : 0
    );

    React.useEffect(() => {
        setDisplayNumber(text);
    }, [text]);

    const [ref, prop] = useElementProp();
    const decrease = () => {
        const newValue = displayNumber - step;
        if (newValue < min) {
            return;
        }
        setDisplayNumber(newValue);
        onChangeValue && onChangeValue(newValue);
    };

    const increase = () => {
        const newValue = displayNumber + step;
        if (newValue > max) {
            return;
        }
        setDisplayNumber(newValue);
        onChangeValue && onChangeValue(newValue);
    };

    const onPressDecrease = useLongPress(decrease, 160);
    const onPressIncrease = useLongPress(increase, 160);

    return (
        <div className={`flex ${className}`}>
            <button
                {...onPressDecrease}
                onClick={() => decrease()}
                style={{ minWidth: prop.height }}
                className='rounded-l-md border bg-gray-100 border-gray-300 hover:bg-gray-200'
                ref={ref}>
                -
            </button>
            <input
                className={`!border-solid !border-y border-x-0 rounded-none !border-gray-300 h-full focus:outline-none border-transparent focus:border-transparent focus:ring-0 w-full text-center ${inputClassName}`}
                onChange={(e) => {
                    if (!editable) {
                        return;
                    }
                    const input = e.target.value;
                    if (
                        input.trim() !== "" &&
                        input.trim() !== "-" &&
                        !strings.isNumeric(input)
                    ) {
                        return;
                    }
                    const value = input === "-" ? -0.01 : Number(input);
                    if (min && value < min) {
                        return;
                    }
                    if (max && value > max) {
                        return;
                    }
                    setDisplayNumber(value);
                    if (editable && onChangeValue) {
                        onChangeValue(value);
                    }
                }}
                placeholder={placeHolder}
                value={displayNumber}
                suppressContentEditableWarning={true}
                readOnly={!editable}
            />
            <button
                {...onPressIncrease}
                onClick={() => increase()}
                style={{ minWidth: prop.height }}
                className='rounded-r-md border bg-gray-100 border-gray-300 hover:bg-gray-200'>
                +
            </button>
        </div>
    );
};

export const UnitInput = ({
    label = "Unit",
    value = "",
    min = Number.MIN_VALUE,
    max = Number.MAX_VALUE,
    onChangeValue = null,
}) => {
    const [displayNumber, setDisplayInput] = React.useState(
        numberOfText(value, min, max) || 0
    );

    const [editing, setEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(displayNumber);
    const inputRef = React.useRef();

    return (
        <div className='rounded-md border border-gray-300 inline-grid grid-cols-[max-content_1fr] !outline-none justify-center'>
            {!editing && (
                <div
                    onClick={() => {
                        Promise.resolve()
                            .then(() => setEditing(true))
                            .then(() => {
                                inputRef.current && inputRef.current.focus();
                            });
                    }}
                    onFocus={() => {
                        Promise.resolve()
                            .then(() => setEditing(true))
                            .then(() => {
                                inputRef.current && inputRef.current.focus();
                            });
                    }}
                    className='rounded-l-md border border-gray-300 focus:outline-none border-transparent focus:border-transparent focus:ring-0 w-32 h-full py-1 text-left px-3 cursor-text m-0 flex items-center overflow-hidden bg-white'>
                    {displayNumber?.toLocaleString() ?? 0}
                </div>
            )}
            {editing && (
                <input
                    ref={inputRef}
                    autoFocus={true}
                    onBlur={() => {
                        setEditing(false);
                        setDisplayInput(value);
                    }}
                    value={displayNumber}
                    onChange={(e) => {
                        if (e.target.value.trim() === "") {
                            setDisplayInput("");
                            return;
                        }
                        const inputValue =
                            numberOfText(e.target.value, min, max) || displayNumber;
                        setDisplayInput(inputValue);
                        setInputValue(inputValue);
                        if (onChangeValue) {
                            onChangeValue(inputValue);
                        }
                    }}
                    type='text'
                    className='rounded-l-md border border-gray-300 focus:outline-none border-transparent focus:border-transparent focus:ring-0 w-32 h-fit px-3 py-1 block m-0 bg-white'
                />
            )}

            <label className='border-l border-gray-300 text-center justify-center items-center flex pointer-events-none select-none h-full w-fit px-2 bg-white rounded-r-md'>
                {label}
            </label>
        </div>
    );
};

const numberOfText = (input, min, max) => {
    if (typeof input === "Number") {
        return input;
    }
    if (
        strings.trim(input) !== "" &&
        strings.trim(input) !== "-" &&
        !strings.isNumeric(input)
    ) {
        return 0;
    }
    const value = input === "-" ? -0.01 : Number(input);
    return numbers.clamp(value, min, max);
};

export default Input;
