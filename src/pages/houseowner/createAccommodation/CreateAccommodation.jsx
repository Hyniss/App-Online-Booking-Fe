import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import { Spinner } from "../../../components/base/Animations";
import { GeoMap } from "../../../components/base/GeoMap";
import Navbar from "../../../components/navbar/Navbar";
import { callRequest } from "../../../utils/requests";
import "./CreateAccommodation.css";

const CreateAccommodation = () => {
  const [accommodationName, setAccommodationName] = useState("");
  const [accommodationThumbnail, setAccommodationThumbnail] = useState([]);
  const [accommodationDescription, setAccommodationDescription] = useState("");
  const [accommodationShortDescription, setAccommodationShortDescription] =
    useState("");
  const [images, setImages] = React.useState([]);
  const [accommodationAddress, setAccommodationAddress] = useState("");
  const [accommodationLatitude, setAccommodationLatitude] = useState("");
  const [accommodationLongitude, setAccommodationLongitude] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [accommodationImages, setAccommodationImages] = useState([]);
  const [accommodationLocation, setAccommodationLocation] = useState([]);
  const [location, setLocation] = React.useState();
  const [accommodationNameError, setAccommodationNameError] = useState("");
  const [accommodationThumbnailError, setAccommodationThumbnailError] =
    useState("");
  const [accommodationDescriptionError, setAccommodationDescriptionError] =
    useState("");
  const [
    accommodationShortDescriptionError,
    setAccommodationShortDescriptionError,
  ] = useState("");
  const [accommodationAddressError, setAccommodationAddressError] =
    useState("");
  const [accommodationLatitudeError, setAccommodationLatitudeError] =
    useState("");
  const [accommodationLongitudeError, setAccommodationLongitudeError] =
    useState("");
  const [accommodationTypeError, setAccommodationTypeError] = useState("");
  const [accommodationImagesError, setAccommodationImagesError] = useState("");
  const [accommodationLocationError, setAccommodationLocationError] =
    useState("");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);
  const [file, setFile] = useState([]);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [errorMes, setErrorMes] = useState("");
  let listImage = [];

  useEffectOnce(() => {
    fetchCategories();
  });

  const fetchCategories = async () => {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };

    callRequest("accommodation/house-owner/categories", requestOptions)
      .then((response) => {
        setAccommodationLocation(response.data.LOCATION);
      })
      .catch((response) => alert(response.message));
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
          .then(() => {
            setFileUpload(
              images.map((url) => {
                const name = "random" + Math.random().toString(36).substring(7); // Generate a random name
                return { name, url };
              })
            );
          })
          .catch((response) => alert(response.message));
      });
    }
  };

  const uploadFiles = async (event) => {
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
            setAccommodationThumbnail((imgs) => [...imgs, response.data]);
          })
          .catch((response) => alert(response.message));
      });
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      setFileUpload(
        images.map((url) => {
          const name = "random" + Math.random().toString(36).substring(7); // Generate a random name
          return { name, url };
        })
      );
    }
  }, [images]);

  console.log(fileUpload);

  const handleLocationChange = (e) => {
    let updatedList = [...selectedLocation];
    const { value, checked } = e.target;
    if (checked) {
      updatedList = [...selectedLocation, value];
    } else {
      updatedList.splice(selectedLocation.indexOf(value), 1);
    }
    setSelectedLocation(updatedList.map((str) => Number(str)));
  };

  const handleAccommodationTypeChange = (e) => {
    const selectedType = e.target.value;
    if (selectedType === "HOUSE" || selectedType === "APARTMENT") {
      window.alert(
        ` Với chỗ ở thuộc loại hình là nhà (HOUSE) hoặc căn hộ (APARTMENT) thì chỉ có duy nhất 1 phòng.`
      );
    }

    setAccommodationType(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accommodationData = {
      name: accommodationName,
      thumbnail: fileUpload[0]?.url || "",
      shortDescription: accommodationShortDescription,
      description: accommodationDescription,
      address: accommodationAddress,
      latitude: accommodationLatitude,
      longitude: accommodationLongitude,
      type: accommodationType,
      image: fileUpload,
      category: selectedCategories,
      location: selectedLocation,
    };

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify(accommodationData),
    };

    callRequest("accommodation/house-owner/validate", requestOptions)
      .then((response) => {
        callRequest("accommodation/house-owner/create", requestOptions)
          .then((response) => {
            const accommodationId = response.data.accommodationId;
            navigate(`room/${accommodationId}`);
          })
          .catch((response) => alert(response.message));
      })
      .catch((response) => {
        const errors = response.data;
        setAccommodationNameError(errors["name"]);
        setAccommodationDescriptionError(errors["description"]);
        setAccommodationShortDescriptionError(errors["shortDescription"]);
        setAccommodationAddressError(errors["address"]);
        setAccommodationLatitudeError(errors["latitude"]);
        setAccommodationLongitudeError(errors["longitude"]);
        setAccommodationTypeError(errors["type"]);
        setAccommodationImagesError(errors["image"]);
        setAccommodationLocationError(errors["location"]);
      });
  };

  if (!accommodationLocation) {
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
    <div className="add-accommodation-page w-full h-full overflow-auto">
      <Navbar />
      <div className="contract-content">
        <h1 className="text-3xl font-bold mb-4">Thêm chỗ ở mới</h1>
        <div className="mt-4">
          <div className="grid gap-3 justify-center w-full mt-3">
            <div className="add-accommodation-form w-full">
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Tên chỗ ở:
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <TextField
                  field={"Accommodation name"}
                  className="block col-span-8 w-full"
                  inputClassName="mt-2"
                  error={accommodationNameError}
                  helperText={accommodationNameError}
                  onChange={(e) => setAccommodationName(e.target.value.trim())}
                  minLength={1}
                  maxLength={1024}
                />
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Mô tả ngắn về chỗ ở:
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <TextField
                  field={"Accommodation short description:"}
                  className="block col-span-8 w-full"
                  inputClassName="mt-2"
                  error={accommodationShortDescriptionError}
                  helperText={accommodationShortDescriptionError}
                  onChange={(e) =>
                    setAccommodationShortDescription(e.target.value.trim())
                  }
                  minLength={1}
                  maxLength={1024}
                />
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Mô tả về chỗ ở:
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <ReactQuill
                  className="w_100 margin_bottom_40px"
                  value={accommodationDescription}
                  onChange={(value) => setAccommodationDescription(value)}
                />
                <div className="error_message">
                  {accommodationDescriptionError}
                </div>
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Địa chỉ:{" "}
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <TextField
                  field={"Accommodation address:"}
                  className="block col-span-8 w-full"
                  inputClassName="mt-2"
                  helperText={accommodationAddressError}
                  error={accommodationAddressError}
                  onChange={(e) =>
                    setAccommodationAddress(e.target.value.trim())
                  }
                  minLength={1}
                  maxLength={2048}
                />
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Loại hình cho thuê:{" "}
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <div className="accommodation-type w_100">
                  <div>
                    <label className="checkbox-button" htmlFor="house">
                      <input
                        type="radio"
                        id="house"
                        value="HOUSE"
                        checked={accommodationType === "HOUSE"}
                        onChange={handleAccommodationTypeChange}
                      />
                      <div>
                        <span>
                          <CottageOutlinedIcon />
                        </span>
                        <span>Nhà cho thuê</span>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="checkbox-button" htmlFor="apartment">
                      <input
                        type="radio"
                        id="apartment"
                        value="APARTMENT"
                        checked={accommodationType === "APARTMENT"}
                        onChange={handleAccommodationTypeChange}
                      />
                      <div>
                        <span>
                          <ApartmentOutlinedIcon />
                        </span>
                        <span>Căn hộ cho thuê</span>
                      </div>
                    </label>
                  </div>
                  <div>
                    <label className="checkbox-button" htmlFor="hotel">
                      <input
                        type="radio"
                        id="hotel"
                        value="HOTEL"
                        checked={accommodationType === "HOTEL"}
                        onChange={handleAccommodationTypeChange}
                      />
                      <div>
                        <span>
                          <HomeWorkOutlinedIcon />
                        </span>
                        <span>Khách sạn</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="error_message">{accommodationTypeError}</div>
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div className="">
                  Điều nào sau đây mô tả chính xác về chỗ ở của bạn:{" "}
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                <div className="accommodation-category w_100">
                  {accommodationLocation.map((category) => (
                    <div key={category.id}>
                      <label className="checkbox-button" htmlFor={category.id}>
                        <input
                          type="checkbox"
                          id={category.id}
                          value={category.id}
                          onChange={handleLocationChange}
                        />
                        <div>
                          <img src={category.image} width={40} />
                          <span> {category.name}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="error_message">
                  {accommodationLocationError}
                </div>
              </div>
              <div className="mbsc-row margin_bottom_20px w-full">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="">
                    Ảnh chụp chỗ ở thuộc danh mục của bạn:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <div>
                    Bạn sẽ cần 5 bức ảnh để bắt đầu. Về sau, bạn vẫn có thể đăng
                    thêm hoặc thay đổi ảnh. Ảnh đầu tiên sẽ được đặt làm ảnh bìa
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex my-2 gap-2 flex-wrap">
                    {images.map((image, index) => (
                      <div
                        className=" w-44 h-44 rounded-md border border-gray-200 overflow-hidden relative "
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
                      className="bg-gray-100 rounded-md border-2 border-dashed border-indigo-500 w-44 h-44 text-center flex items-center justify-center cursor-pointer"
                    >
                      <span className="w-full text-center">
                        Tải lên từ thiết bị của bạn
                      </span>
                    </label>
                  </div>
                </div>
                <div className="error_message">{accommodationImagesError}</div>
              </div>
              <div>
                <div>
                  Xác nhận địa chỉ của bạn:{" "}
                  <span className="text-red-500 ml-1 font-bold text-xl">*</span>
                </div>
                {accommodationLocation?.length > 0 && (
                  <GeoMap
                    className="relative w-full h-[36rem] mt-4 rounded-md overflow-hidden w-full h-96"
                    markers={[location]}
                    searchable={true}
                    onClick={(lat, long) => {
                      setLocation({
                        latitude: lat,
                        longitude: long,
                      });
                      setAccommodationLatitude(lat);
                      setAccommodationLongitude(long);
                    }}
                  ></GeoMap>
                )}
                <div className="error_message">
                  {accommodationLatitudeError}
                </div>
              </div>
              <div className="contact-submit">
                <button
                  onClick={handleSubmit}
                  className="btn__primary mt-3.5"
                  type="submit"
                >
                  Thêm chỗ ở mới
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccommodation;
