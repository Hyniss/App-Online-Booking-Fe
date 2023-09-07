// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { SearchCriterias } from "../AdminComponents/Criterias"; 
import { Paging } from "../AdminComponents/Paging"; 
import Input from "../base/input"; 
import { TableHeader } from "../base/TableHeader"; 
import { useAuth } from "../../context/Auth"; 
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
} from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests"; 
import { strings } from "../../utils/strings"; 
import Navbar from "../navbar/Navbar";
// import { AdminLayout } from "../AdminLayout";

export const BookingRequestHistory = () => {
    const user = useAuth();
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
            value: "createdAt",
            text: "Ngày tạo",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "checkinAt",
            text: "Ngày nhận phòng",
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
                UN_PURCHASED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"UN_PURCHASED"}
                        </label>
                    ),
                },
                PURCHASED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"Đã đặt"}
                        </label>
                    ),
                },
                // PURCHASED: {
                //     element: (
                //         <label
                //             className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                //             {"PURCHASED"}
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

        callRequest("booking-request/list", requestOptions).then((response) => {
            setCompanyList(response.data.items);
            setCurrentPage(response.data.page);
            setTotalPages(response.data.totalPages);
        });
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

    useEffectOnce(() => search());

    return (
            <>
            <Navbar/>
            <div className='p-16 bg-white w-full overflow-auto col-span-1 h-full'>
                <p className='text-3xl font-bold'>Lịch sử đặt phòng</p>
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
            </>  
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
            { fields.map((field, index) => {
                console.log("field",field);
                if (field.availableValues) {
                    const x = company[field.value];
                    const element = field.availableValues[x]?.element;
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
                }
                if (field.value === "transactionAmount") {
                    // Access the nested 'user.username' property from the 'company' object
                    const amount = company.transactionAmount || ""; // Use optional chaining to handle undefined properties

                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
                                }`}
                        >
                            {strings.toMoney((amount))}
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
            </td>
        </tr>
    );
};
