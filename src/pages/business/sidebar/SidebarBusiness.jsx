import ArticleIcon from "@mui/icons-material/Article";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth";
import "./Sidebar.css";

const SidebarBusiness = ({ className = "", company = null }) => {
    const [user, ,] = useAuth(["BUSINESS_ADMIN", "BUSINESS_OWNER", "BUSINESS_MEMBER"]);
    const roles = user?.roles || [];
    return (
        <div className={`sidebar ${className}`}>
            <div className='center'>
                <ul>
                    <Link
                        to='/business/company/detail'
                        style={{ textDecoration: "none" }}>
                        <p className='title'>Thông tin</p>
                        <li>
                            <DashboardIcon className='icon' />
                            <span className='block !text-sm font-bold'>
                                Thông tin công ty
                            </span>
                        </li>
                    </Link>
                    {company?.status === "ACTIVE" && <p className='title'>Quản lí</p>}
                    {company?.status === "ACTIVE" && 
                        user &&
                        !roles.includes("BUSINESS_MEMBER") && (
                        <Link to='/business/user' style={{ textDecoration: "none" }}>
                            <li>
                                <PersonOutlineIcon className='icon' />
                                <span className='block !text-sm font-bold'>
                                    Nhân viên
                                </span>
                            </li>
                        </Link>
                    )}
                    {company?.status === "ACTIVE" &&
                        user &&
                        (roles.includes("BUSINESS_ADMIN") ||
                            roles.includes("BUSINESS_OWNER")) && (
                            <>
                                <Link
                                    to='/business/transaction'
                                    style={{ textDecoration: "none" }}>
                                    <li>
                                        <StoreIcon className='icon' />
                                        <span className='block !text-sm font-bold'>
                                            Giao dịch
                                        </span>
                                    </li>
                                </Link>
                                <Link
                                    to='/business/booking-request'
                                    style={{ textDecoration: "none" }}>
                                    <li>
                                        <CreditCardIcon className='icon' />
                                        <span className='block !text-sm font-bold'>
                                            Lịch sử đặt phòng
                                        </span>
                                    </li>
                                </Link>
                            </>
                        )}
                    {company?.status === "ACTIVE" &&
                        user &&
                        roles.includes("BUSINESS_ADMIN") && (
                            <Link
                                to='/business/travel-statement/business-admin'
                                style={{ textDecoration: "none" }}>
                                <li>
                                    <ArticleIcon className='icon' />
                                    <span className='block !text-sm font-bold'>
                                        Quản lý đơn
                                    </span>
                                </li>
                            </Link>
                        )}
                    {company?.status === "ACTIVE" &&
                        user &&
                        roles.includes("BUSINESS_MEMBER") && (
                            <Link
                                to='/business/travel-statement/business-member'
                                style={{ textDecoration: "none" }}>
                                <li>
                                    <ArticleIcon className='icon' />
                                    <span className='block !text-sm font-bold'>
                                        Quản lý đơn
                                    </span>
                                </li>
                            </Link>
                        )}
                </ul>
            </div>
        </div>
    );
};

export default SidebarBusiness;
