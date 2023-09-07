import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
} from "../../CustomHooks/hooks";
import { fomatDates } from "../../common/regex";
import { useAuth } from "../../context/Auth";
import BusinessLayout from "../../pages/business/BusinessLayout";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import { SearchCriterias } from "../AdminComponents/Criterias";
import { Paging } from "../AdminComponents/Paging";
import InputByType from "../base/InputByType";
import { TableHeader } from "../base/TableHeader";
import Input from "../base/input";
// import { AdminLayout } from "../AdminLayout";

export const BookingRequestBusiness = () => {
    const [user, isLogin, isAuthorized] = useAuth(["BUSINESS_ADMIN","BUSINESS_OWNER"]);
    const pageSizes = [5, 10, 20];

    // Page details
    const [isDescending, setIsDescending] = useCallbackState(null);
    const [sortProperty, setSortProperty] = useCallbackState(null);
    const [currentPage, setCurrentPage] = useCallbackState(1);
    const [pageSize, setPageSize] = useCallbackState(pageSizes[0]);
    const [criteriaList, setCriteriaList] = useCallbackState([]);

    const [companyList, setCompanyList] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [name, setName] = React.useState("");

    const columns = [
        {
            value: "id",
            text: "Mã",
            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
        },
        {
            value: "checkinAt",
            text: "Ngày đặt phòng",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "checkoutAt",
            text: "Ngày trả phòng",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },

        {
            value: "accommodationName",
            text: "Nhà thuê",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "accommodationOwnerUsername",
            text: "Chủ nhà",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "status",
            text: "Trạng thái",
            criteriaList: ["IN"],
            availableValues: {
                PURCHASED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"Đã đặt"}
                        </label>
                    ),
                },
                // PENDING: {
                //     element: (
                //         <label
                //             className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                //             {"PENDING"}
                //         </label>
                //     ),
                // },
                CANCELED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Đã hủy"}
                        </label>
                    ),
                },
                SUCCEED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-success-100 text-success-600 hover:bg-success-200 block w-max`}>
                            {"Thành công"}
                        </label>
                    ),
                },
            },
        },
        {
            value: "transactionAmount",
            text: "Chi phí",
            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
        },
    ];

    const search = React.useCallback(() => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const searchingCriterias = [...criteriaList.current];
        if (strings.isNotBlank(name)) {
            searchingCriterias.push({
                key: "name",
                operation: "CONTAINS",
                value: [name],
            });
        }
        var raw = JSON.stringify({
            page: currentPage.current,
            size: pageSize.current,
            orderBy: sortProperty.current || "createdAt",
            descending: isDescending.current,
            criteriaList: searchingCriterias,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("booking-request/business", requestOptions).then((response) => {
            setCompanyList(response.data.items);
            setCurrentPage(response.data.page);
            setTotalPages(response.data.totalPages);
        });
    });

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

    // const send = React.useCallback(() => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    //     var raw = JSON.stringify({
    //         message: name,
    //     });

    //     var requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow",
    //     };

    //     callRequest("notification/send", requestOptions);
    // });

    useEffectOnce(() => search(), [isAuthorized, isLogin]);
    return (
        <BusinessLayout company={company}>
            <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
                <p className='text-3xl font-bold'>Quản lý đặt phòng</p>
                <div className='flex gap-2 items-center mt-4'>
                    {/* <Input
                        onChangeValue={setName}
                        field=''
                        placeHolder={"Search by company name"}
                        className='w-96'
                        inputClassName='h-12'
                        type='text'></Input>
                    <button
                        className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                        onClick={() => search()}>
                        Search
                    </button> */}
                    {/* <button
                        className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                        onClick={() => send()}>
                        Send
                    </button> */}
                </div>
                {/* <SearchCriterias
                    criteriaList={criteriaList.current}
                    setCriteriaList={setCriteriaList}
                    fields={columns}
                    searchCallback={search}
                /> */}
                <div className='rounded-md bg-white shadow-sm mt-4'>
                    <table className='h-full w-full table-fixed'>
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <TableHeader
                                        key={column.value}
                                        index={index}
                                        data={column}
                                        sortProperty={sortProperty.current}
                                        setSortProperty={(sortProp) =>
                                            Promise.resolve()
                                                .then(() => setSortProperty(sortProp))
                                                .then(() => search())
                                        }
                                        isDescending={isDescending.current}
                                        setIsDescending={setIsDescending}
                                    />
                                ))}
                                {/* <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {companyList.map((company) => (
                                <CompanyRow
                                    data={company}
                                    key={company.id}
                                    fields={columns}
                                />
                            ))}
                        </tbody>
                    </table>
                    {Paging({
                        setPageSize,
                        search,
                        pageSizes,
                        currentPage: currentPage.current,
                        totalPages,
                        setCurrentPage,
                    })}
                </div>
            </div>
        </BusinessLayout>
    );
};

const CompanyRow = ({ data, fields }) => {
    const [company, setCompany] = React.useState(data);
    const [openModal, setOpenModal] = React.useState(false);
    const [rejectMessage, setRejectMessage] = React.useState("");
    const [rejectMessageError, setRejectMessageError] = React.useState("");
    const ref = useClickOutside(setOpenModal);

    return (
        <tr className='border-t border-gray-200 hover:bg-gray-100'>
            {fields.map((field, index) => {
                if (field.availableValues) {
                    const x = company[field.value];
                    const element = field.availableValues[x]?.element;
                    console.log("status", x);
                    if (element) {
                        return (
                            <td
                                key={index}
                                className={`h-[64px] overflow-hidden text-black ${
                                    index === 0 ? "px-8" : "px-4"
                                }`}>
                                {element}
                            </td>
                        );
                    }
                } else if (field.value === "transactionAmount") {
                    // Access the nested 'user.username' property from the 'company' object
                    const amount = company.transactionAmount || ""; // Use optional chaining to handle undefined properties

                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${
                                index === 0 ? "px-8" : "px-4"
                            }`}>
                            {strings.toMoney(amount)}
                        </td>
                    );
                }
                return (
                    <td
                        key={index}
                        className={`h-[64px] overflow-hidden text-black ${
                            index === 0 ? "px-8" : "px-4"
                        }`}>
                        {company[field.value]}
                    </td>
                );
            })}
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    <a
                        href={`/detail/${company.id}`}
                        className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                        Chi tiết
                    </a>
                </div>
                <div className='px-2 mt-2'>
                    <button
                        onClick={() => setOpenModal(true)}
                        className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                        Thông tin đơn
                    </button>
                </div>
                {openModal && (
                <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                    <div className='absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 top-20'>
                        <div className='px-4 pt-4 flex'>
                            <button
                                onClick={() => setOpenModal(false)}
                                className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                                <CloseRoundedIcon fontSize='8' />
                            </button>
                        </div>
                        <div className='px-8 pb-4'>
                            <div className='flex mt-2'>
                                <div className='block flex-none w-1/2 pr-1 '>
                                    <label>Ngày đi </label>
                                    <InputByType
                                        type='date'
                                        text={fomatDates(
                                            company.travelStatement.fromDate
                                        )}
                                        editable={false}
                                    />
                                </div>
                                <div className='block flex-none w-1/2 pl-1'>
                                    <label>Ngày về </label>
                                    <InputByType
                                        type='date'
                                        text={fomatDates(company.travelStatement.toDate)}
                                        editable={false}
                                    />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='block flex-none w-1/2 px-1'>
                                    <label>Chủ đề đơn</label>
                                    <Input
                                        text={company.travelStatement.name}
                                        editable={false}></Input>
                                </div>
                                <div className='block flex-none w-1/2 px-1'>
                                    <label>Số người</label>
                                    <InputByType
                                        type='number'
                                        text={company.travelStatement.numberOfPeople}
                                        editable={false}
                                    />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='block flex-none w-1/2 px-1'>
                                    <label>Tên nhân viên</label>
                                    <Input
                                        text={company.travelStatement.creator}
                                        editable={false}></Input>
                                </div>
                                <div className='block flex-none w-1/2 px-1'>
                                    <label>Địa điểm</label>
                                    <Input
                                        text={company.travelStatement.location}
                                        editable={false}></Input>
                                </div>
                            </div>
                            <div className='mt-2 space-x-4'>
                                <div className='block'>
                                    <label>Chú thích</label>
                                    <textarea
                                        className='w-full mt-2 rounded-md border-gray-300 min-h-[8rem]'
                                        placeholder='Chú thích'
                                        readOnly={true}>
                                        {company.travelStatement.note}
                                    </textarea>
                                </div>
                            </div>

                            <div className='flex mt-2'>
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className='rounded-md px-6 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 h-12 ml-auto'>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </td>
        </tr>
    );
};
