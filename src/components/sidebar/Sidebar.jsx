import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import StoreIcon from "@mui/icons-material/Store";
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
// import { DarkModeContext } from "../../context/darkModeContext";

const Sidebar = (className = "") => {
  // const { dispatch } = useContext(DarkModeContext);
  return (
    <div className={`sidebar ${className}`}>
      <div className="top border-b border-gray-200">
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <span className="logo">H2Sadmin</span>
        </Link>
      </div>
      <div className="center">
        <ul>
          <p className="title">Danh sách</p>
          <Link to="/admin/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Người dùng</span>
            </li>
          </Link>
          <Link to="/admin/accommodation" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Chỗ ở</span>
            </li>
          </Link>
          <Link to="/admin/contract" style={{ textDecoration: "none" }}>
            <li>
              <CreditCardIcon className="icon" />
              <span>Hợp đồng</span>
            </li>
          </Link>
          <Link to="/admin/company" style={{ textDecoration: "none" }}>
            <li>
              <BusinessIcon className="icon" />
              <span>Công ty</span>
            </li>
          </Link>
        </ul>
      </div>
      {/* <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
