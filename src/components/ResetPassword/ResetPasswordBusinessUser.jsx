import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/style.css";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import Input from "../base/input";
import OTP from "../base/OTP";

const ResetPasswordBusiness = () => {
    const navigation = useNavigate();

    const [email, setEmail] = useState(localStorage.getItem("reset-password-email"));
    const [otp, setOtp] = useState("");
    const [token, setToken] = useState(localStorage.getItem("reset-password-token"));
    const [stage, setStage] = React.useState(strings.isNotBlank(token) ? 3 : 1);
    useEffectOnce(() => {
        // if (user) {
        //     navigateTo("/");
        // }
    });

    const stages = {
        1: <SendOTP setStage={setStage} email={email} setEmail={setEmail} />,
        2: (
            <ConfirmOTP
                setStage={setStage}
                email={email}
                otp={otp}
                setOtp={setOtp}
                setToken={setToken}
            />
        ),
        3: <ResetSection email={email} token={token} />,
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigation("/");
        }
    }, []);

    return (
        <div className='w-screen h-screen bg-gray-100 flex items-center justify-center'>
            <div className='w-1/3 justify-stretch m-auto bg-white rounded-lg p-8 flex gap-8 '>
                {stages[stage]}
            </div>
        </div>
    );
};

const SendOTP = ({ setStage, email, setEmail }) => {
    const [emailError, setEmailError] = useState("");

    const sendResetEmail = () => {
        var myHeaders = new Headers();
        myHeaders.append("X-LOCALE", "en");
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ email });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password/otp", requestOptions)
            .then((response) => {
                alert(response.message);
                localStorage.setItem("reset-password-email", email);
                setStage(2);
            })
            .catch((response) => {
                if (response.status === 400) {
                    const errors = response.data;
                    setEmailError(errors["email"]);
                    return;
                }
                alert(response.message);
            });
    };

    return (
        <div className='w-full h-content'>
            <p className='text-2xl font-bold mb-4'>Reset password</p>
            <div className=''>
                <div className=''>
                    <Input
                        onChangeValue={setEmail}
                        error={emailError}
                        field='Email'
                        type='text'></Input>
                </div>
                <button
                    onClick={() => sendResetEmail()}
                    className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                    Reset
                </button>
            </div>
        </div>
    );
};

const ConfirmOTP = ({ setStage, email, otp, setOtp, setToken }) => {
    const [otpError, setOtpError] = useState("");
    const [timeToResend, setTimeToResend] = useState(0);

    const resentOTP = () => {
        if (timeToResend > 0) {
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ email });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password/otp", requestOptions)
            .then((response) => {
                alert(response.message);
                setTimeToResend(30);
            })
            .catch((response) => alert(response.message));
    };

    const confirm = () => {
        var myHeaders = new Headers();
        myHeaders.append("X-LOCALE", "vi");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ email, otp });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password/verify", requestOptions)
            .then((response) => {
                const token = response.data.verificationToken;
                localStorage.setItem("reset-password-token", token);
                setToken(token);
                setStage(3);
            })
            .catch((response) => alert(response?.data?.otp ?? response.message));
    };

    return (
        <div className='flex flex-col gap-2 items-center w-full'>
            <p className='mt-4 text-xl font-medium'>Enter OTP sent to {email}</p>
            <div className='mobil'>
                <OTP
                    otpError={otpError}
                    onConfirm={() => confirm()}
                    onResentOTP={() => resentOTP()}
                    setOtp={(o) => setOtp(o)}
                    timeToResend={timeToResend}
                    setTimeToResend={(o) => setTimeToResend(o)}
                />
            </div>
        </div>
    );
};

const ResetSection = ({ email, token }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigateTo = useNavigate();

    const resetPassword = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            email,
            verificationToken: token,
            password,
            confirmPassword,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password", requestOptions)
            .then(() => {
                setPasswordError("");
                setConfirmPasswordError("");
                localStorage.removeItem("reset-password-email");
                localStorage.removeItem("reset-password-token");
                navigateTo("/login");
            })
            .catch((response) => {
                const errors = response.data;
                if (errors) {
                    setPasswordError(errors["password"]);
                    setConfirmPasswordError(errors["confirmPassword"]);
                    return;
                }
            });
    };
    return (
        <div className='w-full'>
            <div className=''>
                <Input
                    onChangeValue={setPassword}
                    error={passwordError}
                    field='Password'
                    type='password'></Input>
                <Input
                    onChangeValue={setConfirmPassword}
                    error={confirmPasswordError}
                    field='Confirm Password'
                    type='password'></Input>
            </div>
            <button
                onClick={() => resetPassword()}
                className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                Apply Now
            </button>
        </div>
    );
};

export default ResetPasswordBusiness;
