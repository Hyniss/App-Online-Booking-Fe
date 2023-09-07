import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import DatatableBusinessUserOwner from "../../../components/datatable/DatatableBusinessUserOwner";
import { callRequest } from "../../../utils/requests";
import BusinessLayout from "../BusinessLayout";
import "./ListBusinessUser.css";
const ListBusinessUser = () => {
    const [company, setCompany] = React.useState();
    const navigate = useNavigate();
    const getCompanyInfo = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest("company/business/detail", requestOptions)
            .then((response) => {
                setCompany(response.data);
                if (response.data.status !== "ACTIVE") {
                    navigate("/");
                }
            })
            .catch((response) => console.log(response));
    };

    useEffectOnce(() => {
        getCompanyInfo();
    });
    return (
        <BusinessLayout company={company}>
            <DatatableBusinessUserOwner />
        </BusinessLayout>
    );
};

export default ListBusinessUser;
