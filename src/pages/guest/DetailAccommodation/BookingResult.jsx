import { useLocation, useParams } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import { callRequest } from "../../../utils/requests";

const BookingResult = () => {
    const { id } = useParams();
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
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`accommodation/${id}/success?${queryStringParams}`, requestOptions)
            .then(() => {
                closeTab();
            })
            .catch(() => {
                closeTab();
            });
    });
    return <div className=''></div>;
};

export default BookingResult;
