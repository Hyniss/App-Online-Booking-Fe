// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
// import {
//   columnsContract,
//   columnsUserBusinessOwner,
// } from "../../datatablesource";
import "./Datatable.css";
// import { useEffectOnce } from "../../CustomHooks/hooks";
import { Link } from "react-router-dom";
import { SearchCriterias } from "../AdminComponents/Criterias";
import { Paging } from "../AdminComponents/Paging";
// import Input from "../base/input"; 
import { TableHeader } from "../base/TableHeader";
import { useAuth } from "../../context/Auth";
import {
  useCallbackState,
  useClickOutside,
  useEffectOnce,
} from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests";
import { strings } from "../../utils/strings";
import Input from "../base/input";

const DatatableBusinessUserOwner = () => {
  const [user, ,] = useAuth();
  const pageSizes = [5, 10, 20];
  const [file, setFile] = useState([]);
  const [users, setUser] = useState([]);
  const [listUsers, setListUser] = useState([]);
  const [isDescending, setIsDescending] = useCallbackState(null);
  const [sortProperty, setSortProperty] = useCallbackState(null);
  const [currentPage, setCurrentPage] = useCallbackState(1);
  const [pageSize, setPageSize] = useCallbackState(pageSizes[0]);
  const [criteriaList, setCriteriaList] = useCallbackState([]);

  const [companyList, setCompanyList] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [name, setName] = useState("");


  const columns = [
    {
      value: "id",
      text: "Id",
      criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
    },
    {
      value: "email",
      text: "Email",
      criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
    },
    {
      value: "phone",
      text: "Điện thoại",
      criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
    },
    {
      value: "roles",
      text: "Chức vụ",
      criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
    },

    // {
    //     value: "createdAt",
    //     text: "Ngày tạo",
    //     criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
    // },

    {
      value: "status",
      text: "Trạng thái",
      criteriaList: ["IN"],
      availableValues: {
        PENDING: {
          element: (
            <label
              className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-warning-100 text-warning-600 hover:bg-warning-200 block w-max`}>
              {"Chờ xác nhận"}
            </label>
          ),
        },
        BANNED: {
          element: (
            <label
              className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-danger-100 text-danger-600 hover:bg-danger-200 block w-max`}>
              {"Bị Khóa"}
            </label>
          ),
        },
        ACTIVE: {
          element: (
            <label
              className={`select-none rounded-md px-3 py-2 text-sm font-medium bg-success-100 text-success-600 hover:bg-success-200 block w-max`}>
              {"Đang hoạt động"}
            </label>
          ),
        },
      },
    },
  ];

  const search = React.useCallback(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    const searchingCriterias = [...criteriaList.current];
    if (strings.isNotBlank(name)) {
      searchingCriterias.push({
        key: "username",
        operation: "CONTAINS",
        value: [name],
      });
    }
    var raw = JSON.stringify({
      page: currentPage.current,
      size: pageSize.current,
      orderBy: sortProperty.current || "createdAt",
      descending: isDescending.current,
      criteriaList: searchingCriterias,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    callRequest("company/business-admin/list", requestOptions).then((response) => {
      setCompanyList(response.data.items);
      setCurrentPage(response.data.page);
      setTotalPages(response.data.totalPages);
    });
  });
  // useEffectOnce(() => {
  //   const fetchUser = () => {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${storedToken}`,
  //       },
  //       body: JSON.stringify({
  //         criteriaList: [],
  //         page: 1,
  //         size: 100,
  //         orderBy: "id",
  //       }),
  //     };
  //     callRequest("company/business-admin/list", requestOptions)
  //       .then((response) => {
  //         setUser(response.data.items);
  //       })
  //       .catch((response) => alert(response.message));
  //   };

  //   fetchUser();
  // });

  // // the value of the search field
  // const [name, setName] = useState("");

  // const filter = (e) => {
  //   const keyword = e.target.value;
  //   searchUser(keyword);
  //   setName(keyword);
  // };

  // const searchUser = async (value) => {
  //   const requestOptions = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${storedToken}`,
  //     },
  //     body: JSON.stringify({
  //       criteriaList: [
  //         {
  //           key: "username",
  //           operation: "CONTAINS",
  //           value: [`${value}`],
  //         },
  //       ],
  //       page: 1,
  //       size: 100,
  //       orderBy: "id",
  //     }),
  //   };
  //   callRequest("company/business-admin/list", requestOptions)
  //     .then((response) => {
  //       setUser(response.data.items);
  //     })
  //     .catch((response) => alert(response.message));
  // };




  // const addByExcel = async (event) => {
  //   if (event.target.files) {
  //     const filePromises = Array.from(event.target.files).map(async (files) => {
  //       var myHeaders = new Headers();
  //       myHeaders.append("X-LOCALE", "vi");
  //       myHeaders.append("Authorization", `Bearer ${storedToken}`);

  //       var formdata = new FormData();
  //       formdata.append("file", files);

  //       var requestOptions = {
  //         method: "POST",
  //         headers: myHeaders,
  //         body: formdata,
  //         redirect: "follow",
  //       };

  //       const image = await callRequest(
  //         "company/business-admin/upload",
  //         requestOptions
  //       )
  //         .then((response) => response.data)
  //         .catch((response) => console.log("response", response));
  //       return image;
  //     });
  //     const fileUpload = await Promise.all(filePromises);
  //     setFile(fileUpload);
  //     setListUser(fileUpload[0].responses);
  //     console.log(fileUpload);
  //   } else {
  //     console.log("avb");
  //   }
  // };
  useEffectOnce(() => search());
  return (
    // <div className="datatable">
    //   <div className="mb-2.5">
    //     <input
    //       id="search"
    //       placeholder="Tìm kiếm..."
    //       type="search"
    //       value={name}
    //       onChange={filter}
    //       className="w-96 !border-solid border hover:outline outline-[2px] outline-blue-500 rounded-md border-gray-300 h-12 "
    //     />
    //   </div>
    //   <div className="datatableTitle">
    //     Thêm nhân viên
    //     <Link to="createUser" className="link">
    //       Thêm nhân viên mới
    //     </Link>
    //   </div>
    //   <DataGrid
    //     className="datagrid"
    //     rows={users}
    //     columns={columnsUserBusinessOwner.concat(actionColumn)}
    //     initialState={{
    //       pagination: {
    //         paginationModel: {
    //           pageSize: 10,
    //         },
    //       },
    //     }}
    //     pageSizeOptions={[10]}
    //     disableRowSelectionOnClick
    //   />
    // </div>
    <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
      <p className='text-3xl font-bold'>Danh sách nhân viên</p>
      <div className='flex gap-2 items-center mt-4'>
        <Input
          onChangeValue={setName}
          field=''
          placeHolder={"Tìm kiếm nhân viên"}
          className='w-96'
          inputClassName='h-12'
          type='text'></Input>
        <button
          className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
          onClick={() => search()}>
          Tìm kiếm
        </button>
        {/* <button
                      className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                      onClick={() => send()}>
                      Send
                  </button> */}
      </div>
      <div className="flex gap-2 items-center mt-4">
        <Link to="createUser" >
          <button
            className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'>
            Thêm thành viên
          </button>
        </Link>
        {/* <SearchCriterias
          criteriaList={criteriaList.current}
          setCriteriaList={setCriteriaList}
          fields={columns}
          searchCallback={search}
        /> */}
      </div>
      <div className='rounded-md bg-white shadow-sm mt-4'>
        <table className='h-full w-full table-fixed'>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <TableHeader
                  key={column.value}
                  index={index}
                  data={column}
                  sortProperty={sortProperty.current}
                  setSortProperty={(sortProp) =>
                    Promise.resolve()
                      .then(() => setSortProperty(sortProp))
                      .then(() => search())
                  }
                  isDescending={isDescending.current}
                  setIsDescending={setIsDescending}
                />
              ))}
              <th className='h-16 w-[6rem] px-4 text-black'></th>
              {/* <th className='h-16 w-[6rem] px-4 text-black'></th>
                              <th className='h-16 w-[6rem] px-4 text-black'></th>
                              <th className='h-16 w-[6rem] px-4 text-black'></th> */}
            </tr>
          </thead>
          <tbody>
            {companyList.map((company) => (
              <CompanyRow
                data={company}
                key={company.id}
                fields={columns}
                user={user}
              />
            ))}
          </tbody>
        </table>
        {Paging({
          setPageSize,
          search,
          pageSizes,
          currentPage: currentPage.current,
          totalPages,
          setCurrentPage,
        })}
      </div>
    </div>
  );
};

const CompanyRow = ({ data, fields, user }) => {
  const [company, setCompany] = React.useState(data);
  const [openModal, setOpenModal] = React.useState(false);
  const [rejectMessage, setRejectMessage] = React.useState("");
  const [rejectMessageError, setRejectMessageError] = React.useState("");
  const ref = useClickOutside(setOpenModal);
  const storedToken = localStorage.getItem("token");

  const changeStatus = (status) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    console.log("id", company.id);
    // const id = company.id || '';
    // var raw = new URLSearchParams({
    //     id,
    //     status,
    // }).toString();

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    callRequest(`company/business-admin/disable?id=${company.id}&status=${status}`, requestOptions)
      .then((response) => {
        setCompany(response.data);
        alert(response.message);
        setOpenModal(false);
      })
      .catch((response) => {
        if (response.status === 400 && response?.data?.rejectMessage) {
          return;
        }
        alert(response.data.id);
      });
  };



  return (
    <tr className='border-t border-gray-200 hover:bg-gray-100'>
      {fields.map((field, index) => {
        console.log("field", field);
        if (field.availableValues) {
          const x = company[field.value];
          const element = field.availableValues[x]?.element;
          if (element) {
            return (
              <td
                key={index}
                className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
                  }`}>
                {element}
              </td>
            );
          }
        }else if (field.value === "roles") {
          // Access the nested 'user.username' property from the 'company' object
          const username = company.roles || ""; // Use optional chaining to handle undefined properties
          const roles = username.includes("BUSINESS_MEMBER") ? "Nhân viên" : username.includes("BUSINESS_OWNER") ? "Giám đốc" : "Quản trị viên";
          return (
              <td
                  key={index}
                  className={`h-[64px] overflow-hidden text-black ${
                      index === 0 ? "px-8" : "px-2"
                  }`}>
                  {roles}
              </td>
          );
      } 
        return (
          <td
            key={index}
            className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
              }`}>
            {company[field.value]}
          </td>
        );
      })}

      <td className='h-[64px] py-2'>
        {company &&
          company.status === 'BANNED' &&
          company.roles !== "BUSINESS_OWNER" &&
          <button
            onClick={() => changeStatus("ACTIVE")}
            className='rounded-md py-2 text-sm font-medium bg-green-500 !text-white hover:bg-green-600 block text-center w-full'>
            Hoạt động
          </button>
        }
        {company &&
          company.status === 'ACTIVE' &&
          company.roles !== "BUSINESS_OWNER" &&
          company.id !== user.id &&
          (user.roles.includes("BUSINESS_ADMIN") ?
            (user.roles.includes("BUSINESS_ADMIN") &&
              !company.roles.includes("BUSINESS_ADMIN")) :
            user.roles.includes("BUSINESS_OWNER")) &&
          <button
            onClick={() => changeStatus("BANNED")}
            className='rounded-md py-2 text-sm font-medium bg-red-500 !text-white hover:bg-red-600 block text-center w-full'>
            Cấm
          </button>
        }
      </td>

    </tr>
  );
};

export default DatatableBusinessUserOwner;
