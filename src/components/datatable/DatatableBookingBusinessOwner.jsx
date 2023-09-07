import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { columnsBookingBusinessOwner } from "../../datatablesource";
import "./Datatable.css";
import { callRequest } from "../../utils/requests";

const DatatableBookingBusinessOwner = () => {
  const [bookings, setBooking] = useState([]);
  const storedToken = localStorage.getItem("token");
  useEffectOnce(() => {
    const fetchRequestBookingData = () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          criteriaList: [],
          page: 1,
          size: 100,
          orderBy: "createdAt",
          descending: false,
        }),
      };
      callRequest("booking-request/business-owner", requestOptions)
        .then((response) => {
          setBooking(response.data.items);
        })
        .catch((response) => alert(response.message));
    };

    fetchRequestBookingData();
  });

  // the value of the search field
  const [name, setName] = useState("");

  const filter = (e) => {
    const keyword = e.target.value;
    searchAccommodation(keyword);
    setName(keyword);
  };

  const searchAccommodation = async (value) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        criteriaList: [
          {
            key: "customerName",
            operation: "CONTAINS",
            value: [`${value}`],
          },
        ],
        page: 1,
        size: 100,
        orderBy: "createdAt",
        descending: false,
      }),
    };
    callRequest("booking-request/business-owner", requestOptions)
      .then((response) => {
        setBooking(response.data.items);
      })
      .catch((response) => alert(response.message));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Hoạt động",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/business/booking/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Xem</div>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="mb-2.5">
        <input
          id="search"
          placeholder="Tìm kiếm..."
          type="search"
          value={name}
          onChange={filter}
          className="w-96 !border-solid border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 h-12 "
        />
      </div>
      <div className="datatableTitle"></div>
      <DataGrid
        className="datagrid"
        rows={bookings}
        columns={columnsBookingBusinessOwner.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default DatatableBookingBusinessOwner;
