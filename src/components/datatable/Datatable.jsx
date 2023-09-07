import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { columns } from "../../datatablesource";
import { ExportButton } from "../excel-export/ExportButton";
import "./Datatable.css";
import { callRequest } from "../../utils/requests";

function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <ExportButton />
    </GridToolbarContainer>
  );
}

const Datatable = () => {
  const [users, setUsers] = useState([]);
  const storedToken = localStorage.getItem("token");
  useEffectOnce(() => {
    const fetchUserData = () => {
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
          orderBy: "email",
        }),
      };

      callRequest("user/admin", requestOptions)
        .then((response) => {
          setUsers(response.data.items);
        })
        .catch((response) => alert(response.message));
    };

    fetchUserData();
  });

  const changeStatus = async (userId, status) => {
    let updatedUsers = [];
    updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: status } : user
    );

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };

    callRequest(
      `user/admin/disable?id=${userId}&status=${status}`,
      requestOptions
    )
      .then((response) => {
        setUsers(updatedUsers);
      })
      .catch((response) => alert(response.message));
  };

  // the value of the search field
  const [name, setName] = useState("");

  const filter = (e) => {
    const keyword = e.target.value;
    searchUser(keyword);
    setName(keyword);
  };

  const searchUser = async (value) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        criteriaList: [
          {
            key: "username",
            operation: "CONTAINS",
            value: [`${value}`],
          },
        ],
        page: 1,
        size: 100,
        orderBy: "id",
      }),
    };

    callRequest("user/admin", requestOptions)
      .then((response) => {
        setUsers(response.data.items);
      })
      .catch((response) => alert(response.message));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Hoạt động",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/admin/users/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Xem</div>
            </Link>
            {params.row.status === "BANNED" && (
              <div
                className="acceptButton"
                onClick={() => changeStatus(params.row.id, "ACTIVE")}
              >
                Bỏ cấm
              </div>
            )}
            {params.row.status === "ACTIVE" && (
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
      <div className="datatableTitle"></div>
      <DataGrid
        className="datagrid"
        rows={users}
        columns={columns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        // components={{
        //   Toolbar: CustomToolbar,
        // }}
      />
    </div>
  );
};

export default Datatable;
