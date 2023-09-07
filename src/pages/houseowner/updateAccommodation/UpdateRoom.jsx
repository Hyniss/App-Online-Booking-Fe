import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import Navbar from "../../../components/navbar/Navbar";
import { callRequest } from "../../../utils/requests";

const UpdateRoom = () => {
  const [room, setRoom] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomDiscount, setRoomDiscount] = useState("");
  const [roomCount, setRoomCount] = useState("");
  const [roomImage, setRoomImage] = useState([]);
  const [roomProperties, setRoomProperty] = useState([]);
  const [roomStatus, setRoomStatus] = useState("");
  const [amentity, setAmentity] = useState([]);
  const [selectAmentity, setSelectAmentity] = useState([]);

  const [images, setImages] = React.useState([]);

  const [roomNameError, setRoomNameError] = useState("");
  const [roomCountError, setRoomCountError] = useState("");
  const [roomImageError, setRoomImageError] = useState("");
  const [roomPropertiesError, setRoomPropertyError] = useState("");
  const [amenitiyError, setAmenitiesError] = useState("");
  const [file, setFile] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const storedToken = localStorage.getItem("token");
  const { accommodationId, roomId } = useParams();
  const navigate = useNavigate();
  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value.trim());
  };

  const handleRoomCountChange = (event) => {
    setRoomCount(event.target.value.trim());
  };

  useEffectOnce(() => {
    fetchRoom();
    fetchCategories();
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}room/house-owner/detail?id=${roomId}&accommodationId=${accommodationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      setRoom(data.data);
      setRoomName(data.data.name);
      setRoomCount(data.data.totalRoomType);
      setRoomImage(data.data.roomImages);
      setRoomProperty(data.data.properties);
      setRoomStatus(data.data.status);
      setSelectAmentity(data.data.amenities.map((x) => x.id));
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}accommodation/house-owner/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      setAmentity(data.data.AMENITY);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLocationChange = (e) => {
    let updatedList = [...selectAmentity];
    const { value, checked } = e.target;
    if (checked) {
      updatedList = [...selectAmentity, value];
    } else {
      updatedList.splice(selectAmentity.indexOf(value), 1);
    }
    setSelectAmentity(updatedList.map((str) => Number(str)));
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
            const name = "random" + Math.random().toString(36).substring(7);
            setRoomImage((imgs) => [...imgs, { name, url: response.data }]);
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

  const handleValueChange = (propertyId, newValue) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.keyId === propertyId) {
          return { ...property, value: newValue };
        }
        return property;
      });
    });
  };

  const handleDecrease = (propertyId) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.keyId === propertyId && parseInt(property.value) > 0) {
          const parsedValue = parseInt(property.value);
          const validValue = isNaN(parsedValue) ? 0 : parsedValue;
          const newKeyValue = validValue - 1;
          return { ...property, value: newKeyValue.toString() };
        }
        return property;
      });
    });
  };

  const handleIncrease = (propertyId) => {
    setRoomProperty((prevProperties) => {
      return prevProperties.map((property) => {
        if (property.keyId === propertyId) {
          const parsedValue = parseInt(property.value);
          const validValue = isNaN(parsedValue) ? 0 : parsedValue;
          const newKeyValue = validValue + 1;
          return { ...property, value: newKeyValue.toString() };
        }
        return property;
      });
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const roomUpdate = {
      id: roomId,
      accommodationId: accommodationId,
      name: roomName,
      status: roomStatus,
      count: roomCount,
      isUpdateImage: "true",
      images: roomImage,
      isUpdateProperty: "true",
      properties: roomProperties.map(({ keyId, value }) => ({
        keyId: keyId.toString(),
        value,
      })),
      amenities: selectAmentity,
    };

    var requestOptionsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify(roomUpdate),
    };

    var requestOptionsValidate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify(roomUpdate),
    };

    callRequest("room/house-owner/update/validate", requestOptionsValidate)
      .then((response) => {
        callRequest("room/house-owner/update", requestOptionsUpdate)
          .then((response) => {
            navigate(`/house-owner/accommodation/${accommodationId}`);
          })
          .catch((response) => {
            if (response.message != null) {
              alert(response.message);
            }
          });
      })
      .catch((response) => {
        const errors = response.data;
        setRoomNameError(errors["name"]);
        setRoomCountError(errors["count"]);
        setRoomImageError(errors["images"]);
        setRoomPropertyError(errors["roomPropertyRequests"]);
        setAmenitiesError(errors["amenities"]);
      });
  };
  const handleAccommodationTypeChange = (e) => {
    setRoomStatus(e.target.value.trim());
  };
  return (
    <div className="w-full h-full overflow-auto">
      <Navbar />
      <div className="p-16 p-8 m-auto md:w-2/3 mb-12 w-full">
        <h1 className="text-3xl font-bold mb-4">Cập nhật phòng</h1>
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
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    type="text"
                    id="roomName"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    helperText={roomNameError}
                    error={roomNameError}
                    inputProps={{ minLength: "1", maxLength: "512" }}
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
                    required
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
                      {roomImage.map((image, index) => (
                        <div
                          className=" w-44 h-44 rounded-md border border-gray-200 overflow-hidden relative "
                          key={index}
                        >
                          <img
                            src={image.url}
                            onError={() => {
                              setRoomImage(images.filter((i) => i !== image));
                            }}
                            alt=""
                            className="w-full h-full object-cover cursor-pointer hover:brightness-75"
                          />
                          <button
                            onClick={() => {
                              setRoomImage((prevImages) => {
                                const updatedImages = [...prevImages];
                                updatedImages.splice(index, 1);
                                return updatedImages;
                              });
                              // setImages(images.filter((i) => i !== image));
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
                  <div className="">
                    Trạng thái:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <div className="accommodation-type w_100">
                    <div>
                      <label htmlFor="openning">
                        <input
                          type="radio"
                          id="house"
                          value="OPENING"
                          checked={roomStatus === "OPENING"}
                          onChange={handleAccommodationTypeChange}
                        />
                        <div>
                          <span>Mở phòng</span>
                        </div>
                      </label>
                    </div>
                    <div>
                      <label htmlFor="close">
                        <input
                          type="radio"
                          id="apartment"
                          value="CLOSED"
                          checked={roomStatus === "CLOSED"}
                          onChange={handleAccommodationTypeChange}
                        />
                        <div>
                          <span>Đóng phòng</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  {/* <div className="error_message">{accommodationTypeError}</div> */}
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomProperty">
                    Thông tin cơ bản về phòng của bạn{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  {roomProperties.map((property) => (
                    <div className="w_100 room-property" key={property.keyId}>
                      <label
                        style={{ fontSize: "16px" }}
                        htmlFor={`property-${property.keyId}`}
                      >
                        {property.key}:
                      </label>
                      <div className="form-value">
                        <a
                          className="value-button decrease-button"
                          onClick={() => handleDecrease(property.keyId)}
                        >
                          -
                        </a>
                        <input
                          type="number"
                          className="input-value"
                          label={property.key}
                          id={`property-${property.keyId}`}
                          value={property.value || "0"}
                          onChange={(e) =>
                            handleValueChange(property.keyId, e.target.value)
                          }
                        />
                        <a
                          className="value-button increase-button"
                          onClick={() => handleIncrease(property.keyId)}
                        >
                          +
                        </a>
                      </div>
                    </div>
                  ))}
                  <div className="error_message">{roomPropertiesError}</div>
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
                            checked={selectAmentity.some(
                              (value) => value === category.id
                            )}
                          />
                          <div>
                            <img src={category.image} width={40} />
                            <span> {category.name}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="error_message">{amenitiyError}</div>
                </div>
                <div className="flex content-center items-center justify-center">
                  <button
                    onClick={handleSubmit}
                    className="btn__primary mt-3.5"
                    type="submit"
                  >
                    Cập nhật phòng
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

export default UpdateRoom;
