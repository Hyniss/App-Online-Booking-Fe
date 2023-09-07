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
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Spinner } from "../../../components/base/Animations";
import "mapbox-gl/dist/mapbox-gl.css";
import moment from "moment/moment";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
const DetailAccommodationForHouseOwner = () => {
  const { accommodationId } = useParams();
  const [homeStay, setHomeStay] = React.useState();
  const [owner, setOwner] = React.useState();
  const [photos, setPhotos] = React.useState([]);
  const [rows, setRows] = React.useState([]);

  const [homestayLocation, setHomestayLocation] = React.useState({
    latitude: 21.018999924,
    longitude: 105.7582803,
  });
  const queryParams = useQueryParameters();

  useEffectOnce(() => {
    const getHomestayDetail = () => {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      callRequest(
        `accommodation/house-owner/detail?id=${accommodationId}`,
        requestOptions
      )
        .then((response) => {
          setHomeStay(response.data);
          setRows(response.data.rooms.sort((a, b) => a.id - b.id));
          setPhotos(response.data.images);
          setHomestayLocation({
            latitude: response.data.latitude,
            longitude: response.data.longtiude,
          });
        })
        .catch((error) => console.log("error", error));
    };

    const getOwnerDetail = () => {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      callRequest(
        `accommodation/detail/house-owner?id=${accommodationId}`,
        requestOptions
      )
        .then((response) => setOwner(response.data))
        .catch((error) => console.log("error", error));
    };

    getHomestayDetail();
    getOwnerDetail();
  });

  function convertStatusRoom(params) {
    let status = "";
    if (params === "OPENING") status = "Đang mở";
    else if (params === "CLOSED") status = "Đã đóng";
    else status = "Cấm";
    return status;
  }

  const navigate = useNavigate();

  const navigateTo = () => {
    // 👇️ navigate to /contacts
    navigate(`/house-owner/accommodation/update/${accommodationId}`);
  };

  if (!homeStay) {
    console.log(homeStay);
    return (
      <div className="flex items-center flex-col justify-center px-8 py-4">
        <span className="text-primary-500 scale-[2]"></span>
        <Spinner className="text-primary-500 w-8 h-8" />
        <label htmlFor="" className="text-2xl mt-4">
          Xin vui lòng chờ
        </label>
      </div>
    );
  }

  return (
    <BaseLayout>
      <div className="p-4 sm:p-8 m-auto xl:w-2/3 md:w-full sm:w-full mb-12">
        <div className="mt-4 mb-4 flex justify-end">
          <button onClick={navigateTo} className="btn__primary">
            Cập nhật chỗ ở
          </button>
        </div>
        {homeStay && <HeaderSection homeStay={homeStay} />}
        {homeStay && (
          <Thumbnails thumbnail={homeStay.thumbnail} photos={photos} />
        )}
        {homeStay && (
          <div className="mt-4 pt-4">
            <div className="flex gap-8 items-center">
              <h2 className="text-xl font-bold block mb-4">Giá: </h2>
              <h2 className="text-xl font-bold block mb-4">
                {homeStay.minPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                ~{" "}
                {homeStay.maxPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h2>
            </div>
            <h2 className="text-xl font-bold block mb-4">Mô tả</h2>
            <XText ellipsis={{ maxLine: 5 }}>
              <HTMLNodes rawHTML={homeStay.description} className="" />
            </XText>
          </div>
        )}
        {homeStay && <ViewsSection views={homeStay.location} />}
        {homeStay && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h1 className="title">Danh sách phòng</h1>
            {["HOUSE", "APARTMENT"].includes(homeStay?.type) &&
              homeStay?.totalRoom === 0 && (
                <Link
                  to={`/house-owner/accommodation/new/room/${accommodationId}`}
                  className="link mb-3 btn__primary"
                >
                  Thêm phòng mới
                </Link>
              )}
            {homeStay?.type === "HOTEL" && (
              <Link
                to={`/house-owner/accommodation/new/room/${accommodationId}`}
                className="link mb-3 btn__primary"
              >
                Thêm phòng mới
              </Link>
            )}
            <TableContainer component={Paper} className="table">
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="tableCell">ID</TableCell>
                    <TableCell className="tableCell">Ảnh</TableCell>
                    <TableCell className="tableCell">Tên phòng</TableCell>
                    <TableCell className="tableCell">Giá</TableCell>
                    <TableCell className="tableCell">Số lượng phòng</TableCell>
                    <TableCell className="tableCell">Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="tableCell">{row.id}</TableCell>
                      <TableCell className="tableCell">
                        <div className="cellWrapper">
                          <img
                            src={row.roomImages[0].url}
                            alt=""
                            className="image"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="tableCell">
                        <Link
                          to={`/house-owner/accommodation/${accommodationId}/room/${row.id}`}
                          className="roomLink"
                        >
                          {row.name}
                        </Link>
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </TableCell>
                      <TableCell className="tableCell">
                        {row.totalRoomType}
                      </TableCell>
                      <TableCell className="tableCell">
                        <span className={`status ${row.status}`}>
                          {convertStatusRoom(row.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        {homeStay && <Map location={homestayLocation} />}
        {/* {owner && <OwnerSection owner={owner} />} */}
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
    <div className="mt-8 pt-4 border-t border-gray-200">
      <h2 className="text-xl font-bold block">Địa điểm</h2>
      <h2 className="text-md font-medium block mb-4 text-primary-500">
        {locationName}
      </h2>
      <GeoMap
        className="w-full h-[24rem] sm:h-[36rem] mt-4 rounded-md overflow-hidden"
        location={location}
        markers={[location]}
        markerElement={
          <div className="relative">
            <div
              className="p-[2.5rem] bg-primary-500 bg-opacity-25 rounded-full absolute left-0"
              ref={parentRef}
              style={{
                left: (parentProp.width - prop.width) / -2,
                top: (parentProp.height - prop.height) / -2,
              }}
            ></div>
            <div
              className="p-[0.875rem] bg-primary-500 rounded-full flex items-center justify-center"
              ref={childRef}
            >
              <HomeRoundedIcon className="text-white scale-125" />
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
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h2 className="text-xl font-bold block mb-4">Khung cảnh quanh nhà</h2>
        <div className="flex gap-8 items-center w-full overflow-x-auto">
          {views.slice(0, 10).map((category, index) => (
            <div className="flex gap-1 items-center mb-2 " key={index}>
              <img
                src={category.image}
                alt=""
                className="w-6 h-6 object-cover"
              />
              <h4 className="block">{category.name}</h4>
            </div>
          ))}
        </div>
        {views.length > 10 && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-6 py-2 bg-primary-500 mt-4 rounded-md text-white hover:bg-primary-600/90 hover:outline hover:outline-2 hover:outline-primary-500 hover:outline-offset-2 text-sm"
          >
            Xem thêm {views.length - 10} khung cảnh
          </button>
        )}
        {openModal && (
          <Modal setOpenModal={setOpenModal} className="">
            <div className=" max-h-[32rem] flex flex-col pl-4  mb-4">
              <h2 className="text-xl font-bold block mb-4 w-[32rem]">
                Khung cảnh quanh nhà
              </h2>
              <div className="flex flex-col gap-8 overflow-y-auto h-full">
                {views.map((category, index) => (
                  <div className="flex gap-2 items-center" key={index}>
                    <img
                      src={category.image}
                      alt=""
                      className="w-6 h-6 object-cover"
                    />
                    <h4 className="block">{category.name}</h4>
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
    <div className="mt-8">
      <div className="flex gap-4 items-center">
        <a href={`/profile/${owner.id}`} className="flex gap-4 items-center">
          <Photo
            src={owner.avatar}
            errorSrc={DEFAULT_AVATAR}
            className="min-w-[5rem] h-20 rounded-full object-cover"
          />
          <div className="">
            <h3 className="text-xl font-bold">Chủ nhà {owner.username}</h3>
            <h3 className="text-sm text-gray-500">
              Gia nhập vào{" "}
              {moment(owner.createdAt, "HH:mm DD/MM/YYYY").format("DD/MM/YYYY")}
            </h3>
          </div>
        </a>
        {windowSize.isLargerThan("sm") && (
          <div className="ml-24">
            {owner.totalRate ? (
              <div className="flex">
                {owner.totalRate < 4.2 && (
                  <StarBorderOutlinedIcon className="block h-[1rem] mr-1" />
                )}
                {4.2 <= owner.totalRate && owner.totalRate <= 4.8 && (
                  <StarHalfOutlinedIcon className="block h-[1rem] mr-1" />
                )}
                {4.8 < owner.totalRate && (
                  <StarOutlinedIcon className="block h-[1rem] mr-1" />
                )}
                <h2 className="pr-4 block mt-1">{owner.totalRate}</h2>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <StarBorderRoundedIcon className="text-gray-500" />
                <h5 className="">Chưa có đánh giá</h5>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <RateReviewRoundedIcon className="text-gray-500 scale-75" />
              <h2 className="">{owner.totalRate ?? 0} đánh giá</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewsSection = ({ homeStayReviewRate, homestayTotalReviews }) => {
  const [homestayRate, setHomestayRate] = React.useState(homeStayReviewRate);
  const { accommodationId } = useParams();

  const [reviews, setReviews] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [lastPage, setLastPage] = React.useState(-1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [orderBy, setOrderBy] = React.useState("createdAt");
  const [isDescending, setIsDescending] = React.useState(true);

  function getReviews() {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    if (lastPage === page) {
      return;
    }

    callRequest(
      `accommodation/house-owner/detail/reviews?id=${accommodationId}&orderBy=${orderBy}&size=${5}&page=${page}&isDescending=${isDescending}`,
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
    <div className="mt-8 pt-3 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Đánh giá của khách</h2>
      {homestayRate ? (
        <div className="sm:flex sm:gap-12 w-full p-6 border border-primary-300 bg-primary-50 mb-4">
          <div className="sm:text-center flex sm:block flex-col items-center mb-4">
            <h3 className="text-sm">{`${homestayTotalReviews} đánh giá`}</h3>
            <h3 className="text-2xl font-bold">{`${homestayRate} trên 5`}</h3>
            <div className="flex">
              <RateStars rate={homestayRate} />
            </div>
          </div>
          <div className="flex ml-auto w-full sm:w-64 text-sm cursor-pointer">
            <select
              className=" rounded-md border-gray-300"
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
              name="w-full"
            >
              <option value="1" className="text-sm">
                Theo ngày tạo (mới nhất)
              </option>
              <option value="2" className="text-sm">
                Nhiều sao nhất
              </option>
              <option value="3" className="text-sm">
                Ít sao nhất
              </option>
            </select>
          </div>
        </div>
      ) : (
        <h3 className="flex gap-12 w-full p-6 border border-primary-300 bg-primary-50 mb-4">
          Chưa có đánh giá
        </h3>
      )}

      {reviews?.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((review, index) =>
            index === reviews?.length - 1 ? (
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
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    console.log(review);
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

  const uploadMultipleFiles = async (event) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach((file) => {
        var myHeaders = new Headers();

        var formdata = new FormData();
        formdata.append("image", file);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        callRequest("room/house-owner/upload", requestOptions)
          .then((response) => {
            setImages((imgs) => [...imgs, response.data]);
          })
          .catch((response) => alert(response.message));
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 border p-6">
      <div className="min-w-[16rem] overflow-hidden md:max-w-[16rem]">
        <a
          href={`/profile/${review.owner.id}`}
          className="flex gap-2 items-center overflow-ellipsis "
        >
          <Photo
            src={review.owner.avatar}
            errorSrc={DEFAULT_AVATAR}
            className="min-w-[3rem] h-12 rounded-full object-cover"
          />
          <div className="w-full">
            <h3 className="text-lg font-bold overflow-ellipsis w-full">
              {review.owner.username}
            </h3>
          </div>
        </a>
        <div className="mt-4">
          <h3 className="text-[0.75rem] block">Phòng đã đặt</h3>
          <ul className="list-disc">
            {review.detail.roomNames.map((room, index) => (
              <li className="text-[0.875rem] font-bold ml-8" key={index}>
                {room}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex">
          <div className="">
            <h3 className="!text-sm text-gray-500">
              Nhận xét lúc {review.createdAt}
            </h3>
            <RateStars rate={review.rate} />
          </div>
          <div className="flex ml-auto gap-2">
            {review.canEdit && (
              <button
                onClick={() => {
                  setEditing(true);
                  setRate(review.rate);
                  setReviewContent(review.content);
                  setContentError("");
                  setImages(review.images || []);
                }}
                className="bg-indigo-500 rounded-md text-white hover:bg-indigo-600/90 hover:outline hover:outline-2 hover:outline-indigo-500 hover:outline-offset-2 text-sm disabled:cursor-not-allowed px-2 h-fit py-1"
              >
                Sửa
              </button>
            )}
          </div>
        </div>
        <div ref={innerRef}>
          <XText ellipsis={{ maxLine: 5 }}>
            <HTMLNodes rawHTML={review.content} className="" />
          </XText>
        </div>
        {viewImages && (
          <ImageViewer setViewImages={setViewImages} images={review.images} />
        )}
        <div className="flex my-2 gap-2 flex-wrap">
          {(review.images || []).map((image, index) => (
            <div
              className=" w-32 h-32 rounded-md border border-gray-200 overflow-hidden relative "
              key={index}
              onClick={() => setViewImages(true)}
            >
              <Photo
                src={image}
                className="w-full h-full object-cover cursor-pointer hover:brightness-75"
              />
            </div>
          ))}
        </div>
        {editing && (
          <Modal setOpenModal={setEditing}>
            <div className="w-full max-w-[960px] mx-4 my-2">
              <div className="flex flex-col sm:flex-row gap-4 px-4">
                <div className="min-w-[16rem]">
                  <h3 className="block mb-4">Chia sẻ cảm nghĩ</h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star, index) => {
                      if (rate < star) {
                        return (
                          <StarBorderOutlinedIcon
                            key={index}
                            className="block text-orange-300 cursor-pointer"
                            onClick={() => setRate(star)}
                          />
                        );
                      }
                      return (
                        <StarOutlinedIcon
                          key={index}
                          className="block text-orange-500 cursor-pointer"
                          onClick={() => setRate(star)}
                        />
                      );
                    })}
                  </div>
                  {rate === 1 && (
                    <h3 className="font-bold text-danger-500">
                      Không hài lòng
                    </h3>
                  )}
                  {rate === 2 && (
                    <h3 className="font-bold text-orange-300">Tệ</h3>
                  )}
                  {rate === 3 && (
                    <h3 className="font-bold text-orange-300">Ổn</h3>
                  )}
                  {rate === 4 && (
                    <h3 className="font-bold text-green-500">Tốt</h3>
                  )}
                  {rate === 5 && (
                    <h3 className="font-bold text-green-500">Tuyệt vời</h3>
                  )}
                  <div className="">
                    <h3 className="mt-4">Phòng đã đặt</h3>
                    <ul className="list-disc">
                      {review.detail.roomNames.map((room, index) => (
                        <li className="font-bold ml-8 text-lg" key={index}>
                          {room}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="w-full">
                  <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    className="w-full rounded-md min-h-[12rem] border-gray-300"
                  />
                  {strings.isNotBlank(contentError) && (
                    <label className="mt-2 text-red-500">{contentError}</label>
                  )}
                  <div className="flex my-2 gap-2 flex-wrap">
                    {images.map((image, index) => (
                      <div
                        className=" w-32 h-32 rounded-md border border-gray-200 overflow-hidden relative "
                        key={index}
                      >
                        <img
                          src={image}
                          onError={() => {
                            setImages(images.filter((i) => i !== image));
                          }}
                          alt=""
                          className="w-full h-full object-cover cursor-pointer hover:brightness-75"
                        />
                        <button
                          onClick={() => {
                            setImages(images.filter((i) => i !== image));
                          }}
                          className="rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center absolute right-2 top-2"
                        >
                          <CloseRoundedIcon fontSize="8" />
                        </button>
                      </div>
                    ))}
                    <input
                      onChange={uploadMultipleFiles}
                      id="image-choose"
                      type="file"
                      multiple={true}
                      accept="image/*"
                      hidden
                    />
                    <label
                      htmlFor="image-choose"
                      className="bg-gray-100 rounded-md border-2 border-dashed border-indigo-500 w-32 h-32 text-center flex items-center justify-center cursor-pointer"
                    >
                      <span className="w-full text-center">Thêm ảnh</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <button
                  type="button"
                  onClick={updateReview}
                  className="ml-auto cursor-pointer select-none rounded-md bg-primary-500 px-8 py-2 text-sm font-medium text-white hover:bg-primary-600"
                >
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-1 justify-center mt-4 w-full h-[32rem] relative">
      <img
        onClick={() => setOpenModal(true)}
        src={thumbnail}
        alt=""
        className="hover:brightness-75 cursor-pointer w-full h-full rounded-xl md:rounded-l-xl md:rounded-r-none object-cover col-span-2 row-span-2"
      />
      {size.isLargerThan("md") && (
        <img
          onClick={() => setOpenModal(true)}
          src={photos[0].url}
          alt=""
          className="hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1 rounded-tr-xl xl:rounded-none"
        />
      )}
      {size.isLargerThan("md") && (
        <img
          onClick={() => setOpenModal(true)}
          src={photos[1].url}
          alt=""
          className="hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1 rounded-br-xl xl:rounded-tr-xl xl:rounded-br-none"
        />
      )}
      {size.isLargerThan("xl") && (
        <img
          onClick={() => setOpenModal(true)}
          src={photos[2].url}
          alt=""
          className="hover:brightness-75 cursor-pointer w-full h-full object-cover col-span-1 row-span-1"
        />
      )}
      {size.isLargerThan("xl") && (
        <img
          onClick={() => setOpenModal(true)}
          src={photos[3].url}
          alt=""
          className="hover:brightness-75 cursor-pointer w-full h-full rounded-br-xl object-cover col-span-1 row-span-1"
        />
      )}
      {photos.length > totalImagesShown() && (
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 font-bold absolute right-0 bottom-0 m-4  bg-white rounded-md px-4 py-2"
        >
          + {photos.length - totalImagesShown()} ảnh
        </button>
      )}
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          className="sm:w-fit w-full mx-4 max-w-[1440px]"
        >
          <div className="pl-4 mb-4 mx-0 lg:mx-4 max-h-[80vh] overflow-auto">
            <h3 className="text-2xl mb-4 font-bold">Ảnh của nhà</h3>
            <div className="flex flex-col ">
              <div className="overflow-y-auto h-fullmt-4 columns-2 md:columns-2 lg:columns-2 pr-4">
                {[thumbnail, ...photos.map((photo) => photo.url)].map(
                  (photo, index) => (
                    <img
                      key={index}
                      className="mb-4 hover:brightness-50 rounded-md"
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
    <div className="">
      <div className="md:flex items-start">
        <h1 className="text-2xl font-bold block">{homeStay.name}</h1>
        {homeStay.reviewRate ? (
          <div className="ml-auto flex items-center">
            <div className="flex items-center">
              {homeStay.reviewRate < 4.2 && (
                <StarBorderOutlinedIcon className="block h-[1rem] mr-1" />
              )}
              {4.2 <= homeStay.reviewRate && homeStay.reviewRate <= 4.8 && (
                <StarHalfOutlinedIcon className="block h-[1rem] mr-1" />
              )}
              {4.8 < homeStay.reviewRate && (
                <StarOutlinedIcon className="block h-[1rem] mr-1" />
              )}
              <h2 className="pr-4 block">{homeStay.reviewRate}</h2>
            </div>
            <h2 className="border-l px-4">
              {homeStay.totalReviews ?? 0} nhận xét
            </h2>
            <h2 className="border-l pl-4">
              {homeStay.totalBookings ?? 0} người đã đặt
            </h2>
          </div>
        ) : (
          <div className="ml-auto flex items-center">
            <div className="pr-4">Chưa có đánh giá</div>
            <h2 className="border-l pl-4">
              {homeStay.totalBookings ?? 0} nhận xét
            </h2>
          </div>
        )}
      </div>
      <div className="flex items-center mt-2">
        <LocationOnIcon className="text-gray-500" />
        <h2 className="">{homeStay.address}</h2>
      </div>
    </div>
  );
};

function ImageViewer({ setViewImages, images }) {
  const [selectingIndex, setSelectingIndex] = React.useState(0);
  if (lists.isEmpty(images)) {
    return null;
  }
  return (
    <Modal setOpenModal={setViewImages} className="m-4">
      <div className="mt-2 w-full h-[33vh] sm:w-[67vw] sm:h-[75vh]">
        <div className="relative w-full h-full">
          <img
            src={images[selectingIndex]}
            className="w-full h-full object-cover rounded-md"
          />
          {images.length > 1 && (
            <NavigateBeforeRoundedIcon
              className="absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full left-6 cursor-pointer"
              onClick={() =>
                setSelectingIndex(
                  (index) => (index - 1 + images.length) % images.length
                )
              }
            />
          )}
          {images.length > 1 && (
            <NavigateNextRoundedIcon
              className="absolute top-1/2 -translate-y-1/2 scale-[2] text-primary-500 bg-white rounded-full right-6 cursor-pointer"
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

export default DetailAccommodationForHouseOwner;
