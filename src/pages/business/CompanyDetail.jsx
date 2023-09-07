import React from "react";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { ApiButton } from "../../components/base/Buttons";
import Input from "../../components/base/input";
import { useAuth } from "../../context/Auth";
import { callRequest } from "../../utils/requests";
import BusinessLayout from "./BusinessLayout";

export const CompanyDetail = () => {
    useAuth(["BUSINESS_OWNER", "BUSINESS_ADMIN", "BUSINESS_MEMBER"]);

    const [id, setId] = React.useState();
    const [company, setCompany] = React.useState();

    const [companyName, setCompanyName] = React.useState("");
    const [shortName, setShortName] = React.useState("");
    const [companySize, setCompanySize] = React.useState("");
    const [companyAddress, setCompanyAddress] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [contactNumber, setContactNumber] = React.useState("");
    const [contactName, setContactName] = React.useState("");
    const [owner, setOwner] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [tax, setTax] = React.useState("");
    const [rejectedMessages, setRejectedMessages] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [sizes, setSizes] = React.useState([]);
    const [editable, setEditable] = React.useState(false);
    const [changed, setChanged] = React.useState(false);

    const [companyNameError, setCompanyNameError] = React.useState("");
    const [shortNameError, setShortNameError] = React.useState("");
    const [taxError, setTaxError] = React.useState("");
    const [companyAddressError, setCompanyAddressError] = React.useState("");
    const [contactNumberError, setContactNumberError] = React.useState("");
    const [contactNameError, setContactNameError] = React.useState("");

    const [updating, setUpdating] = React.useState(false);
    const [sendingRequest, setSendingRequest] = React.useState(false);

    const setField = (fn, value) => {
        Promise.resolve()
            .then(() => fn(value))
            .then(() => setChanged(true));
    };

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
                setId(response.data.id);
                setCompany(response.data);
                setCompanyName(response.data.name);
                setShortName(response.data.shortName);
                setCompanySize(response.data.size);
                setCompanyAddress(response.data.address);
                setContactNumber(response.data.contact);
                setContactName(response.data.contactName);
                setTax(response.data.quotaCode);
                setStatus(response.data.status);
                setRejectedMessages(response.data.rejectMessages || []);
                setEditable(response.data.isEditable);
                setEmail(response.data.owner.email);
                setOwner(response.data.owner.username);
                setLoaded(true);
            })
            .catch((response) => console.log(response));
    };

    useEffectOnce(() => {
        const getCompanySizes = () => {
            var headers = new Headers();
            headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: headers,
                redirect: "follow",
            };

            callRequest("user/register/business-owner/essential", requestOptions).then(
                (response) => {
                    setSizes(response.data);
                }
            );
        };

        getCompanyInfo();
        getCompanySizes();
    });

    const updateCompany = () => {
        if (updating) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            companyId: id,
            companyName,
            shortName,
            taxCode: tax,
            size: companySize,
            address: companyAddress,
            contactNumber,
            contactName,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        setUpdating(true);
        callRequest("company/business/detail", requestOptions)
            .then((response) => {
                alert(response.message);
                getCompanyInfo();
                setChanged(false);
                setTaxError();
                setCompanyNameError();
                setShortNameError();
                setCompanyAddressError();
                setContactNumberError();
                setContactNameError();
            })
            .catch((response) => {
                if (response.status === 400) {
                    setTaxError(response.data.taxCode);
                    setCompanyNameError(response.data.companyName);
                    setShortNameError(response.data.shortName);
                    setCompanyAddressError(response.data.address);
                    setContactNumberError(response.data.contactNumber);
                    setContactNameError(response.data.contactName);
                    return;
                }
                alert(response.message);
            })
            .finally(() => {
                setUpdating(false);
            });
    };

    const sendCooperateRequest = () => {
        if (sendingRequest) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };
        setSendingRequest(true);
        callRequest("company/business/send-cooperate-request", requestOptions)
            .then((response) => {
                alert(response.message);
                window.location.reload();
            })
            .catch((response) => alert(response.message))
            .finally(() => setSendingRequest(false));
    };

    return (
        <BusinessLayout company={company}>
            <div className='p-16 w-full h-full'>
                <h1 className='text-3xl font-bold mb-4'>Thông tin công ty</h1>
                {loaded && (
                    <div className='w-full max-w-[960px] mt-4'>
                        {(status === "REJECTED" ||
                            status === "PENDING_CHANGE" ||
                            status === "INACTIVE") && (
                            <div className='flex flex-col gap-2'>
                                {rejectedMessages.map((msg, index) => (
                                    <p
                                        key={index}
                                        className='py-3 px-4 bg-danger-100 border border-danger-500 text-danger-500 rounded-md break-words'>
                                        {msg}
                                    </p>
                                ))}
                            </div>
                        )}
                        {status === "PENDING" && (
                            <p className='py-3 px-4 bg-warning-100 border border-warning-500 text-warning-500 rounded-md'>
                                Đang đợi quản trị viên phê duyệt đơn hợp tác.
                            </p>
                        )}
                        {status === "ACTIVE" && (
                            <p className='py-3 px-4 bg-success-100 border border-success-500 text-success-700 rounded-md'>
                                Công ty bạn đã hợp tác với chúng tôi thành công. Các giao
                                dịch đặt phòng của công ty sẽ được chiết khấu 5%.
                            </p>
                        )}
                        <div className='lg:grid lg:grid-cols-12 gap-4 justify-center w-full mt-3'>
                            <Input
                                field={"Tên công ty"}
                                inputClassName={`${
                                    editable && status === "PENDING_CHANGE"
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                onChangeValue={(value) => setField(setCompanyName, value)}
                                className='block col-span-5 '
                                editable={editable && status === "PENDING_CHANGE"}
                                text={companyName}
                                error={companyNameError}
                            />
                            <Input
                                field={"Tên viết tắt"}
                                error={shortNameError}
                                onChangeValue={(value) => setField(setShortName, value)}
                                className='block col-span-3 '
                                inputClassName={`${
                                    editable && status === "PENDING_CHANGE"
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                editable={editable && status === "PENDING_CHANGE"}
                                text={shortName}
                            />
                            <div className='block col-span-4'>
                                <label htmlFor=''>Quy mô</label>
                                <select
                                    className={` rounded-md border-gray-300 ${
                                        editable ? "bg-white" : "bg-[#f8f8f8]"
                                    }`}
                                    onChange={(e) =>
                                        setField(setCompanySize, e.target.value)
                                    }
                                    disabled={!editable}>
                                    {sizes.map((size_, index) => (
                                        <option
                                            key={index}
                                            value={size_.name}
                                            selected={size_.name === companySize}>
                                            {size_.to
                                                ? `Từ ${size_.from} đến ${size_.to} người`
                                                : `Hơn ${size_.from} người`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                field={"Mã số thuế"}
                                error={taxError}
                                className='block col-span-3 '
                                inputClassName={`${
                                    editable && status === "PENDING_CHANGE"
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                editable={editable && status === "PENDING_CHANGE"}
                                text={tax}
                                onChangeValue={(value) => setField(setTax, value)}
                            />
                            <Input
                                field={"Email giám đốc"}
                                className='block col-span-6 '
                                inputClassName='cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]'
                                editable={false}
                                text={email}
                            />
                            <Input
                                field={"Tên giám đốc"}
                                className='block col-span-3 '
                                inputClassName='cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]'
                                editable={false}
                                text={owner}
                            />
                            <Input
                                field={"Địa chỉ"}
                                className='block col-span-4 '
                                error={companyAddressError}
                                onChangeValue={(value) =>
                                    setField(setCompanyAddress, value)
                                }
                                inputClassName={`${
                                    editable
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                editable={editable}
                                text={companyAddress}
                            />
                            <Input
                                field={"Tên liên hệ"}
                                error={contactNameError}
                                onChangeValue={(value) => setField(setContactName, value)}
                                className='block col-span-4 '
                                inputClassName={`${
                                    editable
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                editable={editable}
                                text={contactName}
                            />
                            <Input
                                field={"Số điện thoại liên hệ"}
                                error={contactNumberError}
                                onChangeValue={(value) =>
                                    setField(setContactNumber, value)
                                }
                                className='block col-span-4 '
                                inputClassName={`${
                                    editable
                                        ? ""
                                        : "cursor-default hover:outline-none text-gray-500 bg-[#f8f8f8]"
                                }`}
                                editable={editable}
                                text={contactNumber}
                            />
                            {editable && (
                                <ApiButton
                                    disabled={!changed}
                                    loading={updating}
                                    className={`py-3 w-full bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 disabled:cursor-not-allowed ${
                                        status === "PENDING_CHANGE"
                                            ? "col-span-8"
                                            : "col-span-12"
                                    }`}
                                    onClick={() => updateCompany()}>
                                    <div className=''>Thay đổi</div>
                                </ApiButton>
                            )}
                            {status === "PENDING_CHANGE" && (
                                <ApiButton
                                    loading={sendingRequest}
                                    className='py-3 w-full bg-primary-500 mt-3 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 col-span-4'
                                    onClick={() => sendCooperateRequest()}>
                                    <div className=''>Gửi yêu cầu hợp tác</div>
                                </ApiButton>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </BusinessLayout>
    );
};
