import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import React from "react";
import { useAuth } from "../../context/Auth";
import { strings } from "../../utils/strings";
import BaseLayout from "../BaseLayout";
import Input from "../base/input";

import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { useWindowSize } from "../../context/BrowserContext";
import { callRequest } from "../../utils/requests";
import { Modal } from "../base/Modal";
import OTP from "../base/OTP";
import { Photo } from "../base/Photo";
import { HTMLNodes } from "./../../utils/elements";
import { XContentEditable } from "./../base/XContentEditable";

export const PersonalInformation = () => {
    const [user, ,] = useAuth([
        "ADMIN",
        "CUSTOMER",
        "HOUSE_OWNER",
        "BUSINESS_OWNER",
        "BUSINESS_ADMIN",
        "BUSINESS_MEMBER",
    ]);
    const [profile, setProfile] = React.useState();
    const [editingField, setEditingField] = React.useState();

    const navigate = useNavigate();

    useEffectOnce(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`user/profile/${user.id}`, requestOptions)
            .then((response) => {
                setProfile(response.data);
            })
            .catch((response) => {
                if (response.status === 404) {
                    navigate("/not-found");
                    return;
                }
                if (response.status === 403) {
                    navigate("/forbidden");
                    return;
                }
                alert(response.message);
                navigate("/");
            });
    }, [user != null]);

    const windowSize = useWindowSize();
    return (
        <BaseLayout className=''>
            {profile && (
                <div className='px-4 w-full max-w-[1080px] my-12 sm:my-24 m-auto'>
                    <div className='flex'>
                        <a href='/account' className='hover:underline'>
                            Tài khoản
                        </a>
                        <KeyboardArrowRightRoundedIcon className='text-gray-400' />
                        <h4 className=''>Thông tin cá nhân</h4>
                    </div>
                    <h3 className='text-2xl font-bold mt-2'>Thông tin cá nhân</h3>
                    <div className='mt-8 lg:grid lg:grid-cols-3 lg:gap-3'>
                        <div className='border border-gray-300 p-4 rounded-md grid col-span-2 overflow-hidden'>
                            <AvatarSection user={profile} />
                            <div className='px-4'>
                                <div className='border-t border-gray-200 py-4'>
                                    <h5 className='font-bold font-xl'>Tên người dùng</h5>
                                    <h5 className=''>{user.username}</h5>
                                </div>
                            </div>
                            <EmailSection
                                editingField={editingField}
                                setEditingField={setEditingField}
                                user={profile}
                            />
                            <PhoneSection
                                editingField={editingField}
                                setEditingField={setEditingField}
                                user={profile}
                            />
                            <PasswordSection
                                editingField={editingField}
                                setEditingField={setEditingField}
                                user={profile}
                            />
                            <OtherInformationSection
                                editingField={editingField}
                                setEditingField={setEditingField}
                                user={profile}
                            />
                        </div>
                        {windowSize.isLargerThan("lg") && (
                            <div className='min-w-[18rem] max-w-[24rem] border border-gray-300 rounded-md py-4 px-6'>
                                <div className='flex flex-col'>
                                    <div className='relative'>
                                        <VisibilityTwoToneIcon
                                            className='text-primary-500 block text-xl'
                                            style={{ height: "48px", width: "48px" }}
                                        />
                                    </div>
                                    <h3 className='text-xl font-bold mt-2'>
                                        Những thông tin nào sẽ được chia sẻ cho người
                                        khác?
                                    </h3>
                                    <p className='text-gray-500'>
                                        Chúng tôi chỉ chia sẽ những thông tin cho khách
                                        hàng của bạn sau khi họ đã đặt phòng thành công.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </BaseLayout>
    );
};

function AvatarSection({ user }) {
    const [avatar, setAvatar] = React.useState(user.avatar);

    const updateAvatar = (avatar) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            avatar,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/profile/avatar", requestOptions)
            .then((res) => {
                alert(res.message);
                const newUser = JSON.stringify(res.data);
                if (res.data.accessToken) {
                    localStorage.setItem("auth", newUser);
                    localStorage.setItem("token", res.data.accessToken);
                }
                window.location.reload();
            })
            .catch((res) => {
                alert(res.message);
            });
    };
    const uploadImageRef = React.useRef();

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var formdata = new FormData();
            formdata.append("file", file);

            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow",
            };
            callRequest("utility/upload/image", requestOptions)
                .then((response) => {
                    updateAvatar(response.data);
                })
                .catch((response) => alert(response.message))
                .finally(() => {
                    if (uploadImageRef.current) {
                        uploadImageRef.current.value = "";
                    }
                });
        }
    };

    return (
        <div className='mx-4 py-4 flex'>
            <div className='flex items-center gap-4'>
                <input
                    ref={uploadImageRef}
                    type='file'
                    onChange={uploadImage}
                    hidden
                    id='avatar-uploader'
                />
                <Photo
                    className='w-32 h-32 rounded-full border border-gray-200 object-cover'
                    src={avatar}
                    errorSrc='https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo'
                />
                <label
                    htmlFor='avatar-uploader'
                    className='btn__primary px-3 py-2 block h-fit cursor-pointer'>
                    Đổi ảnh đại diện
                </label>
            </div>
        </div>
    );
}

function OtherInformationSection({ editingField, setEditingField, user }) {
    const [address, setAddress] = React.useState(user.address);
    const [bio, setBio] = React.useState(user.bio);

    const [updatingAddress, setUpdatingAddress] = React.useState(user.address);
    const [addressError, setAddressError] = React.useState();

    const [updatingBio, setUpdatingBio] = React.useState(user.bio);
    const [bioError, setBioError] = React.useState();

    const updateInformation = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            address: updatingAddress,
            bio: updatingBio,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/profile/address", requestOptions)
            .then((response) => {
                alert(response.message);
                setAddress(updatingAddress);
                setBio(updatingBio);
                setEditingField(null);
                setAddressError(null);
                setBioError(null);
            })
            .catch((response) => {
                if (response.status === 400) {
                    setAddressError(response.data?.address);
                    setBioError(response.data?.bio);
                    return;
                }
                alert(response.message);
            });
    };

    return editingField === "OTHERS" ? (
        <div className='px-4'>
            <div className='border-t border-gray-200 pt-4 w-full'>
                <div
                    className={`flex ${
                        editingField != null && editingField !== "OTHERS"
                            ? "opacity-50"
                            : ""
                    }`}>
                    <div className=''>
                        <h5 className='font-bold font-xl'>Địa chỉ</h5>
                    </div>
                    <div className='flex gap-2 ml-auto'>
                        <button
                            onClick={() => {
                                setEditingField(null);
                            }}
                            className={`!px-2 !py-1 h-fit ml-auto rounded-md bg-gray-200 hover:bg-gray-300 text-black text-sm`}>
                            Hủy
                        </button>
                        <button
                            disabled={
                                strings.trim(updatingAddress) ===
                                    strings.trim(user.address) &&
                                strings.trim(updatingBio) === strings.trim(user.bio)
                            }
                            onClick={() => {
                                updateInformation();
                            }}
                            className={`!px-2 !py-1 h-fit btn__primary`}>
                            Thay đổi
                        </button>
                    </div>
                </div>
                <Input
                    className='mt-2'
                    text={updatingAddress}
                    onChangeValue={setUpdatingAddress}
                    error={addressError}
                />
                <XContentEditable
                    field='Mô tả'
                    error={bioError}
                    maxLength={1024}
                    onChange={setUpdatingBio}
                    initValue={updatingBio}
                />
            </div>
        </div>
    ) : (
        <div className='px-4'>
            <div
                className={`border-t border-gray-200 py-4 flex ${
                    editingField != null && editingField !== "OTHERS" ? "opacity-50" : ""
                }`}>
                <div>
                    <h5 className='font-bold font-xl'>Địa chỉ</h5>
                    <h5 className={strings.isBlank(address) ? "text-gray-400" : ""}>
                        {strings.isBlank(address) ? "Chưa cung cấp" : address}
                    </h5>
                    <h5 className='font-bold font-xl mt-2'>Mô tả</h5>
                    {strings.isBlank(bio) ? (
                        <h5 className={`text-gray-400`}>Chưa cung cấp</h5>
                    ) : (
                        <HTMLNodes rawHTML={bio} className='break-all' />
                    )}
                </div>
                {editingField == null && (
                    <button
                        onClick={() => {
                            setEditingField("OTHERS");
                            setUpdatingAddress(address);
                        }}
                        className={`!px-2 !py-1 h-fit ml-auto btn__primary`}>
                        Thay đổi
                    </button>
                )}
            </div>
        </div>
    );
}

function PasswordSection({ editingField, setEditingField, user }) {
    const [hasPassword, setHasPassword] = React.useState(user.password);

    const [oldPassword, setOldPassword] = React.useState();
    const [oldPasswordError, setOldPasswordError] = React.useState();

    const [newPassword, setNewPassword] = React.useState();
    const [newPasswordError, setNewPasswordError] = React.useState();

    const [confirmPassword, setConfirmPassword] = React.useState();
    const [confirmPasswordError, setConfirmPasswordError] = React.useState();

    const updatePassword = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            oldPassword,
            newPassword,
            confirmPassword,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/profile/password", requestOptions)
            .then((response) => {
                setHasPassword(true);
                setEditingField(null);
                alert(response.message);
            })
            .catch((response) => {
                if (response.status === 400 && response.data) {
                    setOldPasswordError(response.data.oldPassword);
                    setNewPasswordError(response.data.newPassword);
                    setConfirmPasswordError(response.data.confirmPassword);
                    return;
                }
                alert(response.message);
            });
    };

    return editingField === "PASSWORD" ? (
        <div className='px-4'>
            <div className='py-4 w-full border-t border-gray-200 '>
                <div
                    className={`flex ${
                        editingField != null && editingField !== "PASSWORD"
                            ? "opacity-50"
                            : ""
                    }`}>
                    <div className='flex gap-2 ml-auto'>
                        <button
                            onClick={() => {
                                setEditingField(null);
                            }}
                            className={`!px-2 !py-1 h-fit ml-auto rounded-md bg-gray-200 hover:bg-gray-300 text-black text-sm`}>
                            Hủy
                        </button>
                        <button
                            onClick={() => {
                                updatePassword();
                            }}
                            className={`!px-2 !py-1 h-fit btn__primary`}>
                            Thay đổi
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    {hasPassword && (
                        <div className=''>
                            <h5 className='font-bold font-xl'>Mật khẩu cũ</h5>
                            <Input
                                type='password'
                                className=''
                                text={oldPassword}
                                onChangeValue={setOldPassword}
                                error={oldPasswordError}
                            />
                        </div>
                    )}
                    <div className=''>
                        <h5 className='font-bold font-xl'>Mật khẩu mới</h5>
                        <Input
                            type='password'
                            className=''
                            text={newPassword}
                            onChangeValue={setNewPassword}
                            error={newPasswordError}
                        />
                    </div>
                    <div className=''>
                        <h5 className='font-bold font-xl'>Mật khẩu xác nhận</h5>
                        <Input
                            type='password'
                            className=''
                            text={confirmPassword}
                            onChangeValue={setConfirmPassword}
                            error={confirmPasswordError}
                        />
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className='px-4'>
            <div
                className={`py-4 border-t border-gray-200 flex ${
                    editingField != null && editingField !== "PASSWORD"
                        ? "opacity-50"
                        : ""
                }`}>
                <div>
                    <h5 className='font-bold font-xl'>Mật khẩu</h5>
                    <h5 className={hasPassword ? "" : "text-gray-400"}>
                        {hasPassword ? "*************" : "Chưa cung cấp"}
                    </h5>
                </div>
                {editingField == null && (
                    <button
                        onClick={() => {
                            setEditingField("PASSWORD");
                            setOldPassword(null);
                            setNewPassword(null);
                            setConfirmPassword(null);
                            setOldPasswordError(null);
                            setNewPasswordError(null);
                            setConfirmPasswordError(null);
                        }}
                        className={`!px-2 !py-1 h-fit ml-auto btn__primary`}>
                        Thay đổi
                    </button>
                )}
            </div>
        </div>
    );
}

function PhoneSection({ editingField, setEditingField, user }) {
    const [region, setRegion] = React.useState("84");
    const [phone, setPhone] = React.useState(strings.phoneWoRegion(user.phone));
    const [phoneError, setPhoneError] = React.useState("");
    const [otp, setOtp] = React.useState();
    const [openPhoneModal, setOpenPhoneModal] = React.useState(false);

    const sendOtp = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ region, phone }),
        };

        callRequest("user/profile/phone/send-otp", requestOptions)
            .then((response) => {
                alert(response.message);
                localStorage.setItem("key", response.data);
                setPhoneError();
                setOpenPhoneModal(true);
                setOtp();
            })
            .catch((error) => {
                if (error.status === 400) {
                    setPhoneError(error.data?.phone ?? error.message);
                    return;
                }
                alert(error.message);
            });
    };
    return editingField === "PHONE" ? (
        <div className='px-4'>
            <div className='border-t border-gray-200 py-4 '>
                <div
                    className={`flex ${
                        editingField != null && editingField !== "PHONE"
                            ? "opacity-50"
                            : ""
                    }`}>
                    <div className=''>
                        <h5 className='font-bold font-xl'>Số điện thoại</h5>
                    </div>
                    <div className='flex gap-2 ml-auto'>
                        <button
                            onClick={() => {
                                setEditingField(null);
                            }}
                            className={`!px-2 !py-1 h-fit ml-auto rounded-md bg-gray-200 hover:bg-gray-300 text-black text-sm`}>
                            Hủy
                        </button>
                        <button
                            disabled={
                                strings.phoneWoRegion(user.phone).trim() === phone.trim()
                            }
                            onClick={() => {
                                sendOtp();
                            }}
                            className={`!px-2 !py-1 h-fit btn__primary`}>
                            Thay đổi
                        </button>
                    </div>
                </div>
                <Input
                    className='mt-3'
                    field=''
                    text={phone}
                    onChangeValue={setPhone}
                    error={phoneError}></Input>
                {openPhoneModal && (
                    <Modal setOpenModal={setOpenPhoneModal}>
                        <div className='px-8'>
                            <ConfirmPhoneOTP
                                phone={phone}
                                otp={otp}
                                setOtp={setOtp}
                                onSuccess={(response) => {
                                    const token = response.data;
                                    var myHeaders = new Headers();
                                    myHeaders.append("Content-Type", "application/json");
                                    myHeaders.append(
                                        "Authorization",
                                        `Bearer ${localStorage.getItem("token")}`
                                    );
                                    var raw = JSON.stringify({
                                        token,
                                    });
                                    var requestOptions = {
                                        method: "PUT",
                                        headers: myHeaders,
                                        body: raw,
                                        redirect: "follow",
                                    };
                                    callRequest("user/profile/phone", requestOptions)
                                        .then((response) => {
                                            alert(response.message);
                                            const newUser = JSON.stringify(response.data);
                                            if (response.data.accessToken) {
                                                localStorage.setItem("auth", newUser);
                                                localStorage.setItem(
                                                    "token",
                                                    response.data.accessToken
                                                );
                                            }
                                            window.location.reload();
                                        })
                                        .catch((error) => alert(error.message));
                                }}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    ) : (
        <div className='px-4'>
            <div
                className={`border-t border-gray-200 py-4 flex ${
                    editingField != null && editingField !== "PHONE" ? "opacity-50" : ""
                }`}>
                <div>
                    <h5 className='font-bold font-xl'>Số điện thoại</h5>
                    <h5 className={strings.isBlank(user.phone) ? "text-gray-400" : ""}>
                        {strings.isBlank(user.phone)
                            ? "Chưa cung cấp"
                            : strings.phoneWoRegion(user.phone)}
                    </h5>
                </div>
                {editingField == null && (
                    <button
                        onClick={() => {
                            setEditingField("PHONE");
                            setPhoneError(null);
                            setRegion("84");
                            setPhone(strings.phoneWoRegion(user.phone));
                        }}
                        className={`!px-2 !py-1 h-fit ml-auto btn__primary`}>
                        {strings.isBlank(user.phone) ? "Thêm" : "Thay đổi"}
                    </button>
                )}
            </div>
        </div>
    );
}

const ConfirmPhoneOTP = ({ phone, otp, setOtp, onSuccess }) => {
    const [otpError, setOtpError] = React.useState("");
    const [timeToResend, setTimeToResend] = React.useState(30);

    const resendOTP = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ region: 84, phone }),
        };
        callRequest("user/profile/phone/send-otp", requestOptions)
            .then((response) => {
                alert(response.message);
            })
            .catch((error) => alert(error.message));
    };

    const confirm = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                region: 84,
                phone,
                otp,
                key: localStorage.getItem("key"),
            }),
        };
        callRequest("user/otp/verify", requestOptions)
            .then((response) => {
                onSuccess(response);
                localStorage.removeItem("key");
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

function EmailSection({ editingField, setEditingField, user }) {
    const [waiting, setWaiting] = React.useState(user.waiting);

    const [updatingEmail, setUpdatingEmail] = React.useState(user.email);
    const [emailError, setEmailError] = React.useState();

    const updateEmail = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        console.log(localStorage.getItem("token"));
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        myHeaders.append("X-FROM", process.env.REACT_APP_FE_PATH);

        var raw = JSON.stringify({
            email: updatingEmail,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("user/profile/email", requestOptions)
            .then((response) => {
                alert(response.message);
                setEditingField(null);
                setWaiting(updatingEmail);
                // TODO: Web socket here.
            })
            .catch((response) => {
                if (response.status === 400) {
                    setEmailError(response.data?.email ?? response.message);
                    return;
                }
                alert(response.message);
            });
    };
    return editingField === "EMAIL" ? (
        <div className='px-4'>
            <div className='border-t border-gray-200 py-4 '>
                <div
                    className={`flex ${
                        editingField != null && editingField !== "EMAIL"
                            ? "opacity-50"
                            : ""
                    }`}>
                    <div className=''>
                        <h5 className='font-bold font-xl'>Địa chỉ email</h5>
                    </div>
                    <div className='flex gap-2 ml-auto'>
                        <button
                            onClick={() => {
                                setEditingField(null);
                                setUpdatingEmail(user.email);
                            }}
                            className={`!px-2 !py-1 h-fit ml-auto rounded-md bg-gray-200 hover:bg-gray-300 text-black text-sm`}>
                            Hủy
                        </button>
                        <button
                            disabled={
                                strings.trim(updatingEmail) === strings.trim(user.email)
                            }
                            onClick={() => {
                                updateEmail();
                            }}
                            className={`!px-2 !py-1 h-fit btn__primary`}>
                            Thay đổi
                        </button>
                    </div>
                </div>
                <Input
                    className='w-full mt-2'
                    text={updatingEmail}
                    onChangeValue={setUpdatingEmail}
                    error={emailError}
                />
            </div>
        </div>
    ) : (
        <div className='px-4'>
            <div
                className={`border-t border-gray-200 py-4 flex ${
                    editingField != null && editingField !== "EMAIL" ? "opacity-50" : ""
                }`}>
                <div>
                    <h5 className='font-bold font-xl'>Địa chỉ email</h5>
                    <h5 className={strings.isBlank(user.email) ? "text-gray-400" : ""}>
                        {strings.isBlank(user.email) ? "Chưa cung cấp" : user.email}
                    </h5>
                    {waiting && (
                        <h5 className='mt-2 !px-2 !py-1 rounded-md bg-yellow-100 text-yellow-600'>
                            Chờ xác thực email {waiting}
                        </h5>
                    )}
                </div>
                {editingField == null && (
                    <button
                        onClick={() => {
                            setEditingField("EMAIL");
                            setUpdatingEmail(user.email);
                        }}
                        className={`!px-2 !py-1 h-fit ml-auto btn__primary`}>
                        {strings.isBlank(user.email) ? "Thêm" : "Thay đổi"}
                    </button>
                )}
            </div>
        </div>
    );
}
