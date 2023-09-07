import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import Navbar from "../../../components/navbar/Navbar";
import { callRequest } from "../../../utils/requests";
import "./CreateRoom.css";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const [roomDiscount, setRoomDiscount] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [roomImage, setRoomImage] = useState([]);
  const [roomProperties, setRoomProperty] = useState([]);
  const [weekdayPricePercent, setWeekdayPricePercent] = useState("");
  const [weekendPricePercent, setWeekendPricePercent] = useState("");
  const [specialDayPricePercent, setSpecialDayPricePercent] = useState("");
  const [weekdayDiscountPercent, setWeekdayDiscountPercent] = useState("");
  const [weekendDiscountPercent, setWeekendDiscountPercent] = useState("");
  const [specialDayDiscountPercent, setSpecialDayDiscountPercent] =
    useState("");
  const [amentity, setAmentity] = useState([]);
  const [selectAmentity, setSelectAmentity] = useState([]);
  const [images, setImages] = React.useState([]);

  const [roomNameError, setRoomNameError] = useState("");
  const [roomPriceError, setRoomPriceError] = useState("");
  const [roomDiscountError, setRoomDiscountError] = useState("");
  const [roomCountError, setRoomCountError] = useState("");
  const [roomImageError, setRoomImageError] = useState("");
  const [roomAmentityError, setAmentityError] = useState("");
  const [roomPropertiesError, setRoomPropertyError] = useState("");
  const [weekdayPricePercentError, setWeekdayPricePercentError] = useState("");
  const [weekendPricePercentError, setWeekendPricePercentError] = useState("");
  const [specialDayPricePercentError, setSpecialDayPricePercentError] =
    useState("");
  const [weekdayDiscountPercentError, setWeekdayDiscountPercentError] =
    useState("");
  const [weekendDiscountPercentError, setWeekendDiscountPercentError] =
    useState("");
  const [specialDayDiscountPercentError, setSpecialDayDiscountPercentError] =
    useState("");
  const [file, setFile] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const storedToken = localStorage.getItem("token");
  const { accommodationId } = useParams();
  const [errorMes, setErrorMes] = useState("");
  const navigate = useNavigate();
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
  };

  const handleRoomPriceChange = (event) => {
    setRoomPrice(event.target.value);
  };

  const handleRoomDiscountChange = (event) => {
    setRoomDiscount(event.target.value);
  };

  const handleRoomCountChange = (event) => {
    setRoomCount(event.target.value);
  };

  const handleWeekdayPricePercentChange = (event) => {
    setWeekdayPricePercent(event.target.value);
  };
  const handleWeekendPricePercentChange = (event) => {
    setWeekendPricePercent(event.target.value);
  };
  const handleSpecialDayPricePercentChange = (event) => {
    setSpecialDayPricePercent(event.target.value);
  };

  const handleSpecialDayDiscountPercentChange = (event) => {
    setSpecialDayDiscountPercent(event.target.value);
  };
  const handleWeekdayDiscountPercentChange = (event) => {
    setWeekdayDiscountPercent(event.target.value);
  };
  const handleWeekendDiscountPercentChange = (event) => {
    setWeekendDiscountPercent(event.target.value);
  };

  useEffectOnce(() => {
    fetchProperty();
    fetchCategories();
  });

  const fetchProperty = async () => {
    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };

    callRequest("accommodation/house-owner/properties", requestOptions)
      .then((response) => {
        setRoomProperty(response.data);
      })
      .catch((response) => alert(response.message));
  };

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
        setAmentity(response.data.AMENITY);
      })
      .catch((response) => alert(response.message));
  };

  const handleLocationChange = (e) => {
    let updatedList = [...selectedCategories];
    const { value, checked } = e.target;
    if (checked) {
      updatedList = [...selectedCategories, value];
    } else {
      updatedList.splice(selectedCategories.indexOf(value), 1);
    }
    setSelectedCategories(updatedList.map((str) => Number(str)));
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

  const handleValueChange = (propertyId, newKeyValue) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.id === propertyId) {
          return { ...property, newKey: newKeyValue };
        }
        return property;
      });
    });
  };

  const handleDecrease = (propertyId) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.id === propertyId && parseInt(property.newKey) > 0) {
          const parsedValue = parseInt(property.newKey);
          const validValue = isNaN(parsedValue) ? 0 : parsedValue;
          const newKeyValue = validValue - 1;
          return { ...property, newKey: newKeyValue.toString() };
        }
        return property;
      });
    });
  };

  const handleIncrease = (propertyId) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.id === propertyId) {
          const parsedValue = parseInt(property.newKey);
          const validValue = isNaN(parsedValue) ? 0 : parsedValue;
          const newKeyValue = validValue + 1;
          return { ...property, newKey: newKeyValue.toString() };
        }
        return property;
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const roomData = {
      accommodationId: accommodationId,
      name: roomName,
      status: "OPENING",
      price: roomPrice,
      discount: roomDiscount,
      count: roomCount,
      roomImageRequests: fileUpload,
      roomPropertyRequests: roomProperties.map(({ id, newKey = "0" }) => ({
        keyId: id,
        value: newKey,
      })),
      amenities: selectedCategories,
      weekdayPricePercent: weekdayPricePercent,
      weekendPricePercent: weekendPricePercent,
      specialDayPricePercent: specialDayPricePercent,
      weekdayDiscountPercent: weekdayDiscountPercent,
      specialDayDiscountPercent: specialDayDiscountPercent,
      weekendDiscountPercent: weekendDiscountPercent,
    };

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify(roomData),
    };

    callRequest("room/house-owner/validate", requestOptions)
      .then((response) => {
        callRequest("room/house-owner/create", requestOptions)
          .then((response) => {
            navigate(`/house-owner/accommodation/${accommodationId}`);
          })
          .catch((response) => alert(response.message));
      })
      .catch((response) => {
        const errors = response.data;
        setRoomNameError(errors["name"]);
        setRoomPriceError(errors["price"]);
        setRoomDiscountError(errors["discount"]);
        setRoomCountError(errors["count"]);
        setRoomImageError(errors["roomImageRequests"]);
        setRoomImageError(errors["roomImageRequests"]);
        setRoomPropertyError(errors["roomPropertyRequests"]);
        setWeekdayPricePercentError(errors["weekdayPricePercent"]);
        setWeekendPricePercentError(errors["weekendPricePercent"]);
        setSpecialDayPricePercentError(errors["specialDayPricePercent"]);
        setWeekdayDiscountPercentError(errors["weekdayDiscountPercent"]);
        setWeekendDiscountPercentError(errors["weekendDiscountPercent"]);
        setSpecialDayDiscountPercentError(errors["specialDayDiscountPercent"]);
        setAmentityError(errors["amenities"]);
      });
  };
  return (
    <div className="w-full h-full overflow-auto">
      <Navbar />
      <div className="p-16 p-8 m-auto md:w-2/3 mb-12 w-full">
        <h1 className="text-3xl font-bold mb-4">Tạo phòng mới</h1>
        <div className="mt-4">
          <div className="grid gap-3 justify-center w-full mt-3">
            <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
              <div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomName">
                    Tên phòng:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    field={"Room name"}
                    className="block col-span-8 w-full"
                    inputClassName="mt-2"
                    type="text"
                    id="roomName"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    error={roomNameError}
                    helperText={roomNameError}
                    inputProps={{ minLength: 1, maxLength: 512 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomPrice">
                    Giá gốc:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="roomPrice"
                    value={roomPrice}
                    onChange={handleRoomPriceChange}
                    helperText={roomPriceError}
                    error={roomPriceError}
                    type="number"
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Số lượng phòng:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="roomCount"
                    value={roomCount}
                    onChange={handleRoomCountChange}
                    helperText={roomCountError}
                    error={roomCountError}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomImage">
                    Ảnh chụp phòng thuộc danh mục nhà cho thuê của bạn:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
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
                  <div className="error_message">{roomImageError}</div>
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomProperty">
                    Thông tin cơ bản về phòng của bạn:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  {roomProperties.map((property) => (
                    <div className="w_100 room-property" key={property.id}>
                      <label
                        style={{ fontSize: "16px" }}
                        htmlFor={`property-${property.id}`}
                      >
                        {property.value}:
                      </label>
                      <div className="form-value">
                        <a
                          className="value-button decrease-button"
                          onClick={() => handleDecrease(property.id)}
                        >
                          -
                        </a>
                        <input
                          className="input-value"
                          type="number"
                          id={`property-${property.id}`}
                          value={property.newKey || "0"}
                          onChange={(e) =>
                            handleValueChange(property.id, e.target.value)
                          }
                        />
                        <a
                          className="value-button increase-button"
                          onClick={() => handleIncrease(property.id)}
                        >
                          +
                        </a>
                      </div>
                    </div>
                  ))}

                  <div className="error_message">{roomPropertiesError}</div>
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giá phòng trong tuần (x% * giá gốc):{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="weekdayPricePercent"
                    value={weekdayPricePercent}
                    onChange={handleWeekdayPricePercentChange}
                    helperText={weekdayPricePercentError}
                    error={weekdayPricePercentError}
                    inputProps={{ minLength: 3, maxLength: 4 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giảm giá trong tuần:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="weekdayPricePercent"
                    value={weekdayDiscountPercent}
                    onChange={handleWeekdayDiscountPercentChange}
                    helperText={weekdayDiscountPercentError}
                    error={weekdayDiscountPercentError}
                    inputProps={{ minLength: 1, maxLength: 3 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giá phòng cuối tuần (x% * giá gốc):{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="weekendPricePercent"
                    value={weekendPricePercent}
                    onChange={handleWeekendPricePercentChange}
                    helperText={weekendPricePercentError}
                    error={weekendPricePercentError}
                    inputProps={{ minLength: 3, maxLength: 4 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giảm giá cuối tuần:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="weekdayPricePercent"
                    value={weekendDiscountPercent}
                    onChange={handleWeekendDiscountPercentChange}
                    helperText={weekendDiscountPercentError}
                    error={weekendDiscountPercentError}
                    inputProps={{ minLength: 1, maxLength: 3 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giá phòng vào ngày lễ (x% * giá gốc):{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="specialDayPricePercent"
                    value={specialDayPricePercent}
                    onChange={handleSpecialDayPricePercentChange}
                    helperText={specialDayPricePercentError}
                    error={specialDayPricePercentError}
                    inputProps={{ minLength: 3, maxLength: 4 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Giảm giá theo ngày lễ:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    type="number"
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="weekdayPricePercent"
                    value={specialDayDiscountPercent}
                    onChange={handleSpecialDayDiscountPercentChange}
                    helperText={specialDayDiscountPercentError}
                    error={specialDayDiscountPercentError}
                    inputProps={{ minLength: 1, maxLength: 3 }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="">
                    Tiện ích:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <div className="accommodation-category w_100">
                    {amentity.map((category) => (
                      <div key={category.id}>
                        <label
                          className="checkbox-button"
                          htmlFor={category.id}
                        >
                          <input
                            type="checkbox"
                            id={category.id}
                            value={category.id}
                            onChange={handleLocationChange}
                          />
                          <div>
                            <img src={category.image} width={40} />
                            <span
                              style={{
                                textTransform: "capitalize",
                              }}
                            >
                              {" "}
                              {category.name}
                            </span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="error_message">{roomAmentityError}</div>
                </div>
                <div className="flex content-center items-center justify-center">
                  <button
                    onClick={handleSubmit}
                    className="btn__primary"
                    type="submit"
                  >
                    Thêm phòng mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
