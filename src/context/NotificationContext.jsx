import React from "react";
import { useCallbackState, useEffectOnce } from "../CustomHooks/hooks";
import { callRequest } from "../utils/requests";

const NotificationContext = React.createContext();

const useNotifications = () => React.useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
    const [notificationsRef, setNotifications] = useCallbackState([]);

    const loadNotifications = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest("notification", requestOptions)
            .then((response) => {
                const newNotifications = response.data.map((notification) => {
                    return {
                        content: notification.payload,
                        createdAt: notification.createdAt,
                        unread: notification.unread ?? true,
                    };
                });
                updateNotifications(newNotifications);
            })
            .catch((e) => console.log(e));
    };

    useEffectOnce(() => {
        loadNotifications();
    });

    const markRead = () => {
        if (!notificationsRef.current.some((notification) => notification.unread)) {
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest("notification/read", requestOptions)
            .then(() => {
                loadNotifications();
            })
            .catch(() => {});
    };

    const unsubscribe = () => {
        setNotifications([]);
    };

    const updateNotifications = (notifications) => {
        setNotifications(notifications);
    };

    return (
        <NotificationContext.Provider
            value={{
                content: notificationsRef.current || [],
                unsubscribe,
                markRead,
                load: loadNotifications,
            }}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider, useNotifications };
