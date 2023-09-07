import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import "./BusinessBookingDetail.css";
import { Spinner } from "../../../components/base/Animations";

const BusinessTransactionDetail = () => {
  const [transaction, setTransaction] = useState(null);
  const { transactionId } = useParams();
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    fetchBooking();
  }, [transactionId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}transaction/business-owner?id=${transactionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();
      setTransaction(data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };

  if (!transaction) {
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
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
            <div className="item">
              <div className="details">
                <h1 className="itemTitle">{transaction.data.id}</h1>
                <div className="detailItem">
                  <span className="itemKey">Amount:</span>
                  <span className="itemValue">{transaction.data.amount}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Payment Method:</span>
                  <span className="itemValue">
                    {transaction.data.paymentMethod}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Creator:</span>
                  <span className="itemValue">
                    {transaction.data.creator?.email}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Receiver:</span>
                  <span className="itemValue">
                    {transaction.data.receiver?.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTransactionDetail;
