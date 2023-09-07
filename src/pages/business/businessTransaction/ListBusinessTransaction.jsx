import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import DatatableTransactionBusinessOwner from "../../../components/datatable/DatatableTransactionBusinessOwner";
import { callRequest } from "../../../utils/requests";
import BusinessLayout from "../BusinessLayout";
import "./BusinessBookingRequest.css";

const ListBusinessTransaction = () => {
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
            <DatatableTransactionBusinessOwner />
        </BusinessLayout>
    );
};

export default ListBusinessTransaction;
