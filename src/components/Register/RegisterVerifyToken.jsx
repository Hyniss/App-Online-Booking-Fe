import { useLocation } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "./../../utils/requests";

const RegisterVerifyToken = () => {
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const queryStringParams = urlParams.toString();

    const closeTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    };

    useEffectOnce(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`user/register/verify?${queryStringParams}`, requestOptions)
            .then(() => {
                alert("Xác nhận thành công");
                closeTab();
            })
            .catch(() => {
                alert("Xác nhận thất bại");
                closeTab();
            });
    });
    return <div className=''></div>;
};

export default RegisterVerifyToken;
