import LocationOnIcon from "@mui/icons-material/LocationOn";
import moment from "moment/moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCallbackState,
    useEffectOnce,
    usePageVisibility,
    useQueryParameters,
} from "../../../CustomHooks/hooks";
import { Spinner } from "../../../components/base/Animations";
import { RateStars } from "../../../components/base/RateStars";
import Input from "../../../components/base/input";
import { useAuth } from "../../../context/Auth";
import { useWindowSize } from "../../../context/BrowserContext";
import { browsers } from "../../../utils/browsers";
import { HTMLNodes } from "../../../utils/elements";
import { lists } from "../../../utils/lists";
import { callRequest } from "../../../utils/requests";
import { strings } from "../../../utils/strings";
import { daysBetween } from "../../../utils/times";
import { Modal } from "./../../../components/base/Modal";
import { XContentEditable } from "./../../../components/base/XContentEditable";

function extractDateFromQuery(query, key) {
    const value = query[key];
    if (strings.isBlank(value)) {
        return null;
    }
    try {
        return moment(value, "DD/MM/YYYY").toDate();
    } catch (error) {
        return null;
    }
}

export const DetailBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, ,] = useAuth(["CUSTOMER", "BUSINESS_ADMIN"]);

    const params = useQueryParameters();
    if (
        id == null ||
        strings.isBlank(params.fromDate) ||
        strings.isBlank(params.toDate) ||
        strings.isBlank(params.choose)
    ) {
        navigate(-1);
    }

    const fromDate = extractDateFromQuery(params, "fromDate");
    const toDate = extractDateFromQuery(params, "toDate");

    const maxDate = moment().add(1, "years");
    if (
        fromDate == null ||
        toDate == null ||
        maxDate.isBefore(moment(fromDate) || maxDate.isBefore(moment(toDate)))
    ) {
        navigate(-1);
    }

    const [homeStay, setHomeStay] = React.useState();
    const [loadInfo, setLoadInfo] = React.useState(false);

    const roomsToBook = JSON.parse(params.choose);
    const dateDiff = daysBetween(fromDate, toDate);
    const totalPrice = lists.sumOf(
        roomsToBook,
        (room) => room.totalBooked * room.discountedPrice
    );

    const [bookingIdRef, setBookingId] = useCallbackState();
    const [urlParamsRef, setUrlParams] = useCallbackState();
    const [openModal, setOpenModal] = React.useState(false);

    const [contactNumberRef, setContactNumber] = useCallbackState("");
    const [contactNumberError, setContactNumberError] = React.useState("");

    const [noteRef, setNote] = useCallbackState("");
    const [noteError, setNoteError] = React.useState("");

    const [contactNameRef, setContactName] = useCallbackState();
    const [contactNameError, setContactNameError] = React.useState("");

    useEffectOnce(() => {
        const getHomestayDetail = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(`accommodation?id=${id}`, requestOptions)
                .then((response) => {
                    setHomeStay(response.data);
                })
                .catch((error) => {
                    if (error.status === 404) {
                        navigate("/");
                    }
                    console.log("error", error);
                });
        };

        const getStatementUserName = (statementId) => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(
                statementId
                    ? `user/book-info?statementId=${statementId}`
                    : `user/book-info`,
                requestOptions
            )
                .then((response) => {
                    setContactName(response.data.username);
                    if (response.data.phone) {
                        setContactNumber(strings.phoneWoRegion(response.data.phone));
                    }
                    console.log("Loaded");
                    setLoadInfo(true);
                })
                .catch((error) => {
                    if (error.status === 500) {
                        alert("Đã có lỗi xảy ra, xin hãy thử lại.");
                        console.log("Loaded");
                        setLoadInfo(true);
                        return;
                    }
                    alert("Bạn hiện không thể đặt phòng");
                    navigate(-1);
                })
                .finally(() => {
                    console.log("Loaded");
                    setLoadInfo(true);
                });
        };

        getStatementUserName(params.statement);
        getHomestayDetail();
        clearLastBooking();
    }, [user != null]);

    const openInNewTab = (url) => {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const bookAccommodation = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        myHeaders.append("X-FROM", process.env.REACT_APP_FE_PATH);

        var raw = JSON.stringify({
            fromDate: moment(fromDate).format("HH:mm DD/MM/YYYY"),
            toDate: moment(toDate).format("HH:mm DD/MM/YYYY"),
            phone: contactNumberRef.current,
            contact: contactNameRef.current,
            note: noteRef.current,
            statement: params.statement,
            details: roomsToBook.map((room) => ({
                roomId: room.id,
                totalRooms: room.totalBooked,
            })),
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("accommodation/book", requestOptions)
            .then((response) => {
                setContactNumberError(null);
                setContactNameError(null);
                setNoteError(null);
                openInNewTab(response.data.request.url);
                setBookingId(response.data.id);
                localStorage.setItem("B-ID", response.data.id);
                const params = {};
                new URLSearchParams(response.data.request.url).forEach((value, key) => {
                    params[key] = value;
                });
                setUrlParams(params);
                setOpenModal(true);
            })
            .catch((error) => {
                if (error.status === 400) {
                    setContactNumberError(error.data?.phone ?? "");
                    setContactNameError(error.data?.contact ?? "");
                    setNoteError(error.data?.note ?? "");
                    if (error.data?.details) {
                        alert(error.data?.details);
                        return;
                    }
                    if (error.message) {
                        alert(error.message);
                    }
                    return;
                }
                if (error.status === 403) {
                    alert(error.message);
                    navigate(-1);
                    return;
                }
                alert(error.message);
            });
    };

    React.useEffect(() => {
        const interval = setInterval(() => waitingPaymentSucceed(), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const isDisplaying = usePageVisibility();

    const waitingPaymentSucceed = () => {
        if (localStorage.getItem("booked-succeed") === "true") {
            return;
        }
        if (!urlParamsRef.current) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            orderId: urlParamsRef.current["vnp_TxnRef"],
            transactionDate: urlParamsRef.current["vnp_CreateDate"],
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        const bookingId = localStorage.getItem("B-ID");

        callRequest("payment/status", requestOptions)
            .then(async (response) => {
                const status = response.data;
                if (status === "PENDING") {
                    return;
                }
                if (status === "SUCCEED") {
                    alert("Đặt phòng thành công");
                    localStorage.setItem("booked-succeed", "true");
                    if (isDisplaying) {
                        await browsers.delay(1000);
                        localStorage.removeItem("booking-items");
                        localStorage.removeItem("booked-succeed");
                        localStorage.removeItem("B-ID");
                        browsers.stopGoBack();
                        navigate(`/detail/${bookingIdRef.current}`, { replace: true });
                    }
                    return;
                } else {
                    if (bookingId === localStorage.getItem("B-ID")) {
                        alert("Đặt phòng thất bại. Xin hãy thử lại.");
                        setUrlParams();
                        setOpenModal(false);
                    }
                }
            })
            .catch((error) => console.log("error", error));
    };

    const [roomDetails, setRoomDetails] = React.useState();

    const size = useWindowSize();
    React.useEffect(() => {
        try {
            setRoomDetails(
                <RoomDetails
                    rooms={JSON.parse(localStorage.getItem("booking-items"))}
                    loadInfo={loadInfo}
                    openModal={openModal}
                />
            );
        } catch (error) {
            navigate(-1);
        }
    }, [
        size.isLargerThan("lg"),
        loadInfo,
        openModal,
        contactNameError,
        noteError,
        contactNumberError,
    ]);

    return (
        <div className='p-4 sm:p-12 m-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-[max-content_1fr] gap-3'>
                <div className='flex flex-col gap-3 w-full lg:w-[28rem]'>
                    {homeStay && (
                        <div className='border border-gray-200 p-4 rounded-md'>
                            <h2 className='text-lg font-bold'>{homeStay.name}</h2>
                            {homeStay.rate && (
                                <div className='flex gap-2 items-center'>
                                    <RateStars rate={homeStay.rate} />
                                    <h4 className='text-sm'>{homeStay.rate}</h4>
                                    <h4 className='text-sm'>
                                        {homeStay.totalReviews} đánh giá
                                    </h4>
                                </div>
                            )}
                            <div className='flex items-center mt-2'>
                                <LocationOnIcon className='text-gray-500' />
                                <h2 className=''>{homeStay.address}</h2>
                            </div>
                            <div className='flex flex-wrap gap-2 mt-3'>
                                {(homeStay.amenities || [])
                                    .slice(0, 10)
                                    .map((amenity, index) => (
                                        <div
                                            className='flex gap-2 items-center'
                                            key={index}>
                                            <img
                                                src={amenity.image}
                                                alt=''
                                                className='w-[0.875rem] h-[0.875rem] object-cover'
                                            />
                                            <h4 className='block text-[0.8rem]'>
                                                {amenity.name}
                                            </h4>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                    {size.isSmallerThan("lg") && roomDetails}

                    <div className='border border-gray-200 p-4 rounded-md'>
                        <h2 className='text-lg font-bold mb-3'>Chi tiết đặt phòng</h2>
                        <div className='flex'>
                            <div className=''>
                                <h5 className='font-semibold text-sm'>Check-in lúc</h5>
                                <div className='border-r border-gray-200 mr-4 pr-4'>
                                    <h2 className='font-bold text-sm'>
                                        {timeOf(fromDate)}
                                    </h2>
                                    <h2 className='text-[0.75rem]'>12:00</h2>
                                </div>
                            </div>
                            <div className=''>
                                <h5 className='font-semibold text-sm'>Check-out lúc</h5>
                                <div className=''>
                                    <h2 className='font-bold text-sm'>
                                        {timeOf(toDate)}
                                    </h2>
                                    <h2 className='text-[0.75rem]'>12:00</h2>
                                </div>
                            </div>
                        </div>
                        <h3 className='mt-3'>
                            Thời gian ở:{" "}
                            <span className='font-bold'>
                                {" "}
                                {dateDiff === 1 ? "1 đêm" : `${dateDiff} đêm`}
                            </span>
                        </h3>
                    </div>

                    <div className='border border-gray-200 rounded-md'>
                        <div className='p-4'>
                            <h2 className='text-lg font-bold mb-3'>Biểu giá</h2>
                            <div className='flex'>
                                <h5 className=''>Giá gốc</h5>
                                <h5 className='ml-auto'>
                                    {strings.toMoney(
                                        lists.sumOf(
                                            roomsToBook,
                                            (room) =>
                                                room.totalBooked * room.originalPrice
                                        )
                                    )}
                                </h5>
                            </div>
                            <div className='flex'>
                                <h5 className=''>Khuyến mãi</h5>
                                <h5 className='ml-auto'>
                                    {"- "}
                                    {strings.toMoney(
                                        lists.sumOf(
                                            roomsToBook,
                                            (room) =>
                                                room.totalBooked *
                                                (room.originalPrice -
                                                    room.discountedPrice)
                                        )
                                    )}
                                </h5>
                            </div>
                            {user?.roles.includes("BUSINESS_ADMIN") && (
                                <div className='flex'>
                                    <h5 className=''>Khuyến mãi doanh nghiệp (5%)</h5>
                                    <h5 className='ml-auto'>
                                        {"- "}
                                        {strings.toMoney(totalPrice * 0.05)}
                                    </h5>
                                </div>
                            )}
                            <div className='flex'>
                                <h5 className=''>Thuế VAT (8%)</h5>
                                <h5 className='ml-auto'>
                                    {"+ "}
                                    {strings.toMoney(totalPrice * 0.08)}
                                </h5>
                            </div>
                        </div>
                        <div className='flex bg-primary-100 p-4'>
                            <h2 className='text-lg font-bold'>Thành tiền</h2>
                            <div className='ml-auto text-right'>
                                <h2 className='text-lg font-bold'>
                                    {strings.toMoney(calculateTotalPriceToPay())}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className='border border-gray-200 rounded-md p-4'>
                        <h2 className='text-lg font-bold mb-3'>Số tiền để huỷ phòng?</h2>
                        <div className='flex'>
                            <h5 className='text-sm'>
                                Trước 00:00 ngày{" "}
                                {moment(fromDate, "HH:mm DD/MM/YYYY")
                                    .add(-3, "days")
                                    .format("DD MMM YYYY")}
                            </h5>
                            <h5 className='text-orange-500 ml-auto'>
                                {strings.toMoney(calculateTotalPriceToPay() * 0.2)}
                            </h5>
                        </div>
                        <div className='flex'>
                            <h5 className='text-sm'>
                                Sau 00:00 ngày{" "}
                                {moment(fromDate, "HH:mm DD/MM/YYYY")
                                    .add(-3, "days")
                                    .format("DD MMM YYYY")}
                            </h5>
                            <h5 className='text-orange-500 ml-auto'>
                                {strings.toMoney(calculateTotalPriceToPay())}
                            </h5>
                        </div>
                    </div>
                    {size.isSmallerThan("lg") && loadInfo && <UserInputs />}
                </div>
                {size.isLargerThan("lg") && loadInfo && roomDetails}
            </div>
        </div>
    );

    function RoomDetails({ rooms, loadInfo, openModal }) {
        return (
            <div className='flex flex-col gap-3 overflow-hidden'>
                {(rooms || []).map((room, idx) => (
                    <div
                        key={idx}
                        className='border border-gray-200 p-4 rounded-md flex flex-col'>
                        <h2 className='font-bold text-xl'>{room.name}</h2>

                        <div className='flex gap-2 flex-col mt-3 text-medium pt-3 border-t border-gray-200'>
                            {room.properties
                                .filter((x) => x.type === "AMENITY")
                                .slice(0, 10)
                                .map((property, index) => (
                                    <h4 className='block text-sm' key={index}>
                                        <HTMLNodes
                                            rawHTML={property.value}
                                            className=''
                                        />
                                    </h4>
                                ))}

                            {(room.properties || [])
                                .filter((x) => x.type === "ROOM")
                                .filter((x) => x.value).length > 0 && (
                                <h4 className='py-1 px-2 bg-success-200 text-success-800 rounded-md w-fit text-sm'>
                                    {`Phù hợp với ${room.properties
                                        .filter((x) => x.type === "ROOM")
                                        .filter((x) => x.value)
                                        .map((x) => x.value)
                                        .join(", ")}`}
                                </h4>
                            )}
                        </div>
                        <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200'>
                            {(room.amenities || []).slice(0, 20).map((amenity, index) => (
                                <div className='flex gap-2 items-center' key={index}>
                                    <img
                                        src={amenity.image}
                                        alt=''
                                        className='w-[0.875rem] h-[0.875rem] object-cover'
                                    />
                                    <h4 className='block text-[0.8rem]'>
                                        {amenity.name}
                                    </h4>
                                </div>
                            ))}
                        </div>
                        <div className='flex overflow-x-auto gap-2 mt-3 pt-3 border-t border-gray-200 w-full'>
                            {room.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt=''
                                    className='min-w-[8rem] h-20 object-cover rounded-md cursor-pointer hover:brightness-75'
                                />
                            ))}
                        </div>
                        <div className='mt-4 border-t pt-4'>
                            <h4 className='font-2xl'>
                                Số phòng đặt:{" "}
                                <span className='font-bold'>{room.totalBooked}</span>
                            </h4>
                            <h4 className='font-2xl'>
                                Số tiền:
                                <span className='ml-2 font-bold text-black line-through'>
                                    {strings.toMoney(
                                        room.totalBooked * room.originalPrice
                                    )}
                                </span>
                                {room.originalPrice > room.discountedPrice && (
                                    <span className='ml-2 font-bold text-orange-500'>
                                        {strings.toMoney(
                                            room.totalBooked * room.discountedPrice
                                        )}
                                    </span>
                                )}
                            </h4>
                        </div>
                    </div>
                ))}
                {size.isLargerThan("lg") && loadInfo && (
                    <UserInputs openModal={openModal} />
                )}
            </div>
        );
    }

    function UserInputs({ openModal }) {
        return (
            <div className='border border-gray-200 rounded-md p-4'>
                <h2 className='text-lg font-bold mb-3'>Nhập thông tin liên hệ</h2>
                <div className='lg:max-w-[36rem] w-full'>
                    {
                        <Input
                            required
                            field={"Tên liên hệ"}
                            text={contactNameRef.current}
                            onChangeValue={setContactName}
                            error={contactNameError}
                            inputClassName='w-full mt-2'
                            className='w-full'
                        />
                    }
                    {
                        <Input
                            required
                            field={"Số điện thoại liên hệ"}
                            text={contactNumberRef.current}
                            onChangeValue={setContactNumber}
                            error={contactNumberError}
                            inputClassName='w-full mt-2'
                            className='mt-3 w-full'
                        />
                    }
                    <label className='block mt-2 mb-2'>Ghi chú cho quản lí nhà</label>
                    <XContentEditable
                        error={noteError}
                        maxLength={400}
                        onChange={setNote}
                        className='w-full'
                    />
                </div>
                <div className='flex'>
                    <button
                        onClick={() => bookAccommodation()}
                        className='ml-auto btn__primary px-4 py-2 mt-3'>
                        {"Đặt phòng"}
                    </button>
                </div>
                {openModal && (
                    <Modal
                        setOpenModal={(value) => {
                            setOpenModal(false);
                            clearLastBooking();
                        }}
                        openOnOutside={false}>
                        <div className='flex items-center flex-col justify-center px-8 py-4'>
                            <span className='text-primary-500 scale-[2]'></span>
                            <Spinner className='text-primary-500 w-8 h-8' />
                            <label htmlFor='' className='text-2xl mt-4'>
                                Đang thanh toán
                            </label>
                        </div>
                    </Modal>
                )}
            </div>
        );
    }

    function timeOf(date) {
        return moment(date, "HH:mm DD/MM/YYYY").format("dddd DD MMM YYYY");
    }

    function calculateTotalPriceToPay() {
        return totalPrice * (user?.roles.includes("CUSTOMER") ? 1.08 : 1.03);
    }
};
function clearLastBooking() {
    if (strings.isNumeric(localStorage.getItem("B-ID"))) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(
            `accommodation/book/${localStorage.getItem("B-ID")}/cancel`,
            requestOptions
        )
            .then((result) => {
                localStorage.removeItem("B-ID");
            })
            .catch((error) => console.log("error", error));
    }
}
