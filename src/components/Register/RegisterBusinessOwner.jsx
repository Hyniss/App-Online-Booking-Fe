import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { useWindowSize } from "../../context/BrowserContext";
import { callRequest } from "../../utils/requests";
import Input from "../base/input";

const RegisterBusinessOwner = () => {
    const navigation = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companySize, setCompanySize] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [tax, setTax] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [sizes, setSizes] = useState([]);

    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [companySizeError, setCompanySizeError] = useState("");
    const [companyNameError, setCompanyNameError] = useState("");
    const [companyAddressError, setCompanyAddressError] = useState("");
    const [taxError, setTaxError] = useState("");
    const [contactNameError, setContactNameError] = useState("");
    const [contactNumberError, setContactNumberError] = useState("");

    useEffectOnce(() => {
        var headers = new Headers();
        headers.append("X-LOCALE", "en");

        var requestOptions = {
            method: "GET",
            headers: headers,
            redirect: "follow",
        };

        callRequest("user/register/business-owner/essential", requestOptions).then(
            (response) => {
                setSizes(response.data);
                setCompanySize(response.data[0].name);
            }
        );
    });

    const signUp = async () => {
        var myHeaders = new Headers();
        myHeaders.append("X-LOCALE", "en");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-FROM", process.env.REACT_APP_FE_PATH);

        var raw = JSON.stringify({
            email,
            username,
            password,
            confirmPassword,
            size: companySize,
            companyName,
            companyAddress,
            taxCode: tax,
            contactName,
            contactNumber,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/register/business-owner", requestOptions)
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
                    setCompanyNameError(errors["companyName"]);
                    setCompanyAddressError(errors["companyAddress"]);
                    setCompanySizeError(errors["size"]);
                    setTaxError(errors["taxCode"]);
                    setContactNameError(errors["contactName"]);
                    setContactNumberError(errors["contactNumber"]);
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
            <div className='w-full xl:w-fit max-w-[80rem] m-4 p-4 sm:p-8 bg-white rounded-lg xl:grid xl:grid-cols-5 gap-8'>
                {windowSize.isLargerThan("xl") && (
                    <img
                        src='https://images.unsplash.com/photo-1549923746-c502d488b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
                        className='object-cover rounded-lg h-full w-full col-span-2'
                    />
                )}
                <div className='col-span-3'>
                    <p className='text-2xl font-bold mb-4'>Đăng ký doanh nghiệp</p>
                    <div className='w-full'>
                        <div className='md:grid sm:grid-cols-12 gap-3 justify-center'>
                            <Input
                                required
                                onChangeValue={setCompanyName}
                                error={companyNameError}
                                field='Tên doanh nghiệp'
                                className='block md:col-span-5 w-full '
                                inputClassName=''
                                type='text'></Input>
                            <Input
                                required
                                onChangeValue={setTax}
                                error={taxError}
                                field='Mã số thuế'
                                className='block md:col-span-3 '
                                inputClassName=''
                                type='text'></Input>
                            {sizes && (
                                <div className='block md:col-span-4 '>
                                    <label htmlFor=''>Quy mô</label>
                                    <select
                                        className='mt-1 rounded-md border-gray-300'
                                        onChange={(e) => {
                                            setCompanySize(e.target.value);
                                        }}>
                                        {sizes.map((size_) => (
                                            <option
                                                key={size_.name}
                                                value={size_.name}
                                                selected={size_.name === companySize}>
                                                {size_.to
                                                    ? `Từ ${size_.from} đến ${size_.to} người`
                                                    : `Hơn ${size_.from} người`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <Input
                                required
                                onChangeValue={setCompanyAddress}
                                error={companyAddressError}
                                field='Địa chỉ'
                                className='block md:col-span-4 '
                                inputClassName=''
                                type='text'></Input>
                            <Input
                                required
                                className='block md:col-span-4 '
                                onChangeValue={setContactName}
                                error={contactNameError}
                                inputClassName=''
                                field='Tên liên hệ'
                                type='text'></Input>
                            <Input
                                required
                                className='block md:col-span-4 '
                                inputClassName=''
                                onChangeValue={setContactNumber}
                                error={contactNumberError}
                                field='Số điện thoại liên hệ'
                                type='text'></Input>
                            <Input
                                required
                                className='block md:col-span-6'
                                inputClassName=''
                                onChangeValue={setEmail}
                                error={emailError}
                                field='Email'
                                type='text'></Input>
                            <Input
                                required
                                className='block md:col-span-6'
                                inputClassName=''
                                onChangeValue={setUsername}
                                error={usernameError}
                                field='Tên người dùng'
                                type='text'></Input>
                            <Input
                                required
                                className='block col-span-6'
                                inputClassName=''
                                onChangeValue={setPassword}
                                error={passwordError}
                                field='Mật khẩu'
                                type='password'></Input>
                            <Input
                                required
                                className='block col-span-6'
                                inputClassName=''
                                onChangeValue={setConfirmPassword}
                                error={confirmPasswordError}
                                field='Mật khẩu xác nhận'
                                type='password'></Input>
                        </div>
                        <button
                            onClick={() => signUp()}
                            className='w-full py-4 bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2'>
                            Đăng ký ngay
                        </button>
                    </div>
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

export default RegisterBusinessOwner;
