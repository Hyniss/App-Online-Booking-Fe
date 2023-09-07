import React from "react";
import { Link } from "react-router-dom";
import { Photo } from "./components/base/Photo";

export const columns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "Ảnh đại diện",
    width: 150,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Photo
            src={params.row.avatar}
            className="rounded-full cursor-pointer object-cover"
            style={{
              width: 41,
              height: 41,
            }}
            errorSrc={
              "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
            }
          />
        </div>
      );
    },
  },
  {
    field: "username",
    headerName: "Người dùng",
    width: 230,
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "phone",
    headerName: "SĐT",
    width: 230,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 230,
    renderCell: (params) => {
      return <div>{params.row.createdAt}</div>;
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {convertStatusUserSA(params.row.status)}
        </div>
      );
    },
  },
];

function convertStatusUserSA(params) {
  let status = "";
  if (params === "ACTIVE") status = "Hoạt động";
  else if (params === "PENDING") status = "Chờ duyệt";
  else status = "Cấm";
  return status;
}

export const columnsAccommodation = [
  { field: "id", headerName: "ID", width: 60 },
  {
    field: "thumbnail",
    headerName: "Ảnh bìa",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.thumbnail} alt="avatar" />
        </div>
      );
    },
  },
  {
    field: "name",
    headerName: "Nhà/Phòng cho thuê",
    width: 230,
  },
  {
    field: "ownerName",
    headerName: "Chủ sở hữu",
    width: 180,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    width: 230,
  },
  {
    field: "type",
    headerName: "Loại phòng",
    width: 120,
  },
  {
    field: "totalRoom",
    headerName: "Số lượng phòng",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 150,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 140,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {convertStatusAccommodationSA(params.row.status)}
        </div>
      );
    },
  },
];

function convertStatusAccommodationSA(params) {
  let status = "";
  if (params === "OPENING") status = "Đang mở";
  else if (params === "PENDING") status = "Chờ duyệt";
  else if (params === "CLOSED") status = "Đã đóng";
  else status = "Đã cấm";
  return status;
}

export const columnsContract = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Hợp đồng",
    width: 230,
  },
  {
    field: "accommodationName",
    headerName: "Người đăng kí",
    valueGetter: (params) => {
      if (params.row.houseOwner) {
        return params.row.houseOwner.username;
      }
      return "NULL";
    },
    width: 180,
  },
  {
    field: "profit",
    headerName: "Lợi nhuận (%)",
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 200,
    renderCell: (params) => {
      return <div>{params.row.createdAt}</div>;
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {convertStatusContract(params.row.status)}
        </div>
      );
    },
  },
];

function convertStatusContract(params) {
  let status = "";
  if (params === "APPROVED") status = "Được chấp nhận";
  else if (params === "PENDING") status = "Chờ duyệt";
  else if (params === "REJECTED") status = "Đã từ chối";
  else status = "Đã chấm dứt";
  return status;
}

export const columnsAccommodationForHouseOwner = [
  {
    field: "name",
    headerName: "Nhà/Phòng cho thuê",
    width: 230,
    renderCell: (params) => {
      return (
        <Link
          to={`/house-owner/accommodation/${params.row.id}`}
          style={{ textDecoration: "none" }}
        >
          <div className="accommodation-block">
            <img
              className="accommodation-image"
              src={params.row.thumbnail}
              alt="avatar"
            />
            <div className="">{params.row.name}</div>
          </div>
        </Link>
      );
    },
  },
  {
    field: "type",
    headerName: "Loại hình cho thuê",
    width: 160,
  },
  {
    field: "totalRoom",
    headerName: "Số lượng phòng",
    width: 150,
  },
  {
    field: "totalBookings",
    headerName: "Lượt đặt phòng",
    width: 150,
  },
  {
    field: "totalReviews",
    headerName: "Lượt đánh giá",
    width: 130,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    width: 230,
  },
  {
    field: "updatedAt",
    headerName: "Thời gian cập nhật",
    width: 150,
    renderCell: (params) => {
      return <div>{params.row.updatedAt}</div>;
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 130,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {convertStatusAccommodationHO(params.row.status)}
        </div>
      );
    },
  },
];

function convertStatusAccommodationHO(params) {
  let status = "";
  if (params === "OPENING") status = "Đang mở";
  else if (params === "PENDING") status = "Chờ duyệt";
  else if (params === "CLOSED") status = "Đã đóng";
  else status = "Đã cấm";
  return status;
}

export const columnsTransactionBusinessOwner = [
  {
    field: "bankTransactionNo",
    headerName: "Bank Transaction No",
    width: 230,
  },
  {
    field: "amount",
    headerName: "Total Amount",
    width: 230,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 230,
  },
  {
    field: "creatorEmail",
    headerName: "Creator",
    valueGetter: (params) => {
      if (params.row.creator) {
        return params.row.creator.username;
      }
      return "NULL";
    },
    width: 230,
  },
  {
    field: "creatorPhone",
    headerName: "Creator phone",
    valueGetter: (params) => {
      if (params.row.creator) {
        return params.row.creator.phone;
      }
      return "NULL";
    },
    width: 230,
  },
  {
    field: "receiver.username",
    headerName: "Receiver",
    valueGetter: (params) => {
      if (params.row.receiver) {
        return params.row.receiver.username;
      }
      return "NULL";
    },
    width: 230,
  },
  {
    field: "receiver.phone",
    headerName: "Receiver",
    valueGetter: (params) => {
      if (params.row.receiver) {
        return params.row.receiver.phone;
      }
      return "NULL";
    },
    width: 230,
  },
  {
    field: "createdAt",
    headerName: "Create at",
    width: 230,
  },
];

export const columnsUserBusinessOwner = [
  {
    field: "id",
    headerName: "Id",
    width: 70,
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "phone",
    headerName: "SĐT",
    width: 180,
  },
  {
    field: "username",
    headerName: "Tên người dùng",
    width: 230,
  },
  {
    field: "roles",
    headerName: "Chức vụ",
    width: 180,
    renderCell: (params) => {
      return <div>{convertRoleBO(params.row.roles)}</div>;
    },
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {convertStatusUserBO(params.row.status)}
        </div>
      );
    },
  },
];

function convertRoleBO(params) {
  let status = "";
  if (params === "BUSINESS_MEMBER") status = "Nhân viên";
  else if (params === "BUSINESS_ADMIN") status = "Quản lý";
  else status = "Chủ công ty";
  return status;
}

function convertStatusUserBO(params) {
  let status = "";
  if (params === "ACTIVE") status = "Đang hoạt động";
  else if (params === "PENDING") status = "Chờ duyệt";
  else status = "Đã cấm";
  return status;
}

export const columnsBookingBusinessOwner = [
  {
    field: "id",
    headerName: "Id",
    width: 50,
  },
  {
    field: "customerName",
    headerName: "Customer Name",
    width: 200,
  },
  {
    field: "customerEmail",
    headerName: "Customer Email",
    width: 230,
  },
  {
    field: "contact",
    headerName: "Contact",
    width: 120,
  },
  {
    field: "accommodationName",
    headerName: "Accommodation Name",
    width: 230,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 130,
  },
  {
    field: "totalRooms",
    headerName: "Total Rooms",
    width: 120,
  },
  {
    field: "checkinAt",
    headerName: "Checkin At",
    width: 230,
  },
  {
    field: "checkoutAt",
    headerName: "Checkout At",
    width: 230,
  },
  {
    field: "travelStatementName",
    headerName: "Travel Statement",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithStatus ${params.row.status
            .toString()
            .toLowerCase()}`}
        >
          {params.row.status}
        </div>
      );
    },
  },
];
