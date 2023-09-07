import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
} from "../../../CustomHooks/hooks";
import { SearchCriterias } from "../../../components/AdminComponents/Criterias";
import { Paging } from "../../../components/AdminComponents/Paging";
import { TableHeader } from "../../../components/base/TableHeader";
import { XContentEditable } from "../../../components/base/XContentEditable";
import Input from "../../../components/base/input";
import { useAuth } from "../../../context/Auth";
import { callRequest } from "../../../utils/requests";
import { strings } from "../../../utils/strings";
import { AdminLayout } from "../AdminLayout";

export const AdminListCompany = () => {
    const [user, isLogin, isAuthorized] = useAuth(["ADMIN"]);

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
            text: "Id",
            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
        },
        {
            value: "name",
            text: "Tên",
            criteriaList: ["EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"],
        },
        {
            value: "size",
            text: "Quy mô",
            criteriaList: ["IN"],
            availableValues: {
                MICRO: {
                    element: (
                        <label className='block w-max text-sm bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-2 px-3 rounded-md'>
                            Bé
                        </label>
                    ),
                },
                SMALL: {
                    element: (
                        <label className='block w-max text-sm bg-indigo-200 text-indigo-600 hover:bg-indigo-300 py-2 px-3 rounded-md'>
                            Nhỏ
                        </label>
                    ),
                },
                MEDIUM: {
                    element: (
                        <label className='block w-max text-sm bg-indigo-300 text-indigo-600 hover:bg-indigo-400 py-2 px-3 rounded-md'>
                            Vừa
                        </label>
                    ),
                },
                BIG: {
                    element: (
                        <label className='block w-max text-sm bg-indigo-400 text-white hover:bg-indigo-500 py-2 px-3 rounded-md'>
                            Lớn
                        </label>
                    ),
                },
            },
        },
        {
            value: "address",
            text: "Địa chỉ",
            criteriaList: ["EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"],
        },
        {
            value: "contact",
            text: "Số liên hệ",
            criteriaList: ["EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"],
        },
        {
            value: "contactName",
            text: "Tên liên hệ",
            criteriaList: ["EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"],
        },
        {
            value: "status",
            text: "Trạng thái",
            criteriaList: ["IN"],
            availableValues: {
                PENDING_CHANGE: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"Đang cập nhật"}
                        </label>
                    ),
                },
                PENDING: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"Chờ duyệt"}
                        </label>
                    ),
                },
                REJECTED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Đã từ chối"}
                        </label>
                    ),
                },
                INACTIVE: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Tạm khoá"}
                        </label>
                    ),
                },
                ACTIVE: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-success-100 text-success-600 hover:bg-success-200 block w-max`}>
                            {"Hoạt động"}
                        </label>
                    ),
                },
            },
        },
        {
            value: "createdAt",
            text: "Ngày tham gia",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
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
            orderBy: sortProperty.current,
            isDescending: isDescending.current,
            criteriaList: searchingCriterias,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("company/admin/list", requestOptions)
            .then((response) => {
                setCompanyList(response.data.items);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);
            })
            .catch(() => console.log("Failed"));
    }, [user]);

    useEffectOnce(() => search(), [isAuthorized, isLogin]);
    return (
        <AdminLayout>
            <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
                <p className='text-3xl font-bold'>Danh sách công ty</p>
                <div className='flex gap-2 items-center mt-4 mb-4'>
                    <Input
                        onChangeValue={setName}
                        field=''
                        placeHolder={"Tìm theo tên..."}
                        className='w-96'
                        inputClassName='h-12'
                        type='text'></Input>
                    <button
                        className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                        onClick={() => search()}>
                        Tìm kiếm
                    </button>
                </div>
                <SearchCriterias
                    criteriaList={criteriaList.current}
                    setCriteriaList={setCriteriaList}
                    fields={columns}
                    searchCallback={search}
                />
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
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
                                <th className='h-16 w-[6rem] px-4 text-black'></th>
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
        </AdminLayout>
    );
};

const CompanyRow = ({ data, fields }) => {
    const [company, setCompany] = React.useState(data);
    const [openModal, setOpenModal] = React.useState(false);
    const [rejectMessage, setRejectMessage] = React.useState("");
    const [rejectMessageError, setRejectMessageError] = React.useState("");
    const ref = useClickOutside(setOpenModal);

    const changeStatusTo = (status) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            companyId: company.id,
            status,
            rejectMessage,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("company/admin/status", requestOptions)
            .then((response) => {
                setCompany(response.data);
                alert(response.message);
                setOpenModal(false);
            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    setRejectMessageError(response.data.rejectMessage);
                    return;
                }
                alert(response.message);
            });
    };

    return (
        <tr className='border-t border-gray-200 hover:bg-gray-100'>
            {fields.map((field, index) => {
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
                    {company.status === "PENDING" && (
                        <button
                            onClick={() => changeStatusTo("ACTIVE")}
                            className='rounded-md py-2 text-sm font-medium bg-success-500 text-white hover:bg-success-600 block text-center w-full'>
                            Đồng ý
                        </button>
                    )}
                </div>
            </td>
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    {company.status === "PENDING" && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className='rounded-md py-2 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 block text-center w-full'>
                            Từ chối
                        </button>
                    )}
                </div>
            </td>
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    <a
                        href={`/admin/company/${company.id}`}
                        className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                        Chi tiết
                    </a>
                </div>
            </td>
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    {(company.status === "ACTIVE" || company.status === "PENDING") && (
                        <button
                            onClick={() => {
                                if (
                                    window.confirm("Bạn có muốn khoá công ty này không?")
                                ) {
                                    changeStatusTo("INACTIVE");
                                }
                            }}
                            className='rounded-md py-2 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 block text-center w-full'>
                            Khoá
                        </button>
                    )}
                    {company.status === "INACTIVE" && (
                        <button
                            onClick={() => changeStatusTo("ACTIVE")}
                            className='rounded-md py-2 text-sm font-medium bg-success-500 text-white hover:bg-success-600 block text-center w-full'>
                            Mở khoá
                        </button>
                    )}
                </div>
                {openModal && (
                    <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                        <div
                            className='absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 top-1/3'
                            ref={ref}>
                            <div className='px-4 pt-4 flex'>
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                                    <CloseRoundedIcon fontSize='8' />
                                </button>
                            </div>
                            <div className='px-6 pb-4'>
                                <XContentEditable
                                    field='Lí do từ chối'
                                    error={rejectMessageError}
                                    maxLength={400}
                                    onChange={setRejectMessage}
                                    initValue={""}
                                    className='w-[30rem]'
                                />
                                <div className='flex mt-2'>
                                    <button
                                        onClick={() => changeStatusTo("REJECTED")}
                                        className='rounded-md px-6 py-2 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 ml-auto'>
                                        Từ chối
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
