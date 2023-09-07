import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { columnsContract } from "../../datatablesource";
import "./Datatable.css";
import { useEffectOnce } from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";

const DatatableContract = () => {
  const [contracts, setContract] = useState([]);
  const storedToken = localStorage.getItem("token");
  useEffectOnce(() => {
    const fetchContract = () => {
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
      callRequest("contract/admin", requestOptions)
        .then((response) => {
          setContract(response.data.items);
        })
        .catch((response) => alert(response.message));
    };

    fetchContract();
  });

  const changeStatus = async (contractID, status) => {
    const updatedContract = contracts.map((contract) =>
      contract.id === contractID ? { ...contract, status: status } : contract
    );

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };

    callRequest(
      `contract/admin/change-status?id=${contractID}&status=${status}`,
      requestOptions
    )
      .then((response) => {
        setContract(updatedContract);
      })
      .catch((response) => alert(response.message));
  };

  // the value of the search field
  const [name, setName] = useState("");

  const filter = (e) => {
    const keyword = e.target.value;
    searchContract(keyword);
    setName(keyword);
  };

  const searchContract = async (value) => {
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
    callRequest("contract/admin", requestOptions)
      .then((response) => {
        setContract(response.data.items);
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
            {params.row.status === "PENDING" && (
              <div
                className="deleteButton"
                onClick={() => changeStatus(params.row.id, "REJECTED")}
              >
                Từ chối
              </div>
            )}
            {params.row.status === "PENDING" && (
              <div
                className="acceptButton"
                onClick={() => changeStatus(params.row.id, "APPROVED")}
              >
                Đồng ý
              </div>
            )}
            {params.row.status === "APPROVED" && (
              <div
                className="deleteButton"
                onClick={() => changeStatus(params.row.id, "TERMINATED")}
              >
                Chấm dứt
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
        rows={contracts}
        columns={columnsContract.concat(actionColumn)}
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

export default DatatableContract;
