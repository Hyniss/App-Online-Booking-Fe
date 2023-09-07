import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import moment from "moment/moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useClickOutside, useEffectOnce, useElementProp } from "../../CustomHooks/hooks";
import { useAuth } from "../../context/Auth";
import { useNotifications } from "../../context/NotificationContext";
import { getMessagingToken, onMessageListener } from "../../firebase";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import { Photo } from "./../base/Photo";
const Navbar = () => {
    const navigate = useNavigate();
    const notificationsContext = useNotifications();

    const [notifications, setNotifications] = React.useState([]);
    const [openNotificationModal, setOpenNotificationModal] = React.useState(false);
    const [openMenuModal, setOpenMenuModal] = React.useState(false);

    const [notificationBtnRef, notificationBtnProp] = useElementProp();

    React.useEffect(() => {
        setNotifications(notificationsContext.content);
    }, [notificationsContext.content]);

    const menuRef = useClickOutside(setOpenMenuModal);
    const [avatarRef, avatarProp] = useElementProp();

    useEffectOnce(() => {
        if (strings.isNumeric(localStorage.getItem("B-ID"))) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
            var requestOptions = {
                method: "PUT",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(
                `accommodation/book/${localStorage.getItem("B-ID")}/cancel`,
                requestOptions
            )
                .then((result) => {
                    localStorage.removeItem("B-ID");
                })
                .catch((error) => console.log("error", error));
        }
    });

    React.useEffect(() => {
        const interval = setInterval(() => refreshUserToken(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const refreshUserToken = () => {
        const userJson = localStorage.getItem("auth");
        const user = strings.isNotBlank(userJson) ? JSON.parse(userJson) : null;

        if (
            user &&
            !(user.roles || []).includes("HOUSE_OWNER") &&
            localStorage.getItem("register-HO") === "yes" &&
            !window.location.href.includes("/house-owner/register")
        ) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
            var requestOptions = {
                method: "POST",
                headers: myHeaders,
                redirect: "follow",
            };
            callRequest("user/refresh-token", requestOptions)
                .then((response) => {
                    localStorage.setItem("token", response.data.accessToken);
                    localStorage.setItem("auth", JSON.stringify(response.data));
                    localStorage.removeItem("register-HO");
                    window.location.reload();
                })
                .catch((error) => {});
        }
    };

    useEffectOnce(() => {
        getMessagingToken();
    });

    useEffectOnce(() => {
        getMessagingToken();
        try {
            const channel = new BroadcastChannel("notifications");
            channel.addEventListener("message", (event) => {
                notificationsContext.load();
            });
        } catch (error) {}
    });

    React.useEffect(() => {
        onMessageListener().then((data) => {
            notificationsContext.load();
        });
    }, []);

    const [user, ,] = useAuth();

    const removeUserDevice = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const token = localStorage.getItem("firebase_token");

        var raw = JSON.stringify({ token });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("notification/token/remove", requestOptions)
            .then(() => {
                notificationsContext.unsubscribe();
            })
            .catch(() => {});
    };

    function signOut() {
        removeUserDevice();
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        sessionStorage.removeItem("firebase_token");
        localStorage.removeItem("status");
        navigate("/");
    }

    const unreadNotifications = notifications.filter((n) => n.unread);
    const roles = user?.roles || [];
    return (
        <div className='flex items-center h-16 overflow-hidden px-4 border-b border-gray-200 '>
            {openNotificationModal && (
                <NotificationMenu
                    notifications={notifications}
                    notificationBtnProp={notificationBtnProp}
                    setOpenNotificationModal={setOpenNotificationModal}
                />
            )}

            <a href='/' className='hover:bg-gray-200 rounded-md px-2 py-1 block'>
                Trang chủ
            </a>

            {user &&
                (roles.includes("BUSINESS_MEMBER") ||
                    roles.includes("BUSINESS_ADMIN") ||
                    roles.includes("BUSINESS_OWNER")) && (
                    <a
                        href='/business/company/detail'
                        className='ml-4 hover:bg-gray-200 rounded-md px-2 py-1 block'>
                        Công ty của tôi
                    </a>
                )}
            {user && roles.includes("ADMIN") && window.location.pathname !== "/admin" && (
                <a
                    href='/admin'
                    className='ml-4 hover:bg-gray-200 rounded-md px-2 py-1 block'>
                    Trang quản lý
                </a>
            )}
            {user && roles.includes("HOUSE_OWNER") && (
                <a
                    href='/house-owner/accommodation/'
                    className='ml-4 hover:bg-gray-200 rounded-md px-2 py-1 block'>
                    Nhà của tôi
                </a>
            )}
            {user && (
                <div className='flex items-center ml-auto overflow-hidden h-full gap-3'>
                    <button
                        className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full relative'
                        ref={notificationBtnRef}>
                        <NotificationsNoneOutlinedIcon
                            className=''
                            onClick={() => {
                                setOpenMenuModal(false);
                                setOpenNotificationModal(true);
                            }}
                        />
                        {unreadNotifications.length > 0 && (
                            <div className='w-[1.25rem] h-[1.25rem] bg-primary-500 rounded-full absolute right-[-6px] top-[-2px] text-sm flex items-center justify-center'>
                                <label className='text-white'>
                                    {unreadNotifications.length > 9
                                        ? "9+"
                                        : unreadNotifications.length}
                                </label>
                            </div>
                        )}
                    </button>
                    <Photo
                        innerRef={avatarRef}
                        src={user?.avatar}
                        className='rounded-full cursor-pointer object-cover'
                        style={{
                            width: notificationBtnProp.height,
                            height: notificationBtnProp.height,
                        }}
                        errorSrc={
                            "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
                        }
                        onClick={() => {
                            setOpenNotificationModal(false);
                            setOpenMenuModal(!openMenuModal);
                        }}
                    />
                    {openMenuModal && (
                        <div
                            className='!fixed bg-white rounded-md shadow-lg border border-gray-200 shadow-gray-200 z-10 top-0'
                            style={{
                                top: avatarProp.bottom + 16,
                                left: avatarProp.left - 256 + avatarProp.width,
                            }}
                            ref={menuRef}>
                            <div className='py-3 px-2 flex flex-col w-64'>
                                <a
                                    href={`/profile/${user.id}`}
                                    className='w-full py-2 rounded-md hover:bg-gray-200 text-left px-3'>
                                    Hồ sơ
                                </a>
                                <a
                                    href='/account'
                                    className='w-full py-2 rounded-md hover:bg-gray-200 text-left px-3'>
                                    Tài khoản
                                </a>
                                {roles.includes("CUSTOMER") && (
                                    <a
                                        href='/book/history'
                                        className='w-full py-2 rounded-md hover:bg-gray-200 text-left px-3'>
                                        Lịch sử đặt phòng
                                    </a>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className='w-full py-2 rounded-md hover:bg-gray-200 text-left px-3 text-red-500'>
                                    Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!user && (
                <div className='flex items-center ml-auto h-full gap-3'>
                    <a href='/login' className='btn__primary px-4 py-2 !text-white'>
                        Đăng nhập
                    </a>
                </div>
            )}
        </div>
    );
};

export default Navbar;
function NotificationMenu({
    notificationBtnProp,
    notifications,
    setOpenNotificationModal,
}) {
    const notificationsContext = useNotifications();
    const [notificationInnerRef, notificationProp] = useElementProp();

    const notificationRef = useClickOutside(() => {
        setOpenNotificationModal(false);
        notificationsContext.markRead();
    });
    return (
        <div
            className='!fixed bg-white rounded-md shadow-lg border border-gray-200 shadow-gray-200 z-10 top-0'
            style={{
                top: notificationBtnProp.bottom + 16,
                left:
                    notificationBtnProp.left -
                    notificationProp.width +
                    notificationBtnProp.width,
            }}
            ref={notificationRef}>
            <div
                ref={notificationInnerRef}
                className='pt-6 pb-4 px-3 flex flex-col w-72 sm:w-96 max-h-[50vh] overflow-auto'>
                <h1 className='text-2xl mb-2 font-bold ml-4'>Thông báo</h1>
                {notifications.length === 0 && (
                    <div className='px-4 text-danger-500'>
                        Hiện tại không có thông báo
                    </div>
                )}
                {notifications.slice(0, 10).map((notification, index) => (
                    <div
                        className='hover:bg-gray-100 rounded-md px-4 py-2 cursor-pointer flex items-center gap-1'
                        key={index}>
                        <div className='w-[calc(100%-8px)]'>
                            <h1 className='text-sm'>{notification.content}</h1>
                            <h1 className='text-sm text-primary-500'>
                                {moment(
                                    notification.createdAt,
                                    "HH:mm DD/MM/YYYY"
                                ).fromNow()}
                            </h1>
                        </div>
                        {notification.unread && (
                            <div className='w-[8px] h-[8px] bg-primary-500 rounded-full ml-auto'></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
