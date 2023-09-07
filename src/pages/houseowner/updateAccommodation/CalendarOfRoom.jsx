import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { useEffectOnce } from "../../../CustomHooks/hooks";

const CalendarOfRoom = () => {
  const [data, setData] = useState([]);
  const { accommodationId, roomId } = useParams();
  const storedToken = localStorage.getItem("token");
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [dateUpdate, setDate] = useState("");
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const year = firstDayOfMonth.getFullYear().toString();
  const month = String(firstDayOfMonth.getMonth() + 1)
    .padStart(2, "0")
    .toString();
  const day = String(firstDayOfMonth.getDate()).padStart(2, "0").toString();

  const formattedDate = `${year}-${month}-${day}`;
  useEffect(() => {
    fetchAccommodationData();
  }, []);

  const fetchAccommodationData = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        id: accommodationId,
        from: formattedDate,
      }),
    };
    await fetch(
      `${process.env.REACT_APP_API_PATH}accommodation/house-owner/detail/price`,
      requestOptions
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((data) => {
        console.error(data);
      });
  };

  const filteredData = [];

  function getDataOfOneRoom(roomID) {
    for (const date in data) {
      const bookings = data[date];
      for (const booking of bookings) {
        if (booking.roomId == roomID) {
          filteredData.push({
            date: date,
            // roomId: booking.roomId,
            // name: booking.name,
            // discount: booking.discount,
            title: `${Number(booking.price).toLocaleString()} VND`,
          });
        }
      }
    }
  }
  getDataOfOneRoom(roomId);
  function handleDateClick(info) {
    console.log("as");
    const clickedEvent = filteredData.find(
      (event) => event.date === info.dateStr
    );
    if (clickedEvent) {
      setModalVisible(true);
      setDate(info.dateStr);
      setNewTitle(clickedEvent.title);
    }
  }
  function handleModalSubmit() {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        roomId: roomId,
        amount: newTitle,
        type: "PRICE",
        fromDate: dateUpdate,
        toDate: dateUpdate,
      }),
    };

    fetch(
      `${process.env.REACT_APP_API_PATH}room/house-owner/update/amount`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setModalVisible(false);
        fetchAccommodationData(); // Update calendar with the latest data
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        editable={true}
        selectable={true}
        dateClick={handleDateClick}
        events={filteredData}
      />
      {modalVisible && (
        <div className="modal">
          <form onSubmit={handleModalSubmit}>
            <label>
              New Title:
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CalendarOfRoom;
