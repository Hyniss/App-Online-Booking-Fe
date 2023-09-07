import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import "./DetailRoom.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from "../../../components/base/Animations";
import { TextField } from "@mui/material";
import moment from "moment/moment";

const DetailRoom = () => {
  const [room, setRoom] = useState(null);
  const { accommodationId, roomId } = useParams();
  const storedToken = localStorage.getItem("token");
  const [listPrice, setPrice] = useState([]);
  const [listPriceWeek, setPriceWeek] = useState([]);
  const [listPriceWeekend, setPriceWeekend] = useState([]);
  const [listPriceSpecialDay, setPriceSpecialDay] = useState([]);
  const [customDay, setCustomDay] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedOptionError, setSelectedOptionError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffectOnce(() => {
    fetchPrice();
  }, []);

  useEffectOnce(() => {
    fetchAccommodation();
  }, []);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const fetchPrice = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}accommodation/house-owner/detail/price?id=${accommodationId}&date=${formattedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const roomPriceList = await response.json();
      const roomPrice = roomPriceList.data;
      const priceOnRoom = roomPrice[roomId];
      const weekData = priceOnRoom
        .filter((item) => item.dayType === "WEEKDAY" && item.type === "PRICE")
        .sort((a, b) => a.id - b.id);
      const weekendData = priceOnRoom
        .filter((item) => item.dayType === "WEEKEND" && item.type === "PRICE")
        .sort((a, b) => a.id - b.id);
      const specialDayData = priceOnRoom
        .filter(
          (item) => item.dayType === "SPECIAL_DAY" && item.type === "PRICE"
        )
        .sort((a, b) => a.id - b.id);
      const customDayData = priceOnRoom
        .filter((item) => item.dayType === "CUSTOM")
        .sort((a, b) => a.id - b.id);
      setPrice(priceOnRoom);
      setPriceWeek(weekData);
      setPriceWeekend(weekendData);
      setPriceSpecialDay(specialDayData);
      setCustomDay(customDayData);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const fetchAccommodation = async () => {
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
      const roomData = await response.json();
      setRoom(roomData.data);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const updatePrice = async (event) => {
    event.preventDefault();

    const data = {
      roomId: roomId,
      amount: amount,
      type: "PRICE",
      dayType: selectedOption,
      fromDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      toDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
    };

    try {
      const updateResponse = await fetch(
        `${process.env.REACT_APP_API_PATH}room/house-owner/update/amount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (updateResponse.ok) {
        console.log("Room validated successfully:", updateResponse);
        toggleModal();
        window.location.reload();
      } else {
        const validateData = await updateResponse.json();
        const errors = validateData.data;
        setAmountError(errors["amount"]);
        setStartDateError(errors["fromDate"]);
        setEndDateError(errors["toDate"]);
      }
    } catch (error) {
      console.error("Error update room:", error);
    }
  };
  const [loading, setLoading] = useState(true);
  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([fetchPrice(), fetchAccommodation()]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const navigate = useNavigate();

  const navigateTo = () => {
    // 👇️ navigate to /contacts
    navigate(
      `/house-owner/accommodation/${accommodationId}/updateRoom/${roomId}`
    );
  };

  if (loading || !room || !listPrice) {
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
    <div className="single">
      <div className="singleContainer">
        <Navbar />
        <div className="mt-4 mb-4 flex justify-end mr-4">
          <button onClick={navigateTo} className="btn__primary">
            Cập nhật chỗ ở
          </button>
        </div>
        <div className="top w-full">
          <div style={{ width: "100%" }} className="left">
            <h1 className="title">Thông tin cơ bản</h1>
            <div className="item">
              <img
                className="itemImg"
                src={room.roomImages[0].url}
                alt="thumbnail"
              />
              <div className="details">
                <h1 className="itemTitle">{room.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Giá gốc:</span>
                  <span className="itemValue">
                    {room.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                  <button
                    className="ml-1.5 px-1 btn__primary"
                    onClick={toggleModal}
                  >
                    Cập nhật giá
                  </button>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giá trong tuần:</span>
                  <span className="itemValue">
                    {listPriceWeek[0].price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giá cuối tuần:</span>
                  <span className="itemValue">
                    {listPriceWeekend[0].price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Giá ngày lễ:</span>
                  <span className="itemValue">
                    {listPriceSpecialDay[0].price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div className="detailItem">
                  {customDay.length !== 0 ? (
                    <>
                      <span className="itemKey">Giá cập nhật:</span>
                      <span className="itemValue">
                        {customDay[0].price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}{" "}
                        từ {customDay[0].fromDate.split(" ")[0]} tới{" "}
                        {customDay[0].toDate.split(" ")[0]}
                      </span>
                    </>
                  ) : (
                    <span style={{ display: "none" }}></span>
                  )}
                </div>
                <div className="detailItem">
                  <span className="itemKey">Trạng thái:</span>
                  <span className="itemValue">{room.status}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số lượng phòng:</span>
                  <span className="itemValue">{room.totalRoomType}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Thông tin phòng:</span>
                </div>
                {room.properties.map((property) => (
                  <div className="detailItem" key={property.keyId}>
                    <span
                      style={{ textTransform: "capitalize" }}
                      className="itemKey"
                    >
                      {property.key}
                    </span>
                    :<span className="itemValue">{property.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div>
            <div>Ngày bắt đầu</div>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              placeholderText="Ngày bắt đầu"
            />
            <div className="error_message">{startDateError}</div>
          </div>
          <div className="mt-3 w-full">
            <div>Ngày kết thúc</div>
            <DatePicker
              className="w-full"
              selected={endDate}
              onChange={handleEndDateChange}
              placeholderText="Ngày kết thúc"
            />
            <div className="error_message">{endDateError}</div>
          </div>
          <div className="mt-3">
            <div>Giá cập nhật (x% * giá gốc)</div>
            <TextField
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              helperText={amountError}
              error={amountError}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn__primary mr-2" onClick={updatePrice}>
              Save
            </button>
            <button
              className="flex gap-2 items-center cursor-pointer px-2 py-3 bg-gray-200 hover:bg-gray-300  rounded-md"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailRoom;
