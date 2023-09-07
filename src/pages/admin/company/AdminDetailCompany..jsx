import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import Input from "../../../components/base/input";
import { callRequest } from "../../../utils/requests";
import { AdminLayout } from "../AdminLayout";

export const AdminDetailCompany = () => {
    const navigation = useNavigate();
    const { id } = useParams();

    const [companyName, setCompanyName] = React.useState("");
    const [shortName, setShortName] = React.useState("");
    const [companySize, setCompanySize] = React.useState("");
    const [companyAddress, setCompanyAddress] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [contactNumber, setContactNumber] = React.useState("");
    const [contactName, setContactName] = React.useState("");
    const [owner, setOwner] = React.useState("");
    const [loaded, setLoaded] = React.useState(false);
    const [sizes, setSizes] = React.useState([]);

    useEffectOnce(() => {
        const getCompanySizes = () => {
            var headers = new Headers();
            headers.append("X-LOCALE", "en");
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

        const getCompanyInfo = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(`company/admin/detail?companyId=${id}`, requestOptions)
                .then((response) => {
                    setCompanyName(response.data.name);
                    setShortName(response.data.shortName);
                    setCompanySize(response.data.size);
                    setCompanyAddress(response.data.address);
                    setContactNumber(response.data.contact);
                    setContactName(response.data.contactName);
                    setEmail(response.data.owner.email);
                    setOwner(response.data.owner.username);
                    setLoaded(true);
                })
                .catch((response) => {
                    if (response.status === 403) {
                        navigation("/");
                    }
                    if (response.status === 401) {
                        navigation("/login");
                    }
                });
        };

        getCompanyInfo();
        getCompanySizes();
    });

    return (
        <AdminLayout>
            <div className='p-16 bg-gray-100 h-screen'>
                <h1 className='text-3xl font-bold mb-4'>Thông tin công ty</h1>
                {loaded && (
                    <div className='w-1/2 grid grid-cols-12 gap-3 justify-center'>
                        <Input
                            field={"Tên công ty"}
                            inputClassName='cursor-default hover:outline-none text-gray-500 bg-[#fafafa]'
                            editable={false}
                            className='block col-span-6 '
                            text={companyName}
                        />
                        <Input
                            field={"Tên viết tắt"}
                            onChangeValue={setShortName}
                            inputClassName={`cursor-default hover:outline-none text-gray-500 bg-[#fafafa]`}
                            editable={false}
                            className='block col-span-3 '
                            text={shortName}
                        />
                        <div className='block col-span-3'>
                            <label className=''>Quy mô</label>
                            <select
                                className='bg-[#fafafa]  rounded-md border-gray-300'
                                disabled={true}>
                                {sizes.map((size_) => (
                                    <option
                                        key={size_.value}
                                        value={size_.value}
                                        selected={companySize == size_.name}>
                                        {size_.to
                                            ? `From ${size_.from} to ${size_.to}`
                                            : `More than ${size_.from}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            field={"Email giám đốc"}
                            className='block col-span-6 '
                            inputClassName='cursor-default hover:outline-none text-gray-500 bg-[#fafafa]'
                            editable={false}
                            text={email}
                        />
                        <Input
                            field={"Tên giám đốc"}
                            className='block col-span-6 '
                            inputClassName='cursor-default hover:outline-none text-gray-500 bg-[#fafafa]'
                            editable={false}
                            text={owner}
                        />
                        <Input
                            field={"Địa chỉ"}
                            className='block col-span-4 '
                            onChangeValue={setCompanyAddress}
                            inputClassName={`cursor-default hover:outline-none text-gray-500 bg-[#fafafa]`}
                            editable={false}
                            text={companyAddress}
                        />
                        <Input
                            field={"Tên liên hệ"}
                            onChangeValue={setContactName}
                            className='block col-span-4 '
                            inputClassName={`cursor-default hover:outline-none text-gray-500 bg-[#fafafa]`}
                            editable={false}
                            text={contactName}
                        />
                        <Input
                            field={"Số điện thoại liên hệ"}
                            onChangeValue={setContactNumber}
                            className='block col-span-4 '
                            inputClassName={`cursor-default hover:outline-none text-gray-500 bg-[#fafafa]`}
                            editable={false}
                            text={contactNumber}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
