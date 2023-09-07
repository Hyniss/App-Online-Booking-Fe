import React from "react";
import { useNavigate } from "react-router-dom";
import { strings } from "../utils/strings";

const getAccessToken = () => {
    const token = localStorage.getItem("token");
    return strings.isNotBlank(token) ? `Bearer ${token}` : null;
};

const useAuth = (roles = []) => {
    const userJson = localStorage.getItem("auth");
    const user = strings.isNotBlank(userJson) ? JSON.parse(userJson) : null;
    const isLogin = !!user;
    const isAuthorized = roles.length === 0 || (user && user.roles.some((role) => roles.includes(role)));

    const navigate = useNavigate();
    React.useEffect(() => {
        if (strings.isBlank(userJson) && roles.length > 0) {
            navigate("/login");
            return;
        }

        if (!isAuthorized) {
            navigate("/");
        }
    }, [user]);

    return [user, isLogin, isAuthorized];
};

export { getAccessToken, useAuth };
