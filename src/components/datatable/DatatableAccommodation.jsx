import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columnsAccommodation } from "../../datatablesource";
import "./Datatable.css";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";

const DatatableAccommodation = () => {
  const [accommodations, setAccommodation] = useState([]);
  const storedToken = localStorage.getItem("token");
  useEffectOnce(() => {
    const fetchAccommodationData = () => {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          criteriaList: [],
          page: 1,
          size: 100,
          orderBy: "id",
        }),
      };
      callRequest("accommodation/admin", requestOptions)
        .then((response) => {
          setAccommodation(response.data.items);
        })
        .catch((response) => alert(response.message));
    };

    fetchAccommodationData();
  });

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
      `accommodation/change-status?id=${accommodationsID}&status=${status}`,
      requestOptions
    )
      .then((response) => {
        setAccommodation(updatedAccommodation);
      })
      .catch((response) => alert(response.message));
  };

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
      headers: { "Content-Type": "application/json" },
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
    callRequest("accommodation/admin", requestOptions)
      .then((response) => {
        setAccommodation(response.data.items);
      })
      .catch((response) => alert(response.message));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Hoạt động",
      width: 250,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Xem</div>
            </Link>
            {params.row.status === "BANNED" && (
              <div
                className="acceptButton"
                onClick={() => changeStatus(params.row.id, "OPENING")}
              >
                Mở
              </div>
            )}
            {params.row.status === "PENDING" && (
              <div
                className="acceptButton"
                onClick={() => changeStatus(params.row.id, "OPENING")}
              >
                Chấp thuận
              </div>
            )}
            {params.row.status === "PENDING" && (
              <div
                className="deleteButton"
                onClick={() => changeStatus(params.row.id, "REJECTED")}
              >
                Từ chối
              </div>
            )}
            {params.row.status === "OPENING" && (
              <div
                className="deleteButton"
                onClick={() => changeStatus(params.row.id, "BANNED")}
              >
                Cấm
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
      <DataGrid
        className="datagrid"
        rows={accommodations}
        columns={columnsAccommodation.concat(actionColumn)}
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

export default DatatableAccommodation;
