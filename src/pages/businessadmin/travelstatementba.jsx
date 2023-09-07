import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { Paging } from "../../components/AdminComponents/Paging";
// import Input from "../base/input";
import { useNavigate } from "react-router-dom";
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
    useQueryParameters,
} from "../../CustomHooks/hooks";
import { fomatDateBooking, fomatDateTravel, fomatDates } from "../../common/regex";
import InputByType from "../../components/base/InputByType";
import { TableHeader } from "../../components/base/TableHeader";
import Input from "../../components/base/input";
import { useAuth } from "../../context/Auth";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import BusinessLayout from "../business/BusinessLayout";
import { format, addDays, isAfter } from 'date-fns';
// import { AdminLayout } from "../AdminLayout";

export const Travelstatementba = () => {
    const [user, isLogin, isAuthorized] = useAuth("BUSINESS_ADMIN");
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
            value: "name",
            text: "Chủ đề",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "user.username",
            text: "Người làm đơn",
            criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
        },
        {
            value: "user.roles",
            text: "Chức vụ",
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
                            {"Cập nhật"}
                        </label>
                    ),
                },
                PENDING: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                            {"Đang chờ"}
                        </label>
                    ),
                },
                CANCELED: {
                    element: (
                        <label
                            className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
                            {"Đã hủy"}
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

        callRequest("travel-statement/business-admin", requestOptions)
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
    const [company, setCompany] = React.useState();
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
            })
            .catch((response) => console.log(response));
    };

    useEffectOnce(() => {
        getCompanyInfo();
    });

    return (
        <BusinessLayout company={company}>
            <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
                <p className='text-3xl font-bold'>Quản lý đơn</p>
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
                                <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                                {/* <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                                {/* <th className='h-16 w-[6rem] px-4 text-black'></th> */}
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
    const [openModalReject, setOpenModalReject] = React.useState(false);
    const [latitude, setLatitude] = React.useState("");
    const [longitude, setLongitude] = React.useState("");
    const navigation = useNavigate();
     // Lấy ngày hiện tại
     const currentDate = new Date();
     const dateAfter7Days = addDays(currentDate, 6);

    const isAfter7Days = isAfter(dateAfter7Days, fomatDateTravel(company.fromDate));

    // if(company.id === 44)
    // {
    //     console.log("id",company.id);
    //     console.log("Check",isAfter7Days);
    // }

    // const ref = useClickOutside(setOpenModal);
    const refs = useClickOutside(setOpenModalReject);
    const queryParams = useQueryParameters();

    const homeTypes = ["HOUSE", "APARTMENT", "HOTEL"];

    const changeStatusTo = (status) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        var raw = JSON.stringify({
            id: company.id,
            status,
            rejectMessage,
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
                setOpenModalReject(false);
            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    setRejectMessageError(response.data.rejectMessage);
                    return;
                }
                alert(response.message);
            });
    };

    const searchLocationByName = (location) => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        const endpoint = "mapbox.places";

        fetch(
            `https://api.mapbox.com/geocoding/v5/${endpoint}/${location}.json?access_token=${TOKEN}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                if (result.features && result.features.length > 0) {
                    // Lấy thông tin vị trí đầu tiên trong danh sách kết quả (chỉ lấy vị trí đầu tiên)
                    const firstLocation = result.features[0];
                    const { geometry } = firstLocation;

                    // Lấy latitude và longitude từ trường coordinates
                    setLatitude(geometry.coordinates[1]); // Vĩ độ
                    setLongitude(geometry.coordinates[0]); // Kinh độ

                    console.log("Latitude:", latitude);
                    console.log("Longitude:", longitude);
                }
            })
            .catch((error) => console.log("error", error));
    };
    useEffectOnce(() => searchLocationByName(company.location));

    const updateUrl = () => {
        const params = {
            views: [],
            types: homeTypes,
            amenities: [],
            fromPrice: 0,
            toPrice: 500_000_000,
            fromDate: fomatDateBooking(company.fromDate),
            toDate: fomatDateBooking(company.toDate),
            totalRooms: 0,
            lng: longitude,
            lat: latitude,
            range: 50,
            statement: company.id,
            locationName: company.location,
        };
        const queryParams = strings.toQuery(params);
        navigation(`/${queryParams}`);
        // window.history.replaceState(null, "Home Page", strings.toQuery(params));
        // console.log("check",strings.toQuery(params));
    };

    const TOKEN =
        "pk.eyJ1IjoiaG9tZTJzdGF5IiwiYSI6ImNsazl2anNmNjAxMWEzam8zajAxMzVneWYifQ.q3kU4RqNM7EnbCCaNDC6Gw";

    return (
        <tr className='border-t border-gray-200 hover:bg-gray-100'>
            {fields.map((field, index) => {
                // console.log("field", company[field.value]);
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
                if (field.value === "user.username") {
                    // Access the nested 'user.username' property from the 'company' object
                    const username = company.user?.username || ""; // Use optional chaining to handle undefined properties

                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${
                                index === 0 ? "px-8" : "px-4"
                            }`}>
                            {username}
                        </td>
                    );
                } else if (field.value === "user.roles") {
                    // Access the nested 'user.username' property from the 'company' object
                    const username = company.user?.roles || ""; // Use optional chaining to handle undefined properties
                    const roles = username.includes("BUSINESS_MEMBER") ? "Nhân viên" : "Quản lý";
                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${
                                index === 0 ? "px-8" : "px-2"
                            }`}>
                            {roles}
                        </td>
                    );
                } else if (field.value === "createdAt") {
                    // Access the nested 'user.username' property from the 'company' object
                    const createDate = company.createdAt || ""; // Use optional chaining to handle undefined properties

                    return (
                        <td
                            key={index}
                            className={`h-[64px] overflow-hidden text-black ${
                                index === 0 ? "px-8" : "px-2"
                            }`}>
                            {createDate}
                        </td>
                    );
                }
                return (
                    <td
                        key={index}
                        className={`h-[64px] overflow-hidden text-black ${
                            index === 0 ? "px-8" : "px-4"
                        }`}>
                        {data[field.value]}
                    </td>
                );
            })}
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    <button
                        onClick={() => setOpenModal(true)}
                        className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                        Chi tiết
                    </button>
                </div>
            </td>
            <td className='h-[64px] py-2'>
                <div className='px-2'>
                    {company.status === "APPROVED" && company.bookingRequest == null && isAfter7Days && (
                        <button
                            className='rounded-md py-2 text-sm font-medium bg-red-500 !text-white hover:bg-red-600 block text-center w-full'>
                            Hết hạn
                        </button>)
                    }
                    {company.status === "APPROVED" && company.bookingRequest == null && !isAfter7Days && (
                        <button
                            onClick={() => updateUrl()}
                            className='rounded-md py-2 text-sm font-medium bg-success-500 !text-white hover:bg-success-600 block text-center w-full'>
                            Đặt phòng
                        </button>
                    )}
                    {company.bookingRequest && company.status === "APPROVED" && (
                        <a
                            href={`/detail/${company.bookingRequest.id}`}
                            className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                            Thông tin nhà
                        </a>
                    )}
                </div>
                {openModal && (
                <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                    <div className='absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 top-1/4'>
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
                                        text={fomatDates(company.fromDate)}
                                        editable={false}
                                    />
                                </div>
                                <div className='block flex-none w-1/2 pl-1'>
                                    <label>Ngày về </label>
                                    <InputByType
                                        type='date'
                                        text={fomatDates(company.toDate)}
                                        editable={false}
                                    />
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <div className='block flex-none w-1/3 px-1'>
                                    <label>Chủ đề đơn</label>
                                    <Input text={company.name} editable={false}></Input>
                                </div>
                                <div className='block flex-none w-1/3 px-1'>
                                    <label>Số người</label>
                                    <InputByType
                                        type='number'
                                        text={company.numberOfPeople}
                                        editable={false}
                                    />
                                </div>
                                <div className='block flex-none w-1/3 px-1'>
                                    <label>Địa điểm</label>
                                    <Input
                                        text={company.location}
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
                                        {company.note}
                                    </textarea>
                                </div>
                            </div>

                            <div className='flex mt-2'>
                                {company.status === "PENDING" ? (
                                    <>
                                        <button
                                            onClick={() => setOpenModalReject(true)}
                                            className='rounded-md px-6 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 h-12 ml-auto'>
                                            Từ chối
                                        </button>
                                        <button
                                            onClick={() => changeStatusTo("APPROVED")}
                                            className='rounded-md px-6 text-sm font-medium bg-success-500 text-white hover:bg-success-600 ml-1'>
                                            Chấp nhận
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setOpenModal(false)}
                                        className='rounded-md px-6 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 h-12 ml-auto'>
                                        Đóng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {openModalReject && (
                <div className='fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10'>
                    <div
                        className='absolute bg-white rounded-md shadow-lg left-1/2 -translate-x-1/2 top-1/3'
                        ref={refs}>
                        <div className='px-4 pt-4 flex'>
                            <button
                                onClick={() => setOpenModalReject(false)}
                                className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                                <CloseRoundedIcon fontSize='8' />
                            </button>
                        </div>
                        <div className='px-8 pb-4'>
                            <label className='block'>Lý do từ chối</label>
                            <textarea
                                onChange={(e) => {
                                    setRejectMessage(e.target.value);
                                }}
                                className='w-96 mt-2 rounded-md border-gray-300 min-h-[8rem]'
                                placeholder='Nhập lý do từ chối'>
                                {rejectMessage}
                            </textarea>
                            <div className='flex mt-2'>
                                <button
                                    onClick={() => changeStatusTo("REJECTED")}
                                    className='rounded-md px-6 text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 h-12 ml-auto'>
                                    Từ chối
                                </button>
                            </div>
                            {strings.isNotBlank(rejectMessageError) && (
                                <p className='text-danger-500'>{rejectMessageError}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </td>
        </tr>
    );
};
