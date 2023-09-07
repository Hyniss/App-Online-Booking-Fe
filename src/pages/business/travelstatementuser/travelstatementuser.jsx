import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { Paging } from "../../../components/AdminComponents/Paging";
// import Input from "../base/input";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
} from "../../../CustomHooks/hooks";
import { fomatDateTravel } from "../../../common/regex";
import { HDatePicker } from "../../../components/base/HDatePicker";
import InputByType from "../../../components/base/InputByType";
import { TableHeader } from "../../../components/base/TableHeader";
import Input from "../../../components/base/input";
import { useAuth } from "../../../context/Auth";
import { callRequest } from "../../../utils/requests";
import { strings } from "../../../utils/strings";
import BusinessLayout from "../BusinessLayout";
import { format, addDays, isAfter } from 'date-fns';
// import { AdminLayout } from "../AdminLayout";

export const Travelstatementuser = () => {
    const [user, isLogin, isAuthorized] = useAuth("BUSINESS_MEMBER");
    const pageSizes = [5, 10, 20];

    // Page details
    const [isDescending, setIsDescending] = useCallbackState(null);
    const [sortProperty, setSortProperty] = useCallbackState(null);
    const [currentPage, setCurrentPage] = useCallbackState(1);
    const [pageSize, setPageSize] = useCallbackState(pageSizes[0]);
    const [criteriaList, setCriteriaList] = useCallbackState([]);
    const [openAddModals, setOpenAddModals] = React.useState(false);
    const [companyList, setCompanyList] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [name, setName] = React.useState("");
    const [nameError, setNameError] = React.useState("");
    const [nameAdd, setNameAdd] = React.useState("");
    const [noteAdd, setNoteAdd] = React.useState("");
    const [noteError, setNoteError] = React.useState("");
    const [locationAdd, setLocationAdd] = React.useState("");
    const [locationError, setLocationError] = React.useState("");
    const [numberAdd, setNumberAdd] = React.useState("");
    const [numberError, setNumberError] = React.useState("");
    const [fromDateAdd, setFromDateAdd] = React.useState("");
    const [fromError, setFromError] = React.useState("");
    const [toDateUpAdd, setToDateAdd] = React.useState("");
    const [toError, setToError] = React.useState("");
    const [checkError, setCheckError] = React.useState(false);
    const refUpdate = useClickOutside(setOpenAddModals);

    const columns = [
        {
            value: "id",
            text: "Mã",
            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
        },
        {
            value: "name",
            text: "Chủ đề",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "createdAt",
            text: "Ngày tạo",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "location",
            text: "Địa điểm",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
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
                            {"Đang duyệt"}
                        </label>
                    ),
                },
                CANCELED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Hủy đơn"}
                        </label>
                    ),
                },
                REJECTED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Từ chối"}
                        </label>
                    ),
                },
                APPROVED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-success-100 text-success-600 hover:bg-success-200 block w-max`}>
                            {"Đã duyệt"}
                        </label>
                    ),
                },
            },
        },
    ];

    const SetErrorDefault = () => {
        setNameError("");
        setFromError("");
        setToError("");
        setLocationError("");
        setNumberError("");
        setNoteError("");
    };

    const SetAddDefault = () => {
        setFromDateAdd("");
        setToDateAdd("");
        setNameAdd("");
        setNumberAdd("");
        setLocationAdd("");
    };

    const SetOutSideClick = () => {
        setOpenAddModals(true);
        SetErrorDefault();
        SetAddDefault();
    };

    const handleCheckInDate = (date) => {
        setFromDateAdd(date);
        setToDateAdd(null);
    };

    const handleCheckOutDate = (date) => {
        setToDateAdd(date);
    };

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

        callRequest("travel-statement/business-member", requestOptions)
            .then((response) => {
                setCompanyList(response.data.items);
                setCurrentPage(response.data.page);
                setTotalPages(response.data.totalPages);
            })
            .catch((response) => {
                // if (response.status === 400 && response?.data?.rejectMessage) {
                //     alert(response.message);
                //     return;
                // }
                alert(response.message);
            });
    }, [user]);
    useEffectOnce(() => search(), [isAuthorized, isLogin]);
    const sendStatement = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            name: nameAdd,
            numberOfPeople: numberAdd,
            location: locationAdd,
            note: noteAdd,
            fromDate: moment(fromDateAdd).format("HH:mm DD/MM/YYYY"),
            toDate: moment(toDateUpAdd).format("HH:mm DD/MM/YYYY"),
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("travel-statement/business-member/create", requestOptions)
            .then((response) => {
                alert(response.message);
                setOpenAddModals(false);
                search();
                SetAddDefault();
                SetErrorDefault();

            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    return;
                }
                if (response.message === null) {
                    setNameError(response.data["name"]);
                    setFromError(response.data["fromDate"]);
                    setToError(response.data["toDate"]);
                    setLocationError(response.data["location"]);
                    setNumberError(response.data["numberOfPeople"]);
                    setNoteError(response.data["note"]);
                } else {
                    setNumberError(response.message);
                }
            });
    };

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
        <>
            <BusinessLayout company={company}>
                <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
                    <p className='text-3xl font-bold'>Đơn của bạn</p>
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
                    <button
                        onClick={() => SetOutSideClick()}
                        className={`rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12`}>
                        <AddIcon />
                        Tạo đơn
                    </button>
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
                                    {/* <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                                    {/* <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                                    {/* <th className='h-16 w-[6rem] px-4 text-black'></th>
                            <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {companyList &&
                                    companyList.map((company) => (
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
                    {openAddModals && (
                        <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                            <div className='absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 top-20'>
                                <div className='px-4 pt-4 flex'>
                                    <button
                                        onClick={() => setOpenAddModals(false)}
                                        className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                                        <CloseRoundedIcon fontSize='8' />
                                    </button>
                                </div>
                                <div className='px-8 pb-4'>
                                    <div className='flex mt-2'>
                                        <div className='block flex-none w-1/2 pr-1 '>
                                            <Input
                                                required
                                                field={"Chủ đề của đơn"}
                                                onChangeValue={(value) =>
                                                    setNameAdd(value)
                                                }
                                                error={nameError}
                                                placeHolder='Nhập chủ đề đơn'
                                                errorStyle='w-70'></Input>
                                        </div>
                                        <div className='block flex-none w-1/2 pl-1'>
                                            <Input
                                                required
                                                field={"Địa điểm"}
                                                error={locationError}
                                                onChangeValue={(value) =>
                                                    setLocationAdd(value)
                                                }
                                                placeHolder='Nhập địa điểm muốn đi'
                                                errorStyle='w-70'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex mt-2'>
                                        <div className='block w-1/3 px-1 flex-none'>
                                            <HDatePicker
                                                value={fromDateAdd}
                                                field={"Ngày đi"}
                                                minDate={moment().add(7, "days").toDate()}
                                                maxDate={moment()
                                                    .add(1, "years")
                                                    .toDate()}
                                                onChangeValue={handleCheckInDate}
                                                error={fromError}
                                                errorStyle='w-70'
                                                className='h-[3.5rem] w-full rounded-md border border-gray-300 cursor-pointer  '
                                            />
                                            {/* {nameAdd && checkError && <p className='text-danger-500'>Sai</p>} */}
                                        </div>
                                        <div className='block w-1/3 px-1 flex-none'>
                                            <HDatePicker
                                                value={toDateUpAdd}
                                                field={"Ngày về"}
                                                minDate={
                                                    fromDateAdd === null
                                                        ? moment().add(8, "days").toDate()
                                                        : moment(fromDateAdd)
                                                            .add(1, "days")
                                                            .toDate()
                                                }
                                                maxDate={moment()
                                                    .add(1, "years")
                                                    .toDate()}
                                                onChangeValue={handleCheckOutDate}
                                                error={toError}
                                                errorStyle='w-70'
                                                className='h-[3.5rem] w-full rounded-md border border-gray-300 cursor-pointer  '
                                            />
                                        </div>
                                        <div className='block w-1/3 px-1 flex-none'>
                                            <InputByType
                                                field={"Số người"}
                                                onChangeValue={(value) =>
                                                    setNumberAdd(value)
                                                }
                                                type='number'
                                                error={numberError}
                                                placeHolder='Totals Person'
                                                errorStyle='w-70'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='mt-2 space-x-4'>
                                        <div className='block'>
                                            <label>Chú thích</label>
                                            <textarea
                                                onChange={(e) => {
                                                    setNoteAdd(e.target.value);
                                                }}
                                                className='w-full mt-2 rounded-md border-gray-300 min-h-[8rem]'
                                                placeholder='Điền chú thích'></textarea>
                                            {noteError && noteError.trim() !== "" && (
                                                <p className='text-danger-500'>
                                                    {noteError}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex mt-2'>
                                        <button
                                            onClick={() => sendStatement()}
                                            className={`rounded-md px-6 text-sm font-medium bg-danger-500  hover:bg-danger-600 h-12 ml-auto`}>
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </BusinessLayout>
        </>
    );
};

const CompanyRow = ({ data, fields }) => {
    const [company, setCompany] = React.useState(data);
    const [openModal, setOpenModal] = React.useState(false);
    const [openModals, setOpenModals] = React.useState(false);
    // const [rejectMessage, setRejectMessage] = React.useState("");
    const [idUpdate, setIdUpdate] = React.useState("");
    const [nameUpdate, setNameUpdate] = React.useState("");
    const [noteUpdate, setNoteUpdate] = React.useState("");
    const [locationUpdate, setLocationUpdate] = React.useState("");
    const [numberUpdate, setNumberUpdate] = React.useState("");
    const [fromDateUpdate, setFromDateUpdate] = React.useState(
        fomatDateTravel(company.fromDate) || ""
    );
    const [toDateUpdate, setToDateUpdate] = React.useState(
        fomatDateTravel(company.toDate) || ""
    );
    const [nameError, setNameError] = React.useState("");
    const [noteError, setNoteError] = React.useState("");
    const [locationError, setLocationError] = React.useState("");
    const [numberError, setNumberError] = React.useState("");
    const [fromError, setFromError] = React.useState("");
    const [toError, setToError] = React.useState("");
    const ref = useClickOutside(setOpenModal);

    // Lấy ngày hiện tại
    const currentDate = new Date();
    const dateAfter7Days = addDays(currentDate, 6);

    const isAfter7Days = isAfter(dateAfter7Days, fomatDateTravel(company.fromDate));

    // const changeStatusTo = (status) => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    //     console.log("id", company.id);
    //     const id = data.id || '';
    //     var raw = new URLSearchParams({
    //         id,
    //         status,
    //     }).toString();

    //     var requestOptions = {
    //         method: "PUT",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow",
    //     };

    //     callRequest(`travel-statement/change-status?${raw}`, requestOptions)
    //         .then((response) => {
    //             alert(response.message);
    //             setOpenModal(false);
    //         })
    //         .catch((response) => {
    //             if (response.status === 400 && response?.data?.rejectMessage) {
    //                 return;
    //             }
    //             alert(response.message);
    //         });
    // };
    // console.log("update", numberUpdate);
    const handleCheckInDate = (date) => {
        setFromDateUpdate(date);
        setToDateUpdate(null);
    };

    const handleCheckOutDate = (date) => {
        setToDateUpdate(date);
    };

    const SetErrorDefault = () => {
        setNameError("");
        setFromError("");
        setToError("");
        setLocationError("");
        setNumberError("");
        setNoteError("");
    };

    const setValueBeforeUpdate = () => {
        setFromDateUpdate(fomatDateTravel(company.fromDate));
        setToDateUpdate(fomatDateTravel(company.toDate));
        setNameUpdate(company.name);
        setNumberUpdate(company.numberOfPeople);
        setLocationUpdate(company.location);
        setNoteUpdate(company.note);
    };

    const SetOutSideClick = () => {
        setOpenModal(false);
        SetErrorDefault();
        setValueBeforeUpdate();
    };

    const changeStatusTo = (status) => {
        if (status == "CANCELED") {
            setValueBeforeUpdate();
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        var raw = JSON.stringify({
            id: company.id,
            status,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest(`travel-statement/change-status`, requestOptions)
            .then((response) => {
                setCompany(response.data);
                alert(response.message);
                setOpenModal(false);
            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    return;
                }
                alert(response.message);
            });
    };

    const changeInfoStatement = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            id: company.id,
            name: nameUpdate || company.name,
            numberOfPeople: numberUpdate || company.numberOfPeople,
            location: locationUpdate || company.location,
            note: noteUpdate || company.note,
            fromDate:
                moment(fromDateUpdate).format("HH:mm DD/MM/YYYY") || company.fromDate,
            toDate: moment(toDateUpdate).format("HH:mm DD/MM/YYYY") || company.toDate,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("travel-statement/business-member/update", requestOptions)
            .then((response) => {
                setCompany(response.data);
                alert(response.message);
                setOpenModal(false);
                SetErrorDefault();
            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    return;
                }
                if (response.message === null) {
                    setNameError(response.data["name"]);
                    setFromError(response.data["fromDate"]);
                    setToError(response.data["toDate"]);
                    setLocationError(response.data["location"]);
                    setNumberError(response.data["numberOfPeople"]);
                    setNoteError(response.data["note"]);
                } else {
                    setNumberError(response.message);
                }
            });
    };
    return (
        <tr className='border-t border-gray-200 hover:bg-gray-100'>
            {fields &&
                fields.map((field, index) => {
                    if (field.availableValues) {
                        const x = company[field.value];
                        console.log("company", company);
                        console.log("x", x);
                        const element = field.availableValues[x]?.element;
                        if (element) {
                            return (
                                <td
                                    key={index}
                                    className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
                                        }`}>
                                    {element}
                                </td>
                            );
                        }
                    }
                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
                                }`}>
                            {company[field.value]}
                        </td>
                    );
                })}
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    {(company.status === "APPROVED" ||
                        company.status === "REJECTED" ||
                        company.status === "CANCELED") && (
                            <button
                                onClick={() => setOpenModal(true)}
                                className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                                Chi tiết
                            </button>
                        )}
                </div>
            </td>
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    {company.status === "PENDING" && (
                        <button
                            onClick={() => setOpenModal(true)}
                            className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                            Cập nhật
                        </button>
                    )}
                    {company.status === "APPROVED" && company.bookingRequest && (
                        <a
                            href={`/detail/${company.bookingRequest.id}`}
                            className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                            Thông tin nhà
                        </a>
                    )}
                    {company.status === "APPROVED" && company.bookingRequest === null && isAfter7Days && (
                        <button
                            className='rounded-md py-2 text-sm font-medium bg-red-500 !text-white hover:bg-red-600 block text-center w-full'>
                            Hết hạn
                        </button>
                    )}
                    {company.status === "APPROVED" && company.bookingRequest === null && !isAfter7Days && (
                        <button
                        className='rounded-md py-2 text-sm font-medium bg-amber-500 !text-white hover:bg-amber-600 block text-center w-full'>
                        Đợi phòng
                    </button>
                    )}
                </div>
                {openModal && (
                    <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                        <div
                            className={`absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 ${company.status === "REJECTED" ? "top-1" : "top-20"
                                }`}>
                            <div className='px-4 pt-4 flex'>
                                <button
                                    onClick={() => SetOutSideClick()}
                                    className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                                    <CloseRoundedIcon fontSize='8' />
                                </button>
                            </div>
                            <div className='px-8 pb-4'>
                                <div className='flex mt-2'>
                                    <div className='block flex-none w-1/2 pr-1 '>
                                        <Input
                                            field={"Chủ đề đơn"}
                                            required
                                            error={nameError}
                                            onChangeValue={(value) => setNameUpdate(value)}
                                            text={company.name}
                                            editable={
                                                company.status !== "APPROVED" &&
                                                company.status !== "REJECTED"
                                            }></Input>
                                    </div>
                                    <div className='block flex-none w-1/2 pl-1'>
                                        <Input
                                            field={"Địa điểm"}
                                            required
                                            error={locationError}
                                            onChangeValue={(value) =>
                                                setLocationUpdate(value)
                                            }
                                            text={company.location}
                                            editable={
                                                company.status !== "APPROVED" &&
                                                company.status !== "REJECTED" &&
                                                company.status !== "CANCELED"
                                            }></Input>
                                    </div>
                                </div>
                                <div className='flex mt-2 '>
                                    <div className='block flex-none w-1/3 px-1'>
                                        <HDatePicker
                                            value={fromDateUpdate}
                                            editable={
                                                company.status == "APPROVED" ||
                                                company.status == "REJECTED" ||
                                                company.status == "CANCELED"
                                            }
                                            field={"Ngày đi"}
                                            minDate={moment().add(7, "days").toDate()}
                                            maxDate={moment().add(1, "years").toDate()}
                                            onChangeValue={handleCheckInDate}
                                            error={fromError}
                                            errorStyle='w-70'
                                            className='h-[3.5rem] w-full rounded-md border border-gray-300 cursor-pointer  '
                                        />
                                    </div>
                                    <div className='block flex-none  w-1/3 px-1'>
                                        <HDatePicker
                                            value={toDateUpdate}
                                            editable={
                                                company.status == "APPROVED" ||
                                                company.status == "REJECTED" ||
                                                company.status == "CANCELED"
                                            }
                                            field={"Ngày về"}
                                            minDate={
                                                fromDateUpdate === null
                                                    ? moment().add(8, "days").toDate()
                                                    : moment(fromDateUpdate)
                                                        .add(1, "days")
                                                        .toDate()
                                            }
                                            maxDate={moment().add(1, "years").toDate()}
                                            onChangeValue={handleCheckOutDate}
                                            error={toError}
                                            errorStyle='w-70'
                                            className='h-[3.5rem] w-full rounded-md border border-gray-300 cursor-pointer  '
                                        />
                                    </div>
                                    <div className='block flex-none  w-1/3 px-1'>
                                        <InputByType
                                            field={"Số người"}
                                            required
                                            error={numberError}
                                            onChangeValue={(value) => setNumberUpdate(value)}
                                            type='number'
                                            text={company.numberOfPeople}
                                            editable={
                                                company.status !== "APPROVED" &&
                                                company.status !== "REJECTED"
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='mt-2 space-x-4'>
                                    <div className='block'>
                                        <label>Chú thích</label>
                                        <textarea
                                            onChange={(e) => {
                                                setNoteUpdate(e.target.value);
                                            }}
                                            className='w-full mt-2 rounded-md border-gray-300  min-h-[8rem]'
                                            placeholder='Điền chú thích'
                                            readOnly={
                                                company.status === "APPROVED" ||
                                                company.status === "REJECTED"
                                            }>
                                            {company.note}
                                        </textarea>
                                        {noteError && noteError.trim() !== "" && (
                                            <p className='text-danger-500'>{noteError}</p>
                                        )}
                                    </div>
                                </div>
                                {company.status === "REJECTED" && (
                                    <div className='mt-2 space-x-4'>
                                        <div className='block'>
                                            <label>Lý do từ chối</label>
                                            <textarea
                                                className='w-full mt-2 rounded-md border-gray-300 min-h-[8rem]'
                                                placeholder='Reject Message'
                                                readOnly={true}>
                                                {company.rejectMessage}
                                            </textarea>
                                        </div>
                                    </div>
                                )}
                                <div className='flex mt-2'>
                                    {company.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() => changeStatusTo("CANCELED")}
                                                className='rounded-md px-6 text-sm font-medium bg-red-500 !text-white hover:bg-red-600 h-12 ml-auto'>
                                                Hủy Đơn
                                            </button>
                                            <button
                                                onClick={() => changeInfoStatement()}
                                                className='rounded-md px-6 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 h-12 ml-1 '>
                                                Cập nhật
                                            </button>
                                        </>
                                    )}
                                    {(company.status === "REJECTED" ||
                                        company.status === "APPROVED" ||
                                        company.status === "CANCELED") && (
                                            <button
                                                onClick={() => setOpenModal(false)}
                                                className='rounded-md px-6 text-sm font-medium bg-danger-500 !text-white hover:bg-indigo-600 h-12 ml-auto'>
                                                Đóng
                                            </button>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};
