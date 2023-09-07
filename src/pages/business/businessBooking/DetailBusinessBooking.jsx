import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import "./BusinessBookingDetail.css";
import { callRequest } from "../../../utils/requests";
import { Spinner } from "../../../components/base/Animations";

const DetailBusinessBooking = () => {
  const [booking, setBooking] = useState(null);
  const { bookingId } = useParams();
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}booking-request/business-owner?id=${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking:", error);
    }
  };

  if (!booking) {
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
  const rows = booking.data.bookingRequestSpecifics;
  return (
    <div className="single">
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Information Booking</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">Booking: {booking.data.id}</h1>
                <div className="detailItem">
                  <span className="itemKey">User name:</span>
                  <span className="itemValue">
                    {booking.data.user.username}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">User email:</span>
                  <span className="itemValue">{booking.data.user.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Accommodation:</span>
                  <span className="itemValue">
                    {booking.data.accommodationName}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Total rooms:</span>
                  <span className="itemValue">{booking.data.totalRooms}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Checkin At:</span>
                  <span className="itemValue">{booking.data.checkinAt}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Checkout At:</span>
                  <span className="itemValue">{booking.data.checkoutAt}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Travel statement:</span>
                  <span className="itemValue">
                    {booking.data.travelStatement.name}
                    <br></br>
                    {booking.data.travelStatement.note}
                    <br></br>
                    {booking.data.details[0].value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Rooms booking</h1>
          <TableContainer component={Paper} className="table">
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="tableCell">Rooms ID</TableCell>
                  <TableCell className="tableCell">Name</TableCell>
                  <TableCell className="tableCell">Total Rooms</TableCell>
                  <TableCell className="tableCell">Price</TableCell>
                  <TableCell className="tableCell">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="tableCell">{row.room.id}</TableCell>
                    <TableCell className="tableCell">{row.room.name}</TableCell>
                    <TableCell className="tableCell">
                      {row.totalRooms}
                    </TableCell>
                    <TableCell className="tableCell">{row.price}</TableCell>
                    <TableCell className="tableCell">
                      {row.room.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default DetailBusinessBooking;
