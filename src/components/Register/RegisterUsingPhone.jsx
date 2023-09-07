import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { useWindowSize } from "../../context/BrowserContext";
import { callRequest } from "../../utils/requests";
import OTP from "../base/OTP";
import Input from "../base/input";
const RegisterUsingPhone = () => {
    const [user, ,] = useAuth();
    const navigation = useNavigate();

    if (user) {
        navigation("/");
    }
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const [otp, setOtp] = useState("");
    const [token, setToken] = useState("");
    const [stage, setStage] = useState(0);
    const [region, setRegion] = useState("84");

    const stages = {
        0: (
            <EnterPhoneStage
                setStage={setStage}
                phone={phone}
                region={region}
                setRegion={setRegion}
                setPhone={setPhone}
                phoneError={phoneError}
                setPhoneError={setPhoneError}
            />
        ),
        1: (
            <ConfirmOTPStage
                setStage={setStage}
                phone={phone}
                otp={otp}
                setOtp={setOtp}
                setToken={setToken}
            />
        ),
        2: <RegisterStage token={token} />,
    };

    const windowSize = useWindowSize();
    return (
        <div className='pt-20 pb-12 min-h-[100vh] sm:pt-0 sm:pb-0 w-screen h-full sm:h-screen bg-gray-100 flex items-center justify-center'>
            <a
                className='absolute top-4 left-4 w-12 h-12 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center justify-center'
                href='/'>
                <HomeRoundedIcon />
            </a>
            <div className='w-full sm:w-3/4 lg:w-fit max-w-[60rem] sm:m-auto m-4 p-4 sm:p-8 bg-white rounded-lg lg:grid lg:grid-cols-5 gap-8'>
                {windowSize.isLargerThan("lg") && (
                    <img
                        src='https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
                        className='object-cover rounded-lg h-full w-full col-span-2'
                    />
                )}
                <div className='col-span-3'>
                    <p className='text-3xl font-bold mb-4'>Đăng ký</p>
                    {stages[stage]}
                </div>
            </div>
        </div>
    );
};

const EnterPhoneStage = ({
    phone,
    region,
    setRegion,
    setPhone,
    setPhoneError,
    phoneError,
    setStage,
}) => {
    const sendOtp = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ region, phone }),
        };
        callRequest("user/register/phone/send-otp", requestOptions)
            .then((response) => {
                alert(response.message);
                localStorage.setItem("key", response.data);
                setStage(1);
            })
            .catch((error) => {
                if (error.status === 400) {
                    setPhoneError(error.data?.phone ?? error.message);
                }
            });
    };

    return (
        <div className=''>
            <Input
                required
                className='mt-3'
                onChangeValue={setPhone}
                error={phoneError}
                field='Số điện thoại'
                type='text'></Input>
            <button
                onClick={() => sendOtp()}
                className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                Gửi mã xác thực
            </button>
            <Link
                to='/register/email'
                className='w-full rounded-md bg-gray-200 hover:bg-gray-300 text-center py-4 mt-3 cursor-pointer block'>
                Đăng ký bằng email
            </Link>
            <p className='m-auto mt-3 text-center'>
                Bạn đã có tài khoản?&nbsp;
                <Link to='/login' className='text-primary-500'>
                    <span className='text-primary-500'>Đăng nhập ngay</span>
                </Link>
            </p>
        </div>
    );
};

const ConfirmOTPStage = ({ setStage, phone, otp, setOtp, setToken }) => {
    const [otpError, setOtpError] = useState("");
    const [timeToResend, setTimeToResend] = useState(0);

    const resendOTP = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ region: 84, phone }),
        };
        callRequest("user/register/phone/send-otp", requestOptions)
            .then((response) => {
                alert(response.message);
            })
            .catch((error) => alert(error.message));
    };

    const confirm = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                region: 84,
                phone,
                otp,
                key: localStorage.getItem("key"),
            }),
        };
        callRequest("user/otp/verify", requestOptions)
            .then((response) => {
                setToken(response.data);
                localStorage.removeItem("key");
                setStage(2);
            })
            .catch((error) => {
                alert(error?.data?.otp ?? error.message);
            });
    };

    return (
        <div className=''>
            <p className='mt-4 text-xl font-medium m-auto w-full text-center'>
                Nhập mã OTP gửi đến {phone}
            </p>
            <OTP
                otpError={otpError}
                onConfirm={() => confirm()}
                onResentOTP={() => resendOTP()}
                setOtp={(o) => setOtp(o)}
                timeToResend={timeToResend}
                setTimeToResend={(o) => setTimeToResend(o)}
            />
        </div>
    );
};

const RegisterStage = ({ token }) => {
    const navigation = useNavigate();

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const signUp = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                username,
                role: "CUSTOMER",
                password,
                confirmPassword,
            }),
        };
        callRequest("user/register/phone", requestOptions)
            .then((response) => {
                alert(response.message);
                navigation("/login");
            })
            .catch((error) => {
                const errors = error.data;
                if (errors) {
                    setUsernameError(errors["username"]);
                    setPasswordError(errors["password"]);
                    setConfirmPasswordError(errors["confirmPassword"]);
                }
            });
    };

    return (
        <div className='inpu'>
            <div className='mobil'>
                <Input
                    required
                    className='mt-3'
                    onChangeValue={setUsername}
                    error={usernameError}
                    field='Tên người dùng'
                    type='text'></Input>
                <Input
                    required
                    className='mt-3'
                    onChangeValue={setPassword}
                    error={passwordError}
                    field='Mật khẩu'
                    type='password'></Input>
                <Input
                    required
                    className='mt-3'
                    onChangeValue={setConfirmPassword}
                    error={confirmPasswordError}
                    field='Mật khẩu xác nhận'
                    type='password'></Input>
            </div>
            <button
                onClick={() => signUp()}
                className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                Đăng ký
            </button>
        </div>
    );
};

export default RegisterUsingPhone;
