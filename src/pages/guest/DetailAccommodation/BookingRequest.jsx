import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import moment from "moment/moment";
import React from "react";
import { useParams } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import BaseLayout from "../../../components/BaseLayout";
import { RateStars } from "../../../components/base/RateStars";
import { useAuth } from "../../../context/Auth";
import { browsers } from "../../../utils/browsers";
import { HTMLNodes } from "../../../utils/elements";
import { callRequest } from "../../../utils/requests";
import { strings } from "../../../utils/strings";
import { daysBetween } from "../../../utils/times";
import { Modal } from "./../../../components/base/Modal";
import { XContentEditable } from "./../../../components/base/XContentEditable";
import Input from "../../../components/base/input";

export const BookingRequest = () => {
    const { id } = useParams();
    const [user, ,] = useAuth(["CUSTOMER", "HOUSE_OWNER", "BUSINESS_OWNER", "BUSINESS_ADMIN", "BUSINESS_MEMBER"]);
    const [homeStay, setHomeStay] = React.useState();

    const columns =

    {
        availableValues: {
            UNPURCHASED: {
                element: (
                    <label
                        className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
                        {"Đặt không thành công"}
                    </label>
                ),
            },
            PURCHASED: {
                element: (
                    <h1 className={`text-2xl text-yellow-600 font-bold`}>
                        {"Đã đặt"}
                    </h1>
                ),
            },
            CANCELED: {
                element: (
                    <h1 className={`text-2xl text-red-600 font-bold`}>
                        {"Đã hủy"}
                    </h1>
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
            SUCCEED: {
                element: (
                    <h1 className={`text-2xl text-green-600 font-bold`}>
                        {"Đặt thành công"}
                    </h1>
                ),
            },
        },
    };

    // console.log("Tesst",columns[0].availableValues["SUCCEED"].element);
    const getStatementDetail = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        if (user.roles.includes("BUSINESS_OWNER") || user.roles.includes("BUSINESS_ADMIN") || user.roles.includes("BUSINESS_MEMBER")) {
            callRequest(`booking-request/business?id=${id}`, requestOptions)
                .then((response) => {
                    setHomeStay(response.data);
                })
                .catch((error) => console.log("error", error));
        }

        if (user.roles.includes("CUSTOMER") || user.roles.includes("HOUSE_OWNER")) {
            callRequest(`booking-request?id=${id}`, requestOptions)
                .then((response) => {
                    setHomeStay(response.data);
                })
                .catch((error) => console.log("error", error));
        }
    };

    const cancelHomestay = (id, status) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`booking-request/change-status?id=${id}&status=${status}`, requestOptions)
            .then((response) => {
                alert(response.message);
                getStatementDetail();
            })
            .catch((error) => {
                if (error.status === 500) {
                    alert("Something is wrong. Please retry later.");
                    return;
                }
                alert("You are not allowed to cancel");
            });
    };

    const [canReview, setCanReview] = React.useState(false);
    const [openReviewModal, setOpenReviewModal] = React.useState(false);
    const [openCancelModal, setOpenCancelModal] = React.useState(false);
    const checkIfUserCanReview = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        callRequest(`accommodation/review/check?bookingId=${id}`, requestOptions)
            .then((response) => {
                if (response.data) {
                    setCanReview(response.data ?? false);
                }
            })
            .catch((error) => console.log("error", error));
    };

    useEffectOnce(() => {
        getStatementDetail();
        checkIfUserCanReview();
    });

    return (
        <BaseLayout>
            <div className='px-12 py-12 m-auto'>
                {homeStay && (
                    <div className='grid grid-cols-[max-content_1fr] gap-3'>
                        <div className='flex flex-col gap-3 w-[24rem]'>
                            <div className='border border-gray-200 p-4 rounded-md'>
                                <h2 className='text-lg font-bold'>{homeStay.accommodation.name} </h2>
                                {homeStay.rate && (
                                    <div className='flex gap-2 items-center'>
                                        <RateStars rate={homeStay.rate} />
                                        <h4 className='text-sm'>{homeStay.rate}</h4>
                                        <h4 className='text-sm'>{homeStay.totalReviews} Đánh giá</h4>
                                    </div>
                                )}
                                <div className='flex items-center mt-2'>
                                    <LocationOnIcon className='text-gray-500' />
                                    <h2 className=''>{homeStay.accommodation.address}</h2>
                                </div>
                                <div className='flex flex-wrap gap-2 mt-3 mb-4'>
                                    {homeStay.accommodation.views.map((amenity, index) => (
                                        <div className='flex gap-2 items-center' key={index}>
                                            <img src={amenity.image} alt='' className='w-[0.875rem] h-[0.875rem] object-cover' />
                                            <h4 className='block text-[0.8rem]'>{amenity.name}</h4>
                                        </div>
                                    ))}
                                </div>
                                <a href={`/${homeStay.accommodation.id}`} className='btn__primary px-3 py-2 !text-white'>
                                    Thông tin chỗ ở
                                </a>
                            </div>
                            <div className='border border-gray-200 rounded-md'>
                                <div className='p-4'>
                                    <h2 className='text-lg font-bold mb-3'>Thông tin chủ nhà</h2>
                                    <div className='flex'>
                                        <h5 className=''>Tên: </h5>
                                        <h5 className='ml-auto'>{homeStay.accommodation.owner.username}</h5>
                                    </div>
                                    <div className='flex'>
                                        <h5 className=''>SĐT: </h5>
                                        <h5 className='ml-auto'>{homeStay.accommodation.owner.phone && homeStay.accommodation.owner.phone}</h5>
                                    </div>
                                    <div className='flex'>
                                        <h5 className=''>Email: </h5>
                                        <h5 className='ml-auto'>{homeStay.accommodation.owner.email && homeStay.accommodation.owner.email}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className='border border-gray-200 p-4 rounded-md'>
                                <h2 className='text-lg font-bold'>Trạng thái đặt phòng</h2>
                                {columns.availableValues[homeStay.status]?.element}
                            </div>
                            <div className='border border-gray-200 p-4 rounded-md'>
                                <h2 className='text-lg font-bold mb-3'>Chi tiết đặt phòng</h2>
                                <div className='flex'>
                                    <div className=''>
                                        <h5 className='font-semibold text-sm'>Ngày đặt</h5>
                                        <div className='border-r border-gray-200 mr-4 pr-4'>
                                            <h2 className='font-bold text-sm'>{moment(homeStay.checkinAt, "HH:mm DD/MM/YYYY").format("dddd DD MMM YYYY")}</h2>
                                            <h2 className='text-[0.75rem]'>12:00</h2>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <h5 className='font-semibold text-sm'>Ngày trả</h5>
                                        <div className=''>
                                            <h2 className='font-bold text-sm'>{moment(homeStay.checkoutAt, "HH:mm DD/MM/YYYY").format("dddd DD MMM YYYY")}</h2>
                                            <h2 className='text-[0.75rem]'>12:00</h2>
                                        </div>
                                    </div>
                                </div>
                                <h3 className='mt-3'>
                                    Thời gian ở:
                                    <span className='font-bold'>
                                        {" "}
                                        {daysBetween(homeStay.checkinAt, homeStay.checkoutAt) === 1 ? "1 đêm" : daysBetween(homeStay.checkinAt, homeStay.checkoutAt) + " " + "đêm"}
                                    </span>
                                </h3>
                            </div>
                            <div className='border border-gray-200 rounded-md'>
                                <div className='p-4'>
                                    <h2 className='text-lg font-bold mb-3'>Biểu giá</h2>
                                    <div className='flex'>
                                        <h5 className=''>Giá gốc</h5>
                                        <h5 className='ml-auto'>{homeStay.transaction && strings.toMoney(homeStay.originalPrice)}</h5>
                                    </div>
                                    <div className='flex'>
                                        <h5 className=''>Khuyến mãi</h5>
                                        <h5 className='ml-auto'>
                                            {"- "}
                                            {/* {strings.toMoney(lists.sumOf(roomsToBook, (room) => (room.totalRooms * room.price * room.discount) / 100))} */}
                                            {strings.toMoney(homeStay.originalPrice - homeStay.total)}
                                        </h5>
                                    </div>
                                    { 
                                        (homeStay.user.roles.includes("BUSINESS_MEMBER")) &&
                                    <div className='flex'>
                                        <h5 className=''>Khuyến mãi doanh nghiệp (5%)</h5>
                                        <h5 className='ml-auto'>
                                            {"- "}
                                            {/* {strings.toMoney(lists.sumOf(roomsToBook, (room) => (room.totalRooms * room.price * room.discount) / 100))} */}
                                            {strings.toMoney(homeStay.total * 0.05)}
                                        </h5>
                                    </div>
                                    }
                                    <div className='flex'>
                                        <h5 className=''>Thuế VAT (8%)</h5>
                                        <h5 className='ml-auto'>
                                            {"+ "}
                                            {/* {strings.toMoney(lists.sumOf(roomsToBook, (room) => (room.totalRooms * room.price * room.discount) / 100))} */}
                                            {strings.toMoney(homeStay.total * 0.08)}
                                        </h5>
                                    </div>
                                </div>
                                <div className='flex bg-primary-100 p-4'>
                                    <h2 className='text-lg font-bold'>Thành tiền</h2>
                                    <div className='ml-auto text-right'>
                                        <h2 className='text-lg font-bold'>{strings.toMoney(homeStay.originalPrice - (homeStay.originalPrice - homeStay.total) - (homeStay.user.roles.includes("BUSINESS_MEMBER") ? (homeStay.total * 0.05):0) + (homeStay.total * 0.08))}</h2>
                                    </div>
                                </div>
                            </div>
                            {homeStay.status === "PURCHASED" && (
                                <div className='border border-gray-200 rounded-md p-4'>
                                    <h2 className='text-lg font-bold mb-3'>Số tiền để hủy phòng?</h2>
                                    <div className='flex'>
                                        <h5 className='text-sm'>Trước 00:00 ngày {moment(homeStay.checkinAt, "HH:mm DD/MM/YYYY").add(-3, "days").format("DD MMM YYYY")}</h5>
                                        <h5 className='text-danger-500 ml-auto'>{strings.toMoney(homeStay.total * 0.2)}</h5>
                                    </div>
                                    <div className='flex'>
                                        <h5 className='text-sm'>Sau 00:00 ngày {moment(homeStay.checkinAt, "HH:mm DD/MM/YYYY").add(-3, "days").format("DD MMM YYYY")}</h5>
                                        <h5 className='text-danger-500 ml-auto'>{strings.toMoney(homeStay.originalPrice - (homeStay.originalPrice - homeStay.total) - ((homeStay.user.roles.includes("BUSINESS_MEMBER")) ? (homeStay.total * 0.05):0) + (homeStay.total * 0.08))}</h5>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-3 overflow-hidden'>
                            {homeStay.bookingRequestDetails.map((room, idx) => (
                                <div key={idx} className='border border-gray-200 p-4 rounded-md flex flex-col'>
                                    <h2 className='font-bold text-xl'>{room.room.name}</h2>
                                    <div className='flex gap-2 flex-col mt-3 text-medium pt-3 border-t border-gray-200'>
                                        {room.room.properties
                                            .filter((x) => x.type === "AMENITY")
                                            .sort((x, y) => x.id - y.id)
                                            .slice(0, 10)
                                            .map((property, index) => (
                                                <h4 className='block text-sm' key={index}>
                                                    <HTMLNodes rawHTML={property.value} className='' />
                                                </h4>
                                            ))}
                                        <h4 className='py-1 px-2 bg-success-200 text-success-800 rounded-md w-fit text-sm'>
                                            {`Phù hợp với ${room.room.properties
                                                .filter((x) => x.type === "ROOM")
                                                .filter((x) => x.value)
                                                .map((x) => x.value)
                                                .join(", ")}`}
                                        </h4>
                                    </div>
                                    <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200'>
                                        {room.room.amenities.map((amenity, index) => (
                                            <div className='flex gap-2 items-center' key={index}>
                                                <img src={amenity.image} alt='' className='w-[0.875rem] h-[0.875rem] object-cover' />
                                                <h4 className='block text-[0.8rem]'>{amenity.name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='flex overflow-x-auto gap-2 mt-3 pt-3 border-t border-gray-200 w-full'>
                                        {room.room.images.map((image, index) => (
                                            <img key={index} src={image.image} alt='' className='min-w-[8rem] h-20 object-cover rounded-md cursor-pointer hover:brightness-75' />
                                        ))}
                                    </div>
                                    <div className='mt-4 border-t pt-4'>
                                        <h4 className='font-2xl'>
                                            Số phòng đặt: <span className='font-bold'>{room.totalRooms}</span>
                                        </h4>
                                        <h4 className='font-2xl'>
                                            Số tiền:
                                            <span className='ml-2 font-bold text-black line-through'>{strings.toMoney(room.originalPrice)}</span>
                                            <span className='ml-2 font-bold text-orange-500'>{strings.toMoney(room.price)}</span>
                                        </h4>
                                    </div>
                                </div>
                            ))}
                            <div className='border border-gray-200 rounded-md p-4'>
                                <h2 className='text-lg font-bold mb-2'>Thông tin liên hệ</h2>
                                <label className='font-bold '>Tên liên hệ</label>
                                <h5 className=''>{homeStay.user.username}</h5>
                                <label className='font-bold mt-2'>Số điện thoai liên hệ</label>
                                <h5 className=''>{homeStay.contact}</h5>
                                {strings.isNotBlank(homeStay.note) && (
                                    <div className=''>
                                        <label className='font-bold mt-2'>Ghi chú cho quản lí nhà</label>
                                        <HTMLNodes rawHTML={homeStay.note} className='break-all' />
                                    </div>
                                )}
                            </div>
                            <div className='flex'>
                                {homeStay.status === "PURCHASED" && 
                                (user.roles.includes("CUSTOMER") ? user.id !== homeStay.accommodation.owner.id : 
                                user.roles.includes("BUSINESS_ADMIN")) &&
                                (
                                    <button onClick={() => setOpenCancelModal(true)} className='ml-auto bg-danger-600 text-white px-6 py-2 rounded-md'>
                                        {"Hủy phòng"}
                                    </button>
                                )}
                                {/* {homeStay.status === "PURCHASED" && 
                                !user.roles.includes("BUSINESS_OWNER") ||
                                !user.roles.includes("BUSINESS_MEMBER") ||
                                user.roles.includes("BUSINESS_ADMIN") &&
                                (
                                    <button onClick={() => setOpenCancelModal(true)} className='ml-auto bg-danger-600 text-white px-6 py-2 rounded-md'>
                                        {"Hủy phòng"}
                                    </button>
                                )} */}
                                
                                {user && canReview && (
                                    <button onClick={() => setOpenReviewModal(true)} className='ml-auto bg-indigo-600 text-white px-6 py-2 rounded-md'>
                                        Đánh giá ngay
                                    </button>
                                )}
                                {canReview && openReviewModal && (
                                    <Modal setOpenModal={setOpenReviewModal}>
                                        <ReviewHomestay
                                            bookingId={id}
                                            setOpenModal={setOpenReviewModal}
                                            setCanReview={setCanReview}
                                            accommodationId={homeStay.accommodation.id}
                                            rooms={homeStay.bookingRequestDetails.map((detail) => detail.room)}
                                        />
                                    </Modal>
                                )}
                                {openCancelModal && (
                                    <Modal setOpenModal={setOpenCancelModal}>
                                        <CancelHomestay
                                            bookingId={id}
                                            setOpenModal={setOpenCancelModal}
                                            status = {"CANCELED"}

                                        />
                                    </Modal>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout>
    );
};

const CancelHomestay = ({ bookingId, setOpenModal,status }) => {
    const [nameCard, setNameCard] = React.useState("");
    const [contentError, setContentError] = React.useState("Lưu ý tên chủ thẻ phải trùng với tên chủ thẻ đã thanh toán căn hộ này!");
    const [images, setImages] = React.useState([]);

    const sendCancel = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            id: bookingId,
            status:status,
            cardHolder:nameCard,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("booking-request/change-status", requestOptions)
            .then((response) => {
                alert(response.message);
                setOpenModal(false);
                // search();
                // SetAddDefault();
                // SetErrorDefault();
                window.location.reload();

            })
            .catch((response) => {
                if (response.status === 400 && response?.data?.rejectMessage) {
                    return;
                }
                if (response.message === null) {
                    setContentError(response.data["cardHolder"]);
                } else {
                    setContentError(response.message);
                }
            });

    };


    return (
        <div className='px-8 pb-4'>

            <div className='mt-2'>

                    <Input
                        required
                        field={"Tên chủ thẻ"}
                        onChangeValue={(value) => setNameCard(value)}
                        error={contentError}
                        upperCase = {true}
                        placeHolder="Nhập tên chủ thẻ"
                        errorStyle="w-70"
                    >
                    </Input>


                    

            </div>


            <div className='flex mt-2'>

                <button
                    onClick={() => sendCancel()}
                    className={`rounded-md px-6 text-sm font-medium bg-danger-500  hover:bg-danger-600 text-white h-12 ml-auto`}

                >
                    Xác nhận
                </button>


            </div>
        </div>
    );
};

const ReviewHomestay = ({ bookingId, setCanReview, setOpenModal, accommodationId, rooms }) => {
    const [rate, setRate] = React.useState(5);
    const [reviewContent, setReviewContent] = React.useState("");
    const [contentError, setContentError] = React.useState("");
    const [images, setImages] = React.useState([]);
    const uploadImageRef = React.useRef();

    const uploadMultipleFiles = async (event) => {
        if (event.target.files) {
            Array.from(event.target.files).forEach((file) => {
                var myHeaders = new Headers();

                var formdata = new FormData();
                formdata.append("file", file);

                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: formdata,
                    redirect: "follow",
                };

                callRequest("utility/upload/image", requestOptions)
                    .then((response) => {
                        setImages((imgs) => [...imgs, response.data]);
                    })
                    .catch((response) => alert(response.message)).finally(() => {
                        if (uploadImageRef.current) {
                            console.log("Clear image");
                            uploadImageRef.current.value = "";
                        }
                    });
            });
        }
    };

    const addReview = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            rate,
            content: reviewContent,
            images,
            accommodationId,
            requestId: bookingId,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("accommodation/review", requestOptions)
            .then((response) => {
                setContentError("");
                setReviewContent("");
                setImages([]);
                setCanReview(false);
                setOpenModal(false);
                alert(response.message);
            })
            .catch((error) => {
                if (error.status === 400) {
                    setContentError(error.data?.content);
                    return;
                }
                alert(error.message);
            });
    };
    return (
        <div className='w-[50vw] mt-4 ml-4'>
            <div className='flex gap-4'>
                <div className='min-w-[16rem]'>
                    <h3 className='block mb-4'>Đánh giá chỗ ở: </h3>
                    <div className='flex items-center gap-1 mb-4'>
                        {[1, 2, 3, 4, 5].map((star, index) => {
                            if (rate < star) {
                                return <StarBorderOutlinedIcon key={index} className='block text-orange-300 cursor-pointer' onClick={() => setRate(star)} />;
                            }
                            return <StarOutlinedIcon key={index} className='block text-orange-500 cursor-pointer' onClick={() => setRate(star)} />;
                        })}
                    </div>
                    {rate === 1 && <h3 className='font-bold text-danger-500'>Quá tệ</h3>}
                    {rate === 2 && <h3 className='font-bold text-orange-300'>Tệ</h3>}
                    {rate === 3 && <h3 className='font-bold text-orange-300'>Bình thường</h3>}
                    {rate === 4 && <h3 className='font-bold text-green-500'>Tốt</h3>}
                    {rate === 5 && <h3 className='font-bold text-green-500'>Tuyệt vời</h3>}
                    <div className=''>
                        <h3 className='mt-4'>Phòng đã đặt</h3>
                        <ul className='list-disc'>
                            {rooms.map((room, index) => (
                                <li className='font-bold text-sm ml-8 text-lg' key={index}>
                                    {room.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='w-full'>
                    <XContentEditable error={contentError} onChange={setReviewContent} initValue={reviewContent} maxLength={2048} minLength={20} inputClassName='max-h-[16rem] overflow-auto' />
                    <div className='flex my-2 gap-2 flex-wrap'>
                        {images.map((image, index) => (
                            <div className=' w-32 h-32 rounded-md border border-gray-200 overflow-hidden relative ' key={index}>
                                <img
                                    src={image}
                                    onError={() => {
                                        setImages(images.filter((i) => i !== image));
                                    }}
                                    alt=''
                                    className='w-full h-full object-cover cursor-pointer hover:brightness-75'
                                />
                                <button
                                    onClick={() => {
                                        setImages(images.filter((i) => i !== image));
                                    }}
                                    className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center absolute right-2 top-2'>
                                    <CloseRoundedIcon fontSize='8' />
                                </button>
                            </div>
                        ))}
                        <input ref={uploadImageRef} onChange={uploadMultipleFiles} id='image-choose' type='file' multiple={true} accept='image/*' hidden />
                        <label htmlFor='image-choose' className='bg-gray-100 rounded-md border-2 border-dashed border-indigo-500 w-32 h-32 text-center flex items-center justify-center cursor-pointer'>
                            <span className='w-full text-center'>Tải ảnh</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className='flex'>
                <button type='button' onClick={addReview} className='ml-auto cursor-pointer select-none rounded-md bg-primary-500 px-8 py-2 text-sm font-medium text-white hover:bg-primary-600'>
                    Đăng
                </button>
            </div>
        </div>
    );
};
