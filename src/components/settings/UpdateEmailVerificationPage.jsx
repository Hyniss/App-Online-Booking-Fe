import { useLocation } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";
import BaseLayout from "../BaseLayout";

export const UpdateEmailVerificationPage = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search).toString();

    const closeTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    };

    useEffectOnce(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`user/profile/email/verify?${urlParams}`, requestOptions)
            .then((response) => {
                const newUser = JSON.stringify(response.data);

                if (response.data.accessToken) {
                    localStorage.setItem("auth", newUser);
                    localStorage.setItem("token", response.data.accessToken);
                }

                alert("Thay đổi thành công");

                closeTab();
            })
            .catch((error) => {
                alert(error.message);
            });
    });
    return <BaseLayout></BaseLayout>;
};
