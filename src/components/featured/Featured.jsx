import React from "react";
import "./Featured.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = ({ todayRevenue, lastWeekRevenue, lastMonthRevenue }) => {
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Tổng doanh thu</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <p className="title">Ngày hiện tại</p>
        <p className="amount">
          {todayRevenue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <p className="desc">
          Có thể sẽ không bao gồm các khoản thanh toán mới nhất.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Tuần trước</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                {lastWeekRevenue.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Tháng trước</div>
            <div className="itemResult positive">
              <KeyboardArrowUpOutlinedIcon fontSize="small" />
              <div className="resultAmount">
                {lastMonthRevenue.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
