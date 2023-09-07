import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columnsAccommodationForHouseOwner } from "../../datatablesource";
import "./Datatable.css";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";

const DatatableAccommodationHouseOwner = () => {
  const [accommodations, setAccommodation] = useState([]);
  const storedToken = localStorage.getItem("token");
  useEffectOnce(() => {
    const fetchAccommodationData = () => {
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
          orderBy: "id",
        }),
      };
      callRequest("accommodation/house-owner/list", requestOptions)
        .then((response) => {
          setAccommodation(response.data.items);
        })
        .catch((response) => alert(response.message));
    };

    fetchAccommodationData();
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
            key: "name",
            operation: "CONTAINS",
            value: [`${value}`],
          },
        ],
        page: 1,
        size: 100,
        orderBy: "id",
      }),
    };
    callRequest("accommodation/house-owner/list", requestOptions)
      .then((response) => {
        setAccommodation(response.data.items);
      })
      .catch((response) => alert(response.message));
  };

  const changeStatus = async (accommodationsID, status) => {
    const updatedAccommodation = accommodations.map((accommodation) =>
      accommodation.id === accommodationsID
        ? { ...accommodation, status: status }
        : accommodation
    );

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };

    callRequest(
      `accommodation/house-owner/update/status?id=${accommodationsID}&status=${status}`,
      requestOptions
    )
      .then((response) => {
        setAccommodation(updatedAccommodation);
      })
      .catch((response) => alert(response.message));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Hoạt động",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.status === "CLOSED" && (
              <div
                className="acceptButton"
                onClick={() => changeStatus(params.row.id, "OPENING")}
              >
                Mở
              </div>
            )}
            {params.row.status === "OPENING" && (
              <div
                className="deleteButton"
                onClick={() => changeStatus(params.row.id, "CLOSED")}
              >
                Đóng
              </div>
            )}
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
      <div className="datatableTitle">
        Thêm chỗ ở mới
        <Link to="new" className="link">
          Thêm chỗ ở mới
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        autoHeight
        {...accommodations}
        rows={accommodations}
        columns={columnsAccommodationForHouseOwner.concat(actionColumn)}
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

export default DatatableAccommodationHouseOwner;
