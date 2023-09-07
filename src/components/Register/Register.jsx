import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { useWindowSize } from "../../context/BrowserContext";
import { callRequest } from "../../utils/requests";
import Input from "../base/input";

const Register = () => {
    const [user, ,] = useAuth();
    const navigation = useNavigate();

    if (user) {
        navigation("/");
    }

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const register = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-FROM", process.env.REACT_APP_FE_PATH);

        var raw = JSON.stringify({
            email,
            username,
            password,
            confirmPassword,
            role: "CUSTOMER",
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/register/email", requestOptions)
            .then((response) => {
                alert(response.message);
                navigation("/login");
            })
            .catch((response) => {
                if (response.status === 400) {
                    const errors = response.data;
                    setEmailError(errors["email"]);
                    setUsernameError(errors["username"]);
                    setPasswordError(errors["password"]);
                    setConfirmPasswordError(errors["confirmPassword"]);
                    return;
                }
                alert(response.message);
            });
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
                    <div className=''>
                        <div className=''>
                            <Input
                                required
                                className='mt-3'
                                onChangeValue={setEmail}
                                error={emailError}
                                field='Email'
                                type='text'></Input>
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
                            onClick={() => register()}
                            className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                            Đăng ký
                        </button>
                    </div>
                    <Link
                        to='/register'
                        className='w-full rounded-md bg-gray-200 hover:bg-gray-300 text-center py-4 mt-3 block'>
                        Đăng ký bằng điện thoại
                    </Link>
                    <p className='m-auto mt-3 text-center'>
                        Bạn đã có tài khoản?&nbsp;
                        <Link to='/login' className='text-primary-500'>
                            <span className='text-primary-500'>Đăng nhập ngay</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
