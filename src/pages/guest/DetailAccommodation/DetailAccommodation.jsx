import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import "mapbox-gl/dist/mapbox-gl.css";
import moment from "moment/moment";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useCallbackState,
    useEffectOnce,
    useElementProp,
    useInfiniteScroll,
    useQueryParameters,
} from "../../../CustomHooks/hooks";
import { SearchCriterias } from "../../../components/AdminComponents/Criterias";
import { GeoMap } from "../../../components/base/GeoMap";
import { Modal } from "../../../components/base/Modal";
import { RateStars } from "../../../components/base/RateStars";
import { XDatePicker } from "../../../components/base/XDatePicker";
import { NumberInputWithSteps } from "../../../components/base/input";
import { DEFAULT_AVATAR } from "../../../constants/files";
import { useAuth } from "../../../context/Auth";
import { useWindowSize } from "../../../context/BrowserContext";
import { HTMLNodes } from "../../../utils/elements";
import { lists } from "../../../utils/lists";
import { callRequest } from "../../../utils/requests";
import { strings } from "../../../utils/strings";
import { daysBetween } from "../../../utils/times";
import BaseLayout from "./../../../components/BaseLayout";
import { Photo } from "./../../../components/base/Photo";
import { XText } from "./../../../components/base/Texts";
export const DetailAccommodation = () => {
    const { id } = useParams();
    const [homeStay, setHomeStay] = React.useState();
    const [owner, setOwner] = React.useState();
    const [photos, setPhotos] = React.useState([]);

    const [homestayLocation, setHomestayLocation] = React.useState({
        latitude: 21.018999924,
        longitude: 105.7582803,
    });
    const queryParams = useQueryParameters();
    const navigate = useNavigate();

    useEffectOnce(() => {
        const getHomestayDetail = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(
                `accommodation?id=${id}&statementId=${queryParams.statement || ""}`,
                requestOptions
            )
                .then((response) => {
                    setHomeStay(response.data);
                    setPhotos(response.data.images);
                    setHomestayLocation({
                        latitude: response.data.latitude,
                        longitude: response.data.longitude,
                    });
                })
                .catch((error) => {
                    if (error.status === 404) {
                        alert("Không tìm thấy bản ghi.");
                        navigate("/");
                    }
                    console.log("error", error);
                });
        };

        const getOwnerDetail = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest(`accommodation/detail/house-owner?id=${id}`, requestOptions)
                .then((response) => setOwner(response.data))
                .catch((error) => {
                    if (error.status === 404) {
                        alert("Không tìm thấy bản ghi.");
                        navigate("/");
                    }
                    console.log("error", error);
                });
        };

        getHomestayDetail();
        getOwnerDetail();
    });

    return (
        <BaseLayout>
            <div className='p-4 sm:p-8 m-auto xl:w-2/3 md:w-full sm:w-full mb-12'>
                {homeStay && <HeaderSection homeStay={homeStay} />}
                {homeStay && (
                    <Thumbnails thumbnail={homeStay.thumbnail} photos={photos} />
                )}
                {homeStay && (
                    <div className='mt-4 pt-4'>
                        <h2 className='text-xl font-bold block mb-4'>Mô tả</h2>
                        <XText ellipsis={{ maxLine: 5 }}>
                            <HTMLNodes rawHTML={homeStay.description} className='' />
                        </XText>
                    </div>
                )}
                {homeStay && <ViewsSection views={homeStay.views} />}
                {homeStay && <Rooms userCanBook={homeStay.canBook} />}
                {homeStay && <Map location={homestayLocation} />}
                {owner && <OwnerSection owner={owner} />}
                {homeStay && (
                    <ReviewsSection
                        homeStayReviewRate={homeStay?.reviewRate}
                        homestayTotalReviews={homeStay.totalReviews}
                    />
                )}
            </div>
        </BaseLayout>
    );
};

const Rooms = ({ userCanBook }) => {
    const { id } = useParams();
    const queryParams = useQueryParameters();

    const [dateDiff, setDateDiff] = React.useState(1);
    const [checkInDate, setCheckInDate] = React.useState(
        extractDateFromQuery(queryParams, "fromDate")
    );
    const [checkOutDate, setCheckOutDate] = React.useState(
        extractDateFromQuery(queryParams, "toDate")
    );
    const [criteriaList, setCriteriaList] = useCallbackState(
        extractCriterias(queryParams)
    );
    const [roomsToBook, setRoomsToBook] = useCallbackState([]);
    const navigate = useNavigate();

    const [searchableProperties, setSearchableProperties] = React.useState();
    const [previewRooms, setPreviewRooms] = React.useState([]);
    const [availableRooms, setAvailableRooms] = React.useState([]);
    const [displayPreviewRooms, setDisplayPreviewRooms] = React.useState(
        !(checkInDate && checkOutDate)
    );

    const searchPreviewRooms = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            accommodationId: id,
            fromDate: moment(checkInDate).format("HH:mm DD/MM/YYYY"),
            toDate: moment(checkOutDate).format("HH:mm DD/MM/YYYY"),
            criteriaList: criteriaList.current,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("accommodation/rooms/preview", requestOptions)
            .then((response) => {
                setPreviewRooms(response.data);
                setDisplayPreviewRooms(true);
                setCheckInDate(null);
                setCheckOutDate(null);
                setCriteriaList([]);
                setRoomsToBook([]);
                updateUrl();
            })
            .catch((error) => console.log("error", error));
    };

    const searchAvailableRooms = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            accommodationId: id,
            fromDate: moment(checkInDate).format("HH:mm DD/MM/YYYY"),
            toDate: moment(checkOutDate).format("HH:mm DD/MM/YYYY"),
            criteriaList: criteriaList.current,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        setAvailableRooms([]);
        callRequest("accommodation/rooms/available", requestOptions)
            .then((response) => {
                setAvailableRooms(response.data);
                setDateDiff(
                    daysBetween(
                        moment(checkInDate, "HH:mm DD/MM/YYYY"),
                        moment(checkOutDate, "HH:mm DD/MM/YYYY")
                    )
                );
                setRoomsToBook([]);
                setDisplayPreviewRooms(false);
                updateUrl();
            })
            .catch((error) => console.log("error", error));
    };

    const clearSearch = () => {
        setDisplayPreviewRooms(true);
        if (previewRooms.length === 0) {
            setCheckInDate(null);
            setCheckOutDate(null);
            setCriteriaList([]);
            setRoomsToBook([]);
            searchPreviewRooms();
            updateUrl();
        } else {
            setCheckInDate(null);
            setCheckOutDate(null);
            setCriteriaList([]);
            setRoomsToBook([]);
            updateUrl();
        }
    };

    useEffectOnce(() => {
        const getSearchableProperties = () => {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

            var requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            callRequest("accommodation/properties", requestOptions)
                .then((response) => {
                    const props = response.data.properties.map((prop) => {
                        return {
                            value: prop.id,
                            text: prop.value,
                            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
                        };
                    });
                    setSearchableProperties(props);
                })
                .catch((error) => console.log("error", error));
        };
        getSearchableProperties();

        if (checkInDate && checkOutDate) {
            searchAvailableRooms();
        } else {
            searchPreviewRooms();
        }
    });

    const updateUrl = () => {
        const params = {
            fromDate:
                checkInDate != null ? moment(checkInDate).format("DD/MM/YYYY") : null,
            toDate:
                checkOutDate != null ? moment(checkOutDate).format("DD/MM/YYYY") : null,
            criterias: JSON.stringify(criteriaList.current),
            statement: queryParams.statement,
        };
        window.history.replaceState(null, null, strings.toQuery(params));
    };

    const reserveNow = () => {
        localStorage.setItem("booking-items", JSON.stringify(roomsToBook.current));
        const params = {
            fromDate:
                checkInDate != null ? moment(checkInDate).format("DD/MM/YYYY") : null,
            toDate:
                checkOutDate != null ? moment(checkOutDate).format("DD/MM/YYYY") : null,
            criterias: JSON.stringify(criteriaList.current),
            choose: JSON.stringify(roomsToBook.current),
            statement: queryParams.statement,
        };
        navigate(`/book/${id}${strings.toQuery(params)}`);
    };

    const goToLoginPage = () => {
        localStorage.setItem(
            "redirect-url",
            window.location.href.replace(window.location.origin, "")
        );
        navigate(
            `/login?redirect=${window.location.href.replace(window.location.origin, "")}`
        );
    };

    const handleCheckInDate = (date) => {
        setCheckInDate(date);
        setCheckOutDate(null);
    };

    const handleCheckOutDate = (date) => {
        setCheckOutDate(date);
    };
    const size = useWindowSize();
    const [user, ,] = useAuth();

    const [col1Ref, col1Prop] = useElementProp();
    const [col2Ref, col2Prop] = useElementProp();
    return (
        <div className='mt-8 pt-4 border-t border-gray-200'>
            <h2 className='text-xl font-bold block'>Tìm kiếm phòng</h2>
            <div className='flex gap-4 items-start mt-4 mb-4 flex-wrap'>
                <div className='flex gap-2 items-center'>
                    <label className='font-bold'>Check in</label>
                    <div className='h-[2.5rem] w-48 z-[100]'>
                        <XDatePicker
                            value={checkInDate}
                            minDate={moment().add(7, "days").toDate()}
                            maxDate={moment().add(1, "years").toDate()}
                            onChangeValue={handleCheckInDate}
                            className='w-full h-full rounded-md border border-gray-300 cursor-pointer'
                        />
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <label className='font-bold'>Check out</label>
                    <div className='h-[2.5rem] w-48 z-[100]'>
                        <XDatePicker
                            value={checkOutDate}
                            minDate={
                                checkInDate === null
                                    ? moment().add(8, "days").toDate()
                                    : moment(checkInDate).add(1, "days").toDate()
                            }
                            maxDate={moment().add(1, "years").toDate()}
                            onChangeValue={handleCheckOutDate}
                            className='w-full h-full rounded-md border border-gray-300 cursor-pointer'
                        />
                    </div>
                </div>
                {searchableProperties && canSearch() && (
                    <div className='z-10'>
                        <SearchCriterias
                            criteriaList={criteriaList.current}
                            setCriteriaList={setCriteriaList}
                            fields={searchableProperties}
                            buttonClassName='bg-primary-500 hover:bg-primary-600 h-[2.5rem] mt-0'
                            criteriaClassName='h-[2.5rem]'
                        />
                    </div>
                )}
                <button
                    disabled={!canSearch()}
                    onClick={() => searchAvailableRooms()}
                    className='w-fit px-8 h-10 btn__primary'>
                    Tìm kiếm
                </button>
                {!displayPreviewRooms && (
                    <button
                        onClick={() => clearSearch()}
                        className='w-fit px-4 h-10 bg-primary-200 hover:bg-primary-300 text-primary-500 rounded-md text-sm'>
                        Xoá
                    </button>
                )}
            </div>

            {displayPreviewRooms ? (
                <table className='w-full mt-4'>
                    <thead>
                        <tr>
                            <th className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white w-96'>
                                Thông tin phòng
                            </th>
                            {size.isLargerThan("lg") && (
                                <th className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white border-l border-white max-w-[24rem]'>
                                    Chi tiết
                                </th>
                            )}
                            {size.isLargerThan("md") && (
                                <th className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white border-l border-white'>
                                    Giá tiền 1 đêm
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {previewRooms.map((room, index) => (
                            <PreviewRoomRow room={room} key={index} />
                        ))}
                    </tbody>
                </table>
            ) : availableRooms?.length === 0 ? (
                <div className='text-danger-500 rounded-md border-2 border-danger-300 p-2 bg-danger-100'>
                    Không tìm thấy phòng theo yêu cầu của bạn
                </div>
            ) : (
                <table className='w-full mt-4'>
                    <thead>
                        <tr>
                            <th className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white w-96'>
                                Thông tin phòng
                            </th>
                            {size.isLargerThan("lg") && (
                                <th className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white border-l border-white w-[24rem]'>
                                    Chi tiết
                                </th>
                            )}
                            {size.isLargerThan("md") && (
                                <th
                                    ref={col1Ref}
                                    className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white border-l border-white w-48'>{`Giá tiền của ${dateDiff} đêm`}</th>
                            )}
                            <th
                                ref={col2Ref}
                                className='text-left px-4 py-3 bg-primary-500/75 text-sm text-white border-l border-white w-64'>
                                Số phòng còn trống
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableRooms.map((room, index) => (
                            <AvailableRoomRow
                                room={room}
                                key={index}
                                canViewTotalRooms={true}
                                canBook={userCanBook}
                                setRoomsToBook={setRoomsToBook}
                                dateDiff={dateDiff}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {roomsToBook.current?.length > 0 && (
                <table className='w-full'>
                    <tbody>
                        <tr>
                            <td className='text-left px-4 py-3 border-l border-b border-primary-200 align-top'>
                                <div className=''>
                                    <h3 className=''>Phòng đã đặt</h3>
                                    <ul className='list-disc'>
                                        {roomsToBook.current.map((room, index) => (
                                            <li
                                                className='font-bold ml-8 text-lg'
                                                key={index}>
                                                {room.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </td>
                            <td
                                className='text-left px-4 py-3 border-l border-r border-b border-primary-200 align-top'
                                style={{
                                    width: size.isLargerThan("md")
                                        ? col1Prop.width + col2Prop.width
                                        : col2Prop.width,
                                }}>
                                <h4 className=''>
                                    <span className='font-bold'>
                                        {lists.sumOf(
                                            roomsToBook.current,
                                            (r) => r.totalBooked
                                        )}
                                    </span>
                                    {" phòng"}
                                </h4>
                                {totalRoomsOriginalPrice() >
                                    totalRoomsDiscountedPrice() && (
                                    <h4 className='text-red-500 line-through text-sm'>
                                        {strings.toMoney(totalRoomsOriginalPrice())}
                                    </h4>
                                )}
                                <h2 className='text-2xl font-bold'>
                                    {strings.toMoney(totalRoomsDiscountedPrice())}
                                </h2>
                                {!isMoneyToPayValid() && (
                                    <div className='flex gap-2 w-fit py-1 px-3 bg-danger-100 text-sm text-danger-500 items-center rounded-md mb-4'>
                                        <WarningRoundedIcon className='' />
                                        <h4 className=''>
                                            Số tiền quá mức quy định (tối đa 100.000.000
                                            đ)
                                        </h4>
                                    </div>
                                )}
                                {user ? (
                                    <button
                                        disabled={!isMoneyToPayValid()}
                                        onClick={() => reserveNow()}
                                        className='btn__primary px-6 py-2'>
                                        Đặt ngay
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => goToLoginPage()}
                                        className='btn__primary px-6 py-2'>
                                        Đăng nhập để tiếp tục
                                    </button>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );

    function isMoneyToPayValid() {
        const totalPrice = totalRoomsDiscountedPrice();
        return 10_000 < totalPrice && totalPrice < 100000000;
    }

    function canSearch() {
        return checkInDate && checkOutDate;
    }

    function totalRoomsDiscountedPrice() {
        return lists.sumOf(
            roomsToBook.current,
            (room) => room.totalBooked * room.discountedPrice
        );
    }

    function totalRoomsOriginalPrice() {
        return lists.sumOf(
            roomsToBook.current,
            (room) => room.totalBooked * room.originalPrice
        );
    }
};

const AvailableRoomRow = ({
    room,
    canViewTotalRooms,
    canBook,
    setRoomsToBook,
    dateDiff,
}) => {
    const [openModal, setOpenModal] = React.useState(false);
    const [totalRoomsSelected, setTotalRoomsSelected] = React.useState(0);
    const size = useWindowSize();

    const personRecommendations = room.properties
        .filter((x) => x.type === "ROOM")
        .filter((x) => x.value)
        .map((x) => x.value);

    const selectRooms = (totalRoom) => {
        {
            setTotalRoomsSelected(totalRoom);
            if (totalRoom > 0) {
                setRoomsToBook((rooms) => [
                    ...rooms.filter((room_) => room_.id !== room.id),
                    { ...room, totalBooked: totalRoom },
                ]);
            } else {
                setRoomsToBook((rooms) => [
                    ...rooms.filter((room_) => room_.id !== room.id),
                ]);
            }
        }
    };
    return (
        <tr className='text-md font-medium'>
            <td className='align-top border-l border-b border-primary-200'>
                <div className='text-sm font-medium text-left p-3'>
                    <h4 className='text-xl font-bold'>{room.name}</h4>
                    <div className='flex flex-wrap gap-2 mt-3 mb-3'>
                        {(room.amenities || []).slice(0, 10).map((amenity, index) => (
                            <div className='flex gap-2 items-center' key={index}>
                                <img
                                    src={amenity.image}
                                    alt=''
                                    className='w-[0.875rem] h-[0.875rem] object-cover'
                                />
                                <h4 className='block text-[0.8rem]'>{amenity.name}</h4>
                            </div>
                        ))}
                    </div>
                    {size.isSmallerThan("md") && (
                        <div className='my-2 flex gap-2 flex-wrap'>
                            <label htmlFor='' className=''>
                                Giá tiền của {dateDiff} đêm:
                            </label>
                            {room.discountedPrice < room.originalPrice && (
                                <h4 className='text-black line-through'>
                                    {strings.toMoney(room.originalPrice)}
                                </h4>
                            )}
                            <h4 className='text-orange-500'>
                                {strings.toMoney(room.discountedPrice)}
                            </h4>
                            {room.discount > 0 && (
                                <h4 className='py-1 px-2 bg-orange-500 text-white rounded-md w-fit h-fit text-[0.75rem]'>
                                    Khuyến mãi {room.discount}%
                                </h4>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => setOpenModal(true)}
                        className='w-fit py-2 px-4 h-full bg-primary-500 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 text-sm'>
                        Chi tiết
                    </button>
                    {openModal && (
                        <RoomModal
                            room={room}
                            setOpenModal={setOpenModal}
                            canViewTotalRooms={canViewTotalRooms}
                            canBook={canBook}
                            totalRoomsSelected={totalRoomsSelected}
                            setTotalRoomsSelected={selectRooms}
                        />
                    )}
                </div>
            </td>
            {size.isLargerThan("lg") && (
                <td className='align-top border-l border-b border-primary-200 p-2 text-left font-medium'>
                    <div className='block'>
                        <div className='flex gap-2 flex-col mt-3 text-medium'>
                            {room.properties
                                .filter((x) => x.type === "AMENITY")
                                .slice(0, 10)
                                .map((property, index) => (
                                    <h4 className='block' key={index}>
                                        <HTMLNodes
                                            rawHTML={property.value}
                                            className=''
                                        />
                                    </h4>
                                ))}

                            {personRecommendations.length > 0 && (
                                <h4 className='py-1 px-2 bg-success-200 text-success-800 rounded-md w-fit text-sm'>
                                    {`phù hợp cho ${personRecommendations.join(", ")}`}
                                </h4>
                            )}
                        </div>
                    </div>
                </td>
            )}
            {size.isLargerThan("md") && (
                <td
                    className={`align-top border-l border-b border-primary-200 p-2 text-left font-medium ${
                        !canViewTotalRooms && "border-r"
                    }`}>
                    <div className=''>
                        {room.discount > 0 && (
                            <h4 className='text-red-500 line-through'>
                                {strings.toMoney(room.originalPrice)}
                            </h4>
                        )}
                        <h4 className=''>{strings.toMoney(room.discountedPrice)}</h4>
                        {room.discount > 0 && (
                            <h4 className='py-1 px-2 bg-orange-500 text-white rounded-md w-fit h-fit text-[0.75rem]'>
                                Khuyến mãi {room.discount}%
                            </h4>
                        )}
                    </div>
                </td>
            )}
            {canViewTotalRooms && (
                <td className='align-top border-l border-b border-r border-primary-200 p-2 text-left font-medium'>
                    <SelectRoomsSection
                        canBook={canBook}
                        room={room}
                        totalRoomsSelected={totalRoomsSelected}
                        setTotalRoomsSelected={selectRooms}
                    />
                </td>
            )}
        </tr>
    );
};

const PreviewRoomRow = ({ room }) => {
    const [openModal, setOpenModal] = React.useState(false);
    const size = useWindowSize();

    const personRecommendations = room.properties
        .filter((x) => x.type === "ROOM")
        .filter((x) => x.value)
        .map((x) => x.value);

    return (
        <tr className='text-md font-medium'>
            <td
                className={`align-top border-l border-b border-primary-200 ${
                    size.isSmallerThan("md") ? "border-r" : ""
                }`}>
                <div className='text-sm font-medium text-left p-3'>
                    <h4 className='text-xl font-bold'>{room.name}</h4>
                    <div className='flex flex-wrap gap-2 mt-3 mb-3'>
                        {(room.amenities || []).slice(0, 10).map((amenity, index) => (
                            <div className='flex gap-2 items-center' key={index}>
                                <img
                                    src={amenity.image}
                                    alt=''
                                    className='w-[0.875rem] h-[0.875rem] object-cover'
                                />
                                <h4 className='block text-[0.8rem]'>{amenity.name}</h4>
                            </div>
                        ))}
                    </div>
                    {size.isSmallerThan("md") && (
                        <div className='my-2'>
                            <RoomPrice room={room} />
                        </div>
                    )}
                    <button
                        onClick={() => setOpenModal(true)}
                        className='w-fit py-2 px-4 h-full bg-primary-500 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 text-sm'>
                        Chi tiết
                    </button>
                    {openModal && (
                        <RoomModal
                            room={room}
                            setOpenModal={setOpenModal}
                            canViewTotalRooms={false}
                            canBook={false}
                            totalRoomsSelected={null}
                            setTotalRoomsSelected={null}
                        />
                    )}
                </div>
            </td>
            {size.isLargerThan("lg") && (
                <td className='align-top border-l border-b border-primary-200 p-2 text-left font-medium'>
                    <div className='block'>
                        <div className='flex gap-2 flex-col mt-3 text-medium'>
                            {room.properties
                                .filter((x) => x.type === "AMENITY")
                                .slice(0, 10)
                                .map((property, index) => (
                                    <h4 className='block' key={index}>
                                        <HTMLNodes
                                            rawHTML={property.value}
                                            className=''
                                        />
                                    </h4>
                                ))}

                            <h4 className='py-1 px-2 bg-success-200 text-success-800 rounded-md w-fit text-sm'>
                                {personRecommendations.length > 0 &&
                                    `Phù hợp với ${personRecommendations.join(", ")}`}
                            </h4>
                        </div>
                    </div>
                </td>
            )}
            {size.isLargerThan("md") && (
                <td
                    className={`align-top border-l border-b border-primary-200 p-2 text-left font-medium border-r`}>
                    <RoomPrice room={room} />
                </td>
            )}
        </tr>
    );
};

function RoomPrice({ room }) {
    function indexOfDayType(dayType) {
        return dayType == "WEEKDAY" ? 1 : dayType === "WEEKEND" ? 2 : 3;
    }
    return (
        <div className=''>
            {(room.priceDetails || [])
                .sort((a, b) => indexOfDayType(a.dayType) - indexOfDayType(b.dayType))
                .map((priceDetail, index) => {
                    if (priceDetail.dayType === "WEEKDAY") {
                        return (
                            <div
                                key={index}
                                className='flex gap-1 mt-2 items-center flex-wrap'>
                                {room.discount > 0 && (
                                    <h4 className='text-red-500 line-through'>
                                        {strings.toMoney(priceDetail.originalPrice)}
                                    </h4>
                                )}
                                <h4 className='text-orange-500'>
                                    {strings.toMoney(priceDetail.discountedPrice)}
                                </h4>
                                {priceDetail.discount > 0 && (
                                    <h4 className='py-1 px-2 bg-orange-500 text-white rounded-md w-fit h-fit text-[0.75rem]'>
                                        Khuyến mãi {priceDetail.discount}%
                                    </h4>
                                )}
                                <h3 className=''>Từ thứ 2 đến thứ 6</h3>
                            </div>
                        );
                    }
                    if (priceDetail.dayType === "WEEKEND") {
                        return (
                            <div
                                key={index}
                                className='flex gap-1 mt-2 items-center flex-wrap'>
                                {room.discount > 0 && (
                                    <h4 className='text-red-500 line-through'>
                                        {strings.toMoney(priceDetail.originalPrice)}
                                    </h4>
                                )}
                                <h4 className='text-orange-500'>
                                    {strings.toMoney(priceDetail.discountedPrice)}
                                </h4>
                                {priceDetail.discount > 0 && (
                                    <h4 className='py-1 px-2 bg-orange-500 text-white rounded-md w-fit h-fit text-[0.75rem]'>
                                        Khuyến mãi {priceDetail.discount}%
                                    </h4>
                                )}
                                <h3 className=''>Vào cuối tuần</h3>
                            </div>
                        );
                    }
                    if (priceDetail.dayType === "SPECIAL_DAY") {
                        return (
                            <div
                                key={index}
                                className='flex gap-1 mt-2 items-center flex-wrap'>
                                {room.discount > 0 && (
                                    <h4 className='text-red-500 line-through'>
                                        {strings.toMoney(priceDetail.originalPrice)}
                                    </h4>
                                )}
                                <h4 className='text-orange-500'>
                                    {strings.toMoney(priceDetail.discountedPrice)}
                                </h4>
                                {priceDetail.discount > 0 && (
                                    <h4 className='py-1 px-2 bg-orange-500 text-white rounded-md w-fit h-fit text-[0.75rem]'>
                                        Khuyến mãi {priceDetail.discount}%
                                    </h4>
                                )}
                                <h3 className=''>Vào ngày lễ</h3>
                            </div>
                        );
                    }
                    return null;
                })}
        </div>
    );
}

const Map = ({ location }) => {
    const [locationName, setLocationName] = React.useState();
    useEffectOnce(() => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=pk.eyJ1IjoiaG9tZTJzdGF5IiwiYSI6ImNsazl2anNmNjAxMWEzam8zajAxMzVneWYifQ.q3kU4RqNM7EnbCCaNDC6Gw`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                try {
                    setLocationName(result.features[0].place_name);
                } catch (error) {}
            })
            .catch((error) => console.log("error", error));
    });

    const [parentRef, parentProp] = useElementProp();
    const [childRef, prop] = useElementProp();
    return (
        <div className='mt-8 pt-4'>
            <h2 className='text-xl font-bold block'>Nơi bạn sẽ đến</h2>
            <h2 className='text-md font-medium block mb-4 text-primary-500'>
                {locationName}
            </h2>
            <GeoMap
                className='w-full h-[24rem] sm:h-[36rem] mt-4 rounded-md overflow-hidden'
                location={location}
                markers={[location]}
                markerElement={
                    <div className='relative'>
                        <div
                            className='p-[2.5rem] bg-primary-500 bg-opacity-25 rounded-full absolute left-0'
                            ref={parentRef}
                            style={{
                                left: (parentProp.width - prop.width) / -2,
                                top: (parentProp.height - prop.height) / -2,
                            }}></div>
                        <div
                            className='p-[0.875rem] bg-primary-500 rounded-full flex items-center justify-center'
                            ref={childRef}>
                            <HomeRoundedIcon className='text-white scale-125' />
                        </div>
                    </div>
                }
            />
        </div>
    );
};

const ViewsSection = ({ views }) => {
    const [openModal, setOpenModal] = React.useState(false);
    return (
        views.length > 0 && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
                <h2 className='text-xl font-bold block mb-4'>Khung cảnh quanh nhà</h2>
                <div className='flex gap-8 items-center w-full overflow-x-auto'>
                    {views.slice(0, 10).map((category, index) => (
                        <div className='flex gap-1 items-center mb-2 ' key={index}>
                            <img
                                src={category.image}
                                alt=''
                                className='w-6 h-6 object-cover'
                            />
                            <h4 className='block'>{category.name}</h4>
                        </div>
                    ))}
                </div>
                {views.length > 10 && (
                    <button
                        onClick={() => setOpenModal(true)}
                        className='px-6 py-2 bg-primary-500 mt-4 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 text-sm'>
                        Xem thêm {views.length - 10} khung cảnh
                    </button>
                )}
                {openModal && (
                    <Modal setOpenModal={setOpenModal} className=''>
                        <div className=' max-h-[32rem] flex flex-col pl-4  mb-4'>
                            <h2 className='text-xl font-bold block mb-4 w-[32rem]'>
                                Khung cảnh quanh nhà
                            </h2>
                            <div className='flex flex-col gap-8 overflow-y-auto h-full'>
                                {views.map((category, index) => (
                                    <div className='flex gap-2 items-center' key={index}>
                                        <img
                                            src={category.image}
                                            alt=''
                                            className='w-6 h-6 object-cover'
                                        />
                                        <h4 className='block'>{category.name}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        )
    );
};

const OwnerSection = ({ owner }) => {
    const windowSize = useWindowSize();
    return (
        <div className='mt-8'>
            <div className='flex gap-4 items-center'>
                <a href={`/profile/${owner.id}`} className='flex gap-4 items-center'>
                    <Photo
                        src={owner.avatar}
                        errorSrc={DEFAULT_AVATAR}
                        className='w-[64px] h-[64px] rounded-full object-cover'
                    />
                    <div className=''>
                        <h3 className='text-xl font-bold'>Chủ nhà {owner.username}</h3>
                        <h3 className='text-sm text-gray-500'>
                            Gia nhập vào{" "}
                            {moment(owner.createdAt, "HH:mm DD/MM/YYYY").format(
                                "DD/MM/YYYY"
                            )}
                        </h3>
                    </div>
                </a>
                {windowSize.isLargerThan("sm") && (
                    <div className='ml-24'>
                        {owner.totalRate ? (
                            <div className='flex'>
                                {owner.totalRate < 4.2 && (
                                    <StarBorderOutlinedIcon className='block h-[1rem] mr-1' />
                                )}
                                {4.2 <= owner.totalRate && owner.totalRate <= 4.8 && (
                                    <StarHalfOutlinedIcon className='block h-[1rem] mr-1' />
                                )}
                                {4.8 < owner.totalRate && (
                                    <StarOutlinedIcon className='block h-[1rem] mr-1' />
                                )}
                                <h2 className='pr-4 block mt-1'>{owner.totalRate}</h2>
                            </div>
                        ) : (
                            <div className='flex gap-2 items-center'>
                                <StarBorderRoundedIcon className='text-gray-500' />
                                <h5 className=''>Chưa có đánh giá</h5>
                            </div>
                        )}
                        <div className='flex gap-2 items-center'>
                            <RateReviewRoundedIcon className='text-gray-500 scale-75' />
                            <h2 className=''>{owner.totalReview ?? 0} đánh giá</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReviewsSection = ({ homeStayReviewRate, homestayTotalReviews }) => {
    const [homestayRate, setHomestayRate] = React.useState(homeStayReviewRate);
    const { id } = useParams();

    const [reviews, setReviews] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(-1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [orderBy, setOrderBy] = React.useState("createdAt");
    const [isDescending, setIsDescending] = React.useState(true);

    function getReviews() {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        if (lastPage === page) {
            return;
        }

        callRequest(
            `accommodation/detail/reviews?id=${id}&orderBy=${orderBy}&size=${5}&page=${page}&isDescending=${isDescending}`,
            requestOptions
        )
            .then((response) => {
                if (page === 1) {
                    setReviews(response.data.items);
                } else {
                    setReviews([...reviews, ...response.data.items]);
                }
                setPage(response.data.page || 1);
                setLastPage(response.data.page || 1);
                setTotalPages(response.data.totalPages || 1);
            })
            .catch((error) => console.log("error", error));
    }

    const [, lastElementRef] = useInfiniteScroll({
        page,
        setPage,
        totalPages,
        action: getReviews,
    });

    useEffectOnce(() => {
        getReviews();
    });

    return (
        <div className='mt-8 pt-3 border-t border-gray-200'>
            <h2 className='text-xl font-bold mb-4'>Đánh giá của khách</h2>
            {homestayRate ? (
                <div className='sm:flex sm:gap-12 w-full p-6 border border-primary-300 bg-primary-50 mb-4'>
                    <div className='sm:text-center flex sm:block flex-col items-center mb-4'>
                        <h3 className='text-sm'>{`${homestayTotalReviews} đánh giá`}</h3>
                        <h3 className='text-2xl font-bold'>{`${homestayRate} trên 5`}</h3>
                        <div className='flex'>
                            <RateStars rate={homestayRate} />
                        </div>
                    </div>
                    <div className='flex ml-auto w-full sm:w-64 text-sm cursor-pointer'>
                        <select
                            className=' rounded-md border-gray-300'
                            onChange={(e) => {
                                const option = e.target.value;

                                const getOrderByAndDescending = () => {
                                    if (option == "1") {
                                        return ["createdAt", true];
                                    }
                                    if (option == "2") {
                                        return ["rate", true];
                                    }
                                    if (option == "3") {
                                        return ["rate", false];
                                    }
                                };

                                const [orderBy, desc] = getOrderByAndDescending();

                                Promise.resolve()
                                    .then(() => setOrderBy(orderBy))
                                    .then(() => setIsDescending(desc))
                                    .then(() => setLastPage(-1))
                                    .then(() => setPage(1))
                                    .then(() => setTotalPages(1))
                                    .then(() => getReviews());
                            }}
                            name='w-full'>
                            <option value='1' className='text-sm'>
                                Theo ngày tạo (mới nhất)
                            </option>
                            <option value='2' className='text-sm'>
                                Nhiều sao nhất
                            </option>
                            <option value='3' className='text-sm'>
                                Ít sao nhất
                            </option>
                        </select>
                    </div>
                </div>
            ) : (
                <h3 className='flex gap-12 w-full p-6 border border-primary-300 bg-primary-50 mb-4'>
                    Chưa có đánh giá
                </h3>
            )}

            {reviews.length > 0 && (
                <div className='flex flex-col gap-4'>
                    {reviews.map((review, index) =>
                        index === reviews.length - 1 ? (
                            <UserReview
                                review={review}
                                key={index}
                                setReviews={setReviews}
                                setHomestayRate={setHomestayRate}
                                innerRef={lastElementRef}
                            />
                        ) : (
                            <UserReview
                                review={review}
                                key={index}
                                setReviews={setReviews}
                                setHomestayRate={setHomestayRate}
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
};

const UserReview = ({ review, innerRef, setReviews, setHomestayRate }) => {
    const [editing, setEditing] = React.useState(false);
    const [viewImages, setViewImages] = React.useState(false);
    const [rate, setRate] = React.useState(review.rate);
    const [reviewContent, setReviewContent] = React.useState(review.content);
    const [contentError, setContentError] = React.useState("");
    const [images, setImages] = React.useState(review.images || []);

    const updateReview = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        var raw = JSON.stringify({
            id: review.id,
            rate,
            content: reviewContent,
            images,
        });

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        callRequest("accommodation/review", requestOptions)
            .then((response) => {
                setReviews((reviews) =>
                    reviews.map((_review) =>
                        review.id === _review.id ? response.data.review : _review
                    )
                );
                setContentError("");
                setReviewContent("");
                setImages([]);
                setHomestayRate(response.data.newRate);
                setEditing(false);
            })
            .catch((error) => {
                if (error.status === 400) {
                    setContentError(error.data.content);
                    return;
                }
                alert(error.message);
            });
    };
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
                    .catch((response) => alert(response.message))
                    .finally(() => {
                        if (uploadImageRef.current) {
                            console.log("Clear image");
                            uploadImageRef.current.value = "";
                        }
                    });
            });
        }
    };

    return (
        <div className='flex flex-col md:flex-row gap-4 border p-6'>
            <div className='min-w-[16rem] overflow-hidden md:max-w-[16rem]'>
                <a
                    href={`/profile/${review.owner.id}`}
                    className='flex gap-2 items-center overflow-ellipsis '>
                    <Photo
                        src={review.owner.avatar}
                        errorSrc={DEFAULT_AVATAR}
                        className='w-[48px] h-[48px] rounded-full object-cover'
                    />
                    <div className='w-full'>
                        <h3 className='font-bold overflow-ellipsis w-full'>
                            {review.owner.username}
                        </h3>
                    </div>
                </a>
                <div className='mt-4'>
                    <h3 className='text-[0.75rem] block'>Phòng đã đặt</h3>
                    <ul className='list-disc'>
                        {review.detail.roomNames.map((room, index) => (
                            <li className='text-[0.875rem] font-bold ml-8' key={index}>
                                {room}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='flex-1'>
                <div className='flex'>
                    <div className=''>
                        <h3 className='!text-sm text-gray-500'>
                            Nhận xét lúc {review.createdAt}
                        </h3>
                        <RateStars rate={review.rate} />
                    </div>
                    <div className='flex ml-auto gap-2'>
                        {review.canEdit && (
                            <button
                                onClick={() => {
                                    setEditing(true);
                                    setRate(review.rate);
                                    setReviewContent(review.content);
                                    setContentError("");
                                    setImages(review.images || []);
                                }}
                                className='bg-indigo-500 rounded-md text-white hover:bg-indigo-600/90 hover:outline hover:outline-2 hover:outline-indigo-500 hover:outline-offset-2 text-sm disabled:cursor-not-allowed px-2 h-fit py-1'>
                                Sửa
                            </button>
                        )}
                    </div>
                </div>
                <div ref={innerRef}>
                    <XText ellipsis={{ maxLine: 5 }}>
                        <HTMLNodes rawHTML={review.content} className='' />
                    </XText>
                </div>
                {viewImages && (
                    <ImageViewer setViewImages={setViewImages} images={review.images} />
                )}
                <div className='flex my-2 gap-2 flex-wrap'>
                    {(review.images || []).map((image, index) => (
                        <div
                            className=' w-32 h-32 rounded-md border border-gray-200 overflow-hidden relative '
                            key={index}
                            onClick={() => setViewImages(true)}>
                            <Photo
                                src={image}
                                className='w-full h-full object-cover cursor-pointer hover:brightness-75'
                            />
                        </div>
                    ))}
                </div>
                {editing && (
                    <Modal setOpenModal={setEditing} className='mx-4'>
                        <div className='w-full max-w-full my-2'>
                            <div className='flex flex-col sm:flex-row sm:pl-4 gap-4 max-w-full'>
                                <div className='min-w-[16rem]'>
                                    <h3 className='block mb-4'>Chia sẻ cảm nghĩ</h3>
                                    <div className='flex items-center gap-1 mb-4'>
                                        {[1, 2, 3, 4, 5].map((star, index) => {
                                            if (rate < star) {
                                                return (
                                                    <StarBorderOutlinedIcon
                                                        key={index}
                                                        className='block text-orange-300 cursor-pointer'
                                                        onClick={() => setRate(star)}
                                                    />
                                                );
                                            }
                                            return (
                                                <StarOutlinedIcon
                                                    key={index}
                                                    className='block text-orange-500 cursor-pointer'
                                                    onClick={() => setRate(star)}
                                                />
                                            );
                                        })}
                                    </div>
                                    {rate === 1 && (
                                        <h3 className='font-bold text-danger-500'>
                                            Không hài lòng
                                        </h3>
                                    )}
                                    {rate === 2 && (
                                        <h3 className='font-bold text-orange-300'>Tệ</h3>
                                    )}
                                    {rate === 3 && (
                                        <h3 className='font-bold text-orange-300'>Ổn</h3>
                                    )}
                                    {rate === 4 && (
                                        <h3 className='font-bold text-green-500'>Tốt</h3>
                                    )}
                                    {rate === 5 && (
                                        <h3 className='font-bold text-green-500'>
                                            Tuyệt vời
                                        </h3>
                                    )}
                                    <div className=''>
                                        <h3 className='mt-4'>Phòng đã đặt</h3>
                                        <ul className='list-disc'>
                                            {review.detail.roomNames.map(
                                                (room, index) => (
                                                    <li
                                                        className='font-bold ml-8 text-lg'
                                                        key={index}>
                                                        {room}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <textarea
                                        value={reviewContent}
                                        onChange={(e) => setReviewContent(e.target.value)}
                                        className='w-full rounded-md min-h-[12rem] border-gray-300'
                                    />
                                    {strings.isNotBlank(contentError) && (
                                        <label className='mt-2 text-red-500'>
                                            {contentError}
                                        </label>
                                    )}
                                    <div className='flex my-2 gap-2 flex-wrap'>
                                        {images.map((image, index) => (
                                            <div
                                                className=' w-32 h-32 rounded-md border border-gray-200 overflow-hidden relative '
                                                key={index}>
                                                <img
                                                    src={image}
                                                    onError={() => {
                                                        setImages(
                                                            images.filter(
                                                                (i) => i !== image
                                                            )
                                                        );
                                                    }}
                                                    alt=''
                                                    className='w-full h-full object-cover cursor-pointer hover:brightness-75'
                                                />
                                                <button
                                                    onClick={() => {
                                                        setImages(
                                                            images.filter(
                                                                (i) => i !== image
                                                            )
                                                        );
                                                    }}
                                                    className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center absolute right-2 top-2'>
                                                    <CloseRoundedIcon fontSize='8' />
                                                </button>
                                            </div>
                                        ))}
                                        <input
                                            onChange={uploadMultipleFiles}
                                            id='image-choose'
                                            type='file'
                                            ref={uploadImageRef}
                                            multiple={true}
                                            accept='image/*'
                                            hidden
                                        />
                                        <label
                                            htmlFor='image-choose'
                                            className='bg-gray-100 rounded-md border-2 border-dashed border-indigo-500 w-32 h-32 text-center flex items-center justify-center cursor-pointer'>
                                            <span className='w-full text-center'>
                                                Thêm ảnh
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='flex mt-2'>
                                <button
                                    type='button'
                                    onClick={updateReview}
                                    className='ml-auto cursor-pointer select-none rounded-md bg-primary-500 px-8 py-2 text-sm font-medium text-white hover:bg-primary-600'>
                                    Sửa
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

const RoomModal = ({
    setOpenModal,
    room,
    canViewTotalRooms,
    canBook,
    totalRoomsSelected,
    setTotalRoomsSelected,
}) => {
    const [openMoreAmenitiseModal, setOpenMoreAmenitiseModal] = React.useState(false);
    const personRecommendations = room.properties
        .filter((x) => x.type === "ROOM")
        .filter((x) => x.value)
        .map((x) => x.value);
    return (
        <Modal setOpenModal={setOpenModal} className='mx-4'>
            <div className=' min-w-full max-h-[75vh] overflow-auto mt-2 2xl:mt-0 px-4 2xl:pl-4'>
                <div className='flex flex-col 2xl:flex-row gap-8 overflow-y-auto h-full w-full'>
                    <RoomPhotoCarousel images={room.images} />
                    <div className='w-full 2xl:w-[32rem]'>
                        <h3 className='text-2xl font-bold'>{room.name}</h3>
                        <div className='mt-4 pt-3 border-t border-gray-200'>
                            <div className='flex gap-2 flex-col mt-3'>
                                {room.properties
                                    .filter((x) => x.type === "AMENITY")
                                    .slice(0, 10)
                                    .map((property, index) => (
                                        <h4 className='block' key={index}>
                                            <HTMLNodes
                                                rawHTML={property.value}
                                                className=''
                                            />
                                        </h4>
                                    ))}
                                <h4 className='py-1 px-2 bg-success-200 text-success-800 rounded-md w-fit text-sm'>
                                    {personRecommendations.length > 0 &&
                                        `Phù hợp với ${personRecommendations.join(", ")}`}
                                </h4>
                            </div>
                        </div>
                        <div className='mt-4 pt-3 border-t border-gray-200'>
                            <h3 className='font-bold'>Tiện ích</h3>
                            <div className='flex gap-4 flex-wrap mt-3'>
                                {(room.amenities || [])
                                    .slice(0, 10)
                                    .map((category, index) => (
                                        <div
                                            className='flex gap-1 items-center mb-2'
                                            key={index}>
                                            <img
                                                src={category.image}
                                                alt=''
                                                className='w-4 h-4 object-cover'
                                            />
                                            <h4 className='block'>{category.name}</h4>
                                        </div>
                                    ))}
                            </div>
                            {(room.amenities || []).length > 10 && (
                                <button
                                    onClick={() => setOpenMoreAmenitiseModal(true)}
                                    className='btn__primary px-3 py-2 mt-2'>
                                    Xem thêm {(room.amenities || []).length - 10} tiện ích
                                </button>
                            )}
                            {openMoreAmenitiseModal && (
                                <Modal
                                    setOpenModal={setOpenMoreAmenitiseModal}
                                    className=''>
                                    <div className=' max-h-[32rem] flex flex-col pl-4  mb-4'>
                                        <h2 className='text-xl font-bold block mb-4 w-[32rem]'>
                                            Tiện ích phòng
                                        </h2>
                                        <div className='flex flex-col gap-8 overflow-y-auto h-full'>
                                            {(room.amenities || []).map(
                                                (category, index) => (
                                                    <div
                                                        className='flex gap-2 items-center'
                                                        key={index}>
                                                        <img
                                                            src={category.image}
                                                            alt=''
                                                            className='w-6 h-6 object-cover'
                                                        />
                                                        <h4 className='block'>
                                                            {category.name}
                                                        </h4>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Modal>
                            )}
                        </div>
                        {canViewTotalRooms && (
                            <SelectRoomsSection
                                room={room}
                                canBook={canBook}
                                className={"mt-8 pt-3 border-t border-gray-200"}
                                setTotalRoomsSelected={setTotalRoomsSelected}
                                totalRoomsSelected={totalRoomsSelected}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const RoomPhotoCarousel = ({ images }) => {
    const [showingRoomIndex, setShowingRoomIndex] = React.useState(0);

    return (
        <div className='lg:w-[50.5rem] w-full'>
            <div className='relative w-full'>
                <img
                    src={images[showingRoomIndex].image}
                    className='w-full h-[32rem] object-cover rounded-md'
                />
                <NavigateBeforeRoundedIcon
                    className='absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full left-6 cursor-pointer'
                    onClick={() =>
                        setShowingRoomIndex(
                            (index) => (index - 1 + images.length) % images.length
                        )
                    }
                />
                <NavigateNextRoundedIcon
                    className='absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full right-6 cursor-pointer'
                    onClick={() =>
                        setShowingRoomIndex(
                            (index) => (index + 1 + images.length) % images.length
                        )
                    }
                />
            </div>
            <div className='flex gap-2 flex-wrap mt-2'>
                {images.map((image, index) => (
                    <img
                        key={index}
                        onClick={() => setShowingRoomIndex(index)}
                        src={image.image}
                        className='w-32 h-20 object-cover rounded-md cursor-pointer hover:brightness-75'
                    />
                ))}
            </div>
        </div>
    );
};

const Thumbnails = ({ thumbnail, photos }) => {
    const [openModal, setOpenModal] = React.useState(false);
    const size = useWindowSize();

    function totalImagesShown() {
        if (size.isLargerThan("xl")) {
            return 4;
        }
        if (size.isLargerThan("md")) {
            return 2;
        }
        return 0;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-1 justify-center mt-4 w-full h-[32rem] relative'>
            <img
                onClick={() => setOpenModal(true)}
                src={thumbnail}
                alt=''
                className='hover:brightness-75 cursor-pointer w-full h-full rounded-xl md:rounded-l-xl md:rounded-r-none object-cover col-span-2 row-span-2'
            />
            {size.isLargerThan("md") && (
                <img
                    onClick={() => setOpenModal(true)}
                    src={photos[0].image}
                    alt=''
                    className='hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1 rounded-tr-xl xl:rounded-none'
                />
            )}
            {size.isLargerThan("md") && (
                <img
                    onClick={() => setOpenModal(true)}
                    src={photos[1].image}
                    alt=''
                    className='hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1 rounded-br-xl xl:rounded-tr-xl xl:rounded-br-none'
                />
            )}
            {size.isLargerThan("xl") && (
                <img
                    onClick={() => setOpenModal(true)}
                    src={photos[2].image}
                    alt=''
                    className='hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1'
                />
            )}
            {size.isLargerThan("xl") && (
                <img
                    onClick={() => setOpenModal(true)}
                    src={photos[3].image}
                    alt=''
                    className='hover:brightness-75 cursor-pointer w-full h-full rounded-br-xl object-cover col-span-1 row-span-1'
                />
            )}
            {photos.length > totalImagesShown() && (
                <button
                    onClick={() => setOpenModal(true)}
                    className='flex items-center gap-2 font-bold absolute right-0 bottom-0 m-4  bg-white rounded-md px-4 py-2'>
                    + {photos.length - totalImagesShown()} ảnh
                </button>
            )}
            {openModal && (
                <Modal
                    setOpenModal={setOpenModal}
                    className='sm:w-fit w-full mx-4 max-w-[1440px]'>
                    <div className='pl-4 mb-4 mx-0 lg:mx-4 max-h-[80vh] overflow-auto'>
                        <h3 className='text-2xl mb-4 font-bold'>Ảnh của nhà</h3>
                        <div className='flex flex-col '>
                            <div className='overflow-y-auto h-fullmt-4 columns-2 md:columns-2 lg:columns-2 pr-4'>
                                {[thumbnail, ...photos.map((photo) => photo.image)].map(
                                    (photo, index) => (
                                        <img
                                            key={index}
                                            className='mb-4 hover:brightness-50 rounded-md'
                                            src={photo}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

const HeaderSection = ({ homeStay }) => {
    return (
        <div className=''>
            <div className='md:flex items-start'>
                <h1 className='text-2xl font-bold block'>{homeStay.name}</h1>
                {homeStay.reviewRate ? (
                    <div className='ml-auto flex items-center'>
                        <div className='flex items-center'>
                            {homeStay.reviewRate < 4.2 && (
                                <StarBorderOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            {4.2 <= homeStay.reviewRate && homeStay.reviewRate <= 4.8 && (
                                <StarHalfOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            {4.8 < homeStay.reviewRate && (
                                <StarOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            <h2 className='pr-4 block'>{homeStay.reviewRate}</h2>
                        </div>
                        <h2 className='border-l px-4'>
                            {homeStay.totalReviews ?? 0} nhận xét
                        </h2>
                        <h2 className='border-l pl-4'>
                            {homeStay.totalBookings ?? 0} người đã đặt
                        </h2>
                    </div>
                ) : (
                    <div className='ml-auto flex items-center'>
                        <div className='pr-4'>Chưa có đánh giá</div>
                        <h2 className='border-l pl-4'>
                            {homeStay.totalBookings ?? 0} người đã đặt
                        </h2>
                    </div>
                )}
            </div>
            <div className='flex items-center mt-2'>
                <LocationOnIcon className='text-gray-500' />
                <h2 className=''>{homeStay.address}</h2>
            </div>
        </div>
    );
};

const SelectRoomsSection = ({
    room,
    canBook,
    className = "",
    totalRoomsSelected,
    setTotalRoomsSelected,
}) => {
    return (
        <div className={className}>
            {room.totalRoomsLeft <= 0 && (
                <div className='flex gap-2 w-fit py-1 px-3 bg-danger-100 text-sm text-danger-500 items-center rounded-md '>
                    <WarningRoundedIcon className='' />
                    <h4 className=''>Hết phòng</h4>
                </div>
            )}

            {room.totalRoomsLeft > 0 && (
                <div>
                    <h4 className='text-sm'>
                        {"Số phòng còn trống: "}
                        <span
                            className={`font-bold ${
                                0 < room.totalRoomsLeft && room.totalRoomsLeft <= 5
                                    ? "text-primary-500"
                                    : ""
                            }`}>
                            {room.totalRoomsLeft} phòng
                        </span>
                    </h4>
                    {canBook && (
                        <NumberInputWithSteps
                            text={totalRoomsSelected}
                            onChangeValue={setTotalRoomsSelected}
                            className='w-32 h-fit py-2'
                            min={0}
                            max={room.totalRoomsLeft}
                        />
                    )}
                    {canBook && totalRoomsSelected > 0 && (
                        <div className=''>
                            {room.discount > 0 && (
                                <h4 className='text-red-500 line-through'>
                                    {strings.toMoney(
                                        totalRoomsSelected * room.originalPrice
                                    )}
                                </h4>
                            )}
                            <h4 className=''>
                                {strings.toMoney(
                                    totalRoomsSelected * room.discountedPrice
                                )}
                            </h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
function ImageViewer({ setViewImages, images }) {
    const [selectingIndex, setSelectingIndex] = React.useState(0);
    if (lists.isEmpty(images)) {
        return null;
    }
    return (
        <Modal setOpenModal={setViewImages} className='m-4'>
            <div className='mt-2 w-full h-[33vh] sm:w-[67vw] sm:h-[75vh]'>
                <div className='relative w-full h-full'>
                    <img
                        src={images[selectingIndex]}
                        className='w-full h-full object-cover rounded-md'
                    />
                    {images.length > 1 && (
                        <NavigateBeforeRoundedIcon
                            className='absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full left-6 cursor-pointer'
                            onClick={() =>
                                setSelectingIndex(
                                    (index) => (index - 1 + images.length) % images.length
                                )
                            }
                        />
                    )}
                    {images.length > 1 && (
                        <NavigateNextRoundedIcon
                            className='absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full right-6 cursor-pointer'
                            onClick={() =>
                                setSelectingIndex(
                                    (index) => (index + 1 + images.length) % images.length
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}

function extractCriterias(queryParams) {
    if (strings.isBlank(queryParams.criterias)) {
        return [];
    }
    try {
        return JSON.parse(queryParams.criterias);
    } catch (e) {
        return [];
    }
}

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
