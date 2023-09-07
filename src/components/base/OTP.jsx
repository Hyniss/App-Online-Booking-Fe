import React, { useEffect, useState } from "react";

const OTP = ({
    otpError,
    setOtp,
    onConfirm,
    onResentOTP,
    timeToResend,
    setTimeToResend,
}) => {
    const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);

    const handleInputChange = (index, value) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);
        setOtp(newInputValues.join(""));
    };

    const getOtp = (inputs) => {
        return Array.from(inputs)
            .map((input) => input.value)
            .join("");
    };

    useEffect(() => {
        // Visit following link for more: https://bbbootstrap.com/snippets/tailwind-css-verify-otp-validation-using-inputs-83850794
        const inputs = Array.from(document.querySelectorAll("#otp > *[id]"));

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("keydown", function (event) {
                if (event.key === "Backspace") {
                    inputs[i].value = "";
                    if (i !== 0) inputs[i - 1].focus();
                    setOtp(getOtp(inputs));
                    return;
                }
                if (i === inputs.length - 1 && inputs[i].value !== "") {
                    inputs[i].value = event.key;
                    setOtp(getOtp(inputs));
                    return;
                }
                if (event.keyCode > 47 && event.keyCode < 58) {
                    inputs[i].value = event.key;
                    if (i !== inputs.length - 1) inputs[i + 1].focus();
                    event.preventDefault();
                    setOtp(getOtp(inputs));
                    return;
                }
                if (event.keyCode > 64 && event.keyCode < 91) {
                    if (event.ctrlKey && event.keyCode == 86) {
                        inputs[i].value = "";
                        setOtp(getOtp(inputs));
                        return;
                    }
                    inputs[i].value = "";
                    event.preventDefault();
                    setOtp(getOtp(inputs));
                }
                setOtp(getOtp(inputs));
            });
            inputs[i].addEventListener("paste", (e) => handlePasteOtp(e));
        }
    }, []);

    useEffect(() => {
        const token = setTimeout(updateTime, 1000);
        return () => clearTimeout(token);
    });

    const handlePasteOtp = (event) => {
        event.preventDefault();
        const pasteOtp = event.clipboardData.getData("Text").trim() ?? "";

        if (isNumber(pasteOtp) && pasteOtp.length === 6) {
            const inputs = Array.from(document.querySelectorAll("#otp > *[id]"));
            inputs.forEach((input, index) => (input.value = pasteOtp[index]));
            setOtp(getOtp(inputs));
            return;
        }
    };
    function isNumber(value) {
        return value != null && value !== "" && !isNaN(Number(value.toString()));
    }

    function updateTime() {
        if (timeToResend !== 0) {
            setTimeToResend((seconds) => seconds - 1);
        }
    }
    return (
        <div className='flex flex-col items-center'>
            <div className='flex items-center justify-center gap-2' id='otp'>
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='first'
                    maxLength={1}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                />
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='second'
                    maxLength={1}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                />
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='third'
                    maxLength={1}
                    onChange={(e) => handleInputChange(2, e.target.value)}
                />
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='fourth'
                    maxLength={1}
                    onChange={(e) => handleInputChange(3, e.target.value)}
                />
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='fifth'
                    maxLength={1}
                    onChange={(e) => handleInputChange(4, e.target.value)}
                />
                <input
                    className='p-0 w-8 h-8 form-control m-2 sm:h-12 sm:w-12 rounded-lg border border-gray-300 text-center focus:border-2 focus:border-primary-400 focus:outline-none focus:ring-0'
                    type='text'
                    pattern='^[0-9\b]+$'
                    id='sixth'
                    maxLength={1}
                    onChange={(e) => handleInputChange(5, e.target.value)}
                />
            </div>
            <p className='text-danger-500'>{otpError}</p>
            <button
                className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'
                onClick={() => onConfirm()}>
                Xác nhận
            </button>
            <div className='mt-3'>
                Chưa nhận được mã OTP?
                <button
                    onClick={() => {
                        onResentOTP();
                        setTimeToResend(30);
                    }}
                    className={`${
                        timeToResend === 0
                            ? "text-primary-500"
                            : "text-gray-500 cursor-not-allowed"
                    }`}>
                    &nbsp; Gửi lại mã
                </button>
                <label className='ml-2 font-bold'>
                    {timeToResend > 0 ? timeToResend : ""}
                </label>
            </div>
        </div>
    );
};

export default OTP;
