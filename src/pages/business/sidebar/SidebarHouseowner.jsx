import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ArticleIcon from "@mui/icons-material/Article";
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../../context/Auth";
// import { DarkModeContext } from "../../context/darkModeContext";

const SidebarHouseowner = (className = "") => {
  // const { dispatch } = useContext(DarkModeContext);
  const [user, ,] = useAuth(["HOUSE_OWNER"]);
  const roles = user?.roles || [];
  return (
    <div className={`sidebar ${className}`}>
      <div className="center">
        <ul>
          <p className="title">Nội dung</p>
          <p className="title">Danh sách</p>
          <Link to="/business/transaction" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span className="block !text-sm font-bold">
                Lịch sử đặt phòng
              </span>
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

export default SidebarHouseowner;
