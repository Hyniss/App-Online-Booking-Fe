import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import "../../css/style.css";
import { callRequest } from "../../utils/requests";
import OTP from "../base/OTP";
import Input from "../base/input";

const ResetPassword = () => {
    const navigation = useNavigate();

    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState();
    const [token, setToken] = useState();
    const [stage, setStage] = React.useState(1);
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
        3: <ResetSection token={token} />,
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigation("/");
        }
    }, []);

    return (
        <div className='pt-20 pb-12 min-h-[100vh] sm:pt-0 sm:pb-0 w-screen h-full sm:h-screen bg-gray-100 flex items-center justify-center'>
            <a
                className='absolute top-4 left-4 w-12 h-12 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center justify-center'
                href='/'>
                <HomeRoundedIcon />
            </a>
            <div className='w-full sm:w-3/4 max-w-[36rem] sm:m-auto m-4 p-4 sm:p-8 bg-white rounded-lg'>
                {stages[stage]}
            </div>
        </div>
    );
};

const SendOTP = ({ setStage, email, setEmail }) => {
    const [emailError, setEmailError] = useState("");

    const sendResetEmail = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({ emailOrPhone: email });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password/otp", requestOptions)
            .then((response) => {
                alert(response.message);
                const id = response.data;
                localStorage.setItem("key", response.data);
                setStage(2);
            })
            .catch((response) => {
                if (response.status === 400) {
                    const errors = response.data;
                    setEmailError(errors["emailOrPhone"]);
                    return;
                }
                alert(response.message);
            });
    };

    return (
        <div className='w-full h-content'>
            <p className='text-2xl font-bold mb-4'>Quên mật khẩu</p>
            <div className=''>
                <div className=''>
                    <Input
                        required
                        onChangeValue={setEmail}
                        error={emailError}
                        field='Email / Số điện thoại'
                        type='text'></Input>
                </div>
                <button
                    onClick={() => sendResetEmail()}
                    className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                    Gửi OTP xác nhận
                </button>
            </div>
        </div>
    );
};

const ConfirmOTP = ({ setStage, email, otp, setOtp, setToken }) => {
    const [otpError, setOtpError] = useState("");
    const [timeToResend, setTimeToResend] = useState(30);

    const resentOTP = () => {
        if (timeToResend > 0) {
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ emailOrPhone: email });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/reset-password/otp", requestOptions)
            .then((response) => {
                alert(response.message);
            })
            .catch((response) => alert(response.message));
    };

    const confirm = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            otp,
            key: localStorage.getItem("key"),
            id: localStorage.getItem("key").split("-")[0],
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/otp/verify", requestOptions)
            .then((response) => {
                const token = response.data;
                localStorage.setItem("reset-password-token", token);
                alert(response.message);
                setToken(token);
                setStage(3);
            })
            .catch((response) => alert(response?.data?.otp ?? response.message));
    };

    return (
        <div className='flex flex-col gap-2 items-center w-full'>
            <p className='mt-4 text-xl font-medium'>Nhập mã OTP gửi tới {email}</p>
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

const ResetSection = ({ token }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const navigateTo = useNavigate();

    const resetPassword = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
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
                localStorage.removeItem("reset-password-token");
                alert("Khôi phục mật khẩu thành công.");
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
                    required
                    onChangeValue={setPassword}
                    error={passwordError}
                    field='Mật khẩu'
                    type='password'></Input>
                <Input
                    required
                    onChangeValue={setConfirmPassword}
                    error={confirmPasswordError}
                    field='Mật khẩu xác nhận'
                    type='password'></Input>
            </div>
            <button
                onClick={() => resetPassword()}
                className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                Khôi phục
            </button>
        </div>
    );
};

export default ResetPassword;
