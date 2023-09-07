import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import { useWindowSize } from "../../context/BrowserContext";
import { useNotifications } from "../../context/NotificationContext";
import "../../css/style.css";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import Input from "../base/input";

const Login = () => {
    const [user, ,] = useAuth();
    const navigation = useNavigate();

    if (user) {
        navigation("/");
    }

    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");

    const [emailOrPhoneError, setEmailOrPhoneError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const windowSize = useWindowSize();
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            navigation("/");
        }
    }, []);

    const notifications = useNotifications();

    const saveLogin = (response) => {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("auth", JSON.stringify(response.data));
        const roles = response.data.roles;

        notifications.load();

        if (strings.isNotBlank(localStorage.getItem("redirect-url"))) {
            const url = localStorage.getItem("redirect-url");
            localStorage.removeItem("redirect-url");
            navigation(url);
            return;
        }

        if (roles.some((role) => role.includes("BUSINESS_"))) {
            navigation("/business/company/detail");
            return;
        }
        if (roles.includes("ADMIN")) {
            navigation("/admin");
            return;
        }
        navigation("/");
    };

    const login = () => {
        var myHeaders = new Headers();
        myHeaders.append("X-LOCALE", "en");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-FROM", process.env.REACT_APP_FE_PATH);

        var raw = JSON.stringify({
            emailOrPhone,
            password,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };
        localStorage.removeItem("register-HO");

        callRequest("user/login", requestOptions)
            .then((response) => {
                saveLogin(response);
            })
            .catch((response) => {
                if (response.status === 400) {
                    const errors = response.data;
                    setEmailOrPhoneError(errors["emailOrPhone"]);
                    setPasswordError(errors["password"]);
                    return;
                }
                if (response.status === 403) {
                    alert(response.message);
                    setEmailOrPhoneError("");
                    setPasswordError("");
                }
                alert(response.message);
            });
    };
    const loginUsingGoogle = useGoogleLogin({
        onSuccess: (codeResponse) => {
            var myHeaders = new Headers();
            myHeaders.append("X-LOCALE", "en");
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                googleToken: codeResponse.access_token,
            });

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
            };

            callRequest("user/login/google", requestOptions)
                .then((response) => {
                    saveLogin(response);
                })
                .catch((response) => {
                    if (response.status === 400) {
                        const errors = response.data;
                        setEmailOrPhoneError(errors["emailOrPhone"]);
                        setPasswordError(errors["password"]);
                        return;
                    }
                    alert(response.data.message);
                });
        },
        onError: (error) => console.log("Login Failed:", error),
    });
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
                    <p className='text-3xl font-bold mb-4'>Đăng nhập</p>
                    <div className=''>
                        <div className=''>
                            <Input
                                required
                                onChangeValue={setEmailOrPhone}
                                error={emailOrPhoneError}
                                field='Email / Số điện thoại'></Input>
                            <Input
                                required
                                className='mt-3'
                                onChangeValue={setPassword}
                                error={passwordError}
                                field='Mật khẩu'
                                type='password'></Input>
                        </div>
                        <div className='flex mt-3'>
                            <Link to='/password/reset' className='ml-auto'>
                                Quên mật khẩu
                            </Link>
                        </div>
                        <button
                            onClick={() => login()}
                            className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                            Đăng nhập
                        </button>
                        <button
                            onClick={() => loginUsingGoogle()}
                            className='w-full py-4 bg-gray-200 flex gap-2 text-center mt-3 rounded-md items-center justify-center hover:bg-gray-300'>
                            <img
                                src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png'
                                alt=''
                                className='h-6 object-cover'
                            />
                            <div className=''>Đăng nhập bằng Google</div>
                        </button>
                    </div>
                    <p className='m-auto mt-3 text-center text-sm sm:text-base'>
                        Bạn chưa có tài khoản?
                        <Link to='/register'>
                            <span className='text-primary-500'> Đăng ký ngay</span>
                        </Link>
                    </p>
                    <p className='text-center text-[0.8rem] sm:text-base'>
                        Bạn muốn đăng ký cho doanh nghiệp?
                        <Link to='/register/business'>
                            <span className='text-primary-500'> Hợp tác ngay</span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
