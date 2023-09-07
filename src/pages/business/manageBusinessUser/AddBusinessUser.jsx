import React, { useEffect, useState } from "react";
import "./AddBusinessUser.css";
import Navbar from "../../../components/navbar/Navbar";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { FormHelperText, MenuItem, Select, TextField } from "@mui/material";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import { callRequest } from "../../../utils/requests";
import { Link } from "react-router-dom";

const AddBusinessUser = () => {
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [file, setFile] = useState([]);
  // const [role, setRole] = useState("");
  const storedToken = localStorage.getItem("token");
  const [emailError, setEmailError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [listId, setListId] = useState([]);
  const BUSINESS_MEMBER = "BUSINESS_MEMBER";
  const BUSINESS_ADMIN = "BUSINESS_ADMIN";
  const [role, setRole] = useState(BUSINESS_MEMBER);
  const roleAccount = JSON.parse(localStorage.getItem("auth")).roles;
  const [listUsers, setListUser] = useState([]);
  const [fileDowload, setFileDowload] = useState("");
  const [loading, setLoading] = useState(false);

  const showBusinessAdmin =
    roleAccount && roleAccount.includes("BUSINESS_OWNER");

  const addUser = async (event) => {
    event.preventDefault();

    var raw = JSON.stringify({
      email,
      region: "84",
      phone,
      username,
      role,
    });

    let url = "";
    if (showBusinessAdmin) {
      url = `company/business-owner/add`;
    } else {
      url = `company/business-admin/add`;
    }

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: raw,
    };

    callRequest(url, requestOptions)
      .then((response) => {
        alert(response.message);
        setEmail("");
        setRegion("");
        setPhone("");
        setUsername("");
        setRole(BUSINESS_MEMBER);
      })
      .catch((response) => {
        const errors = response.data;
        setEmailError(errors["email"]);
        setRegionError(errors["region"]);
        setPhoneError(errors["phone"]);
        setUsernameError(errors["username"]);
        setRoleError(errors["role"]);
      });
  };

  const addByExcel = async (event) => {
    setLoading(true);
    if (event.target.files) {
      const filePromises = Array.from(event.target.files).map(async (files) => {
        var myHeaders = new Headers();
        myHeaders.append("X-LOCALE", "vi");
        myHeaders.append("Authorization", `Bearer ${storedToken}`);

        var formdata = new FormData();
        formdata.append("file", files);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formdata,
          redirect: "follow",
        };

        const image = await callRequest(
          "company/business-admin/upload",
          requestOptions
        )
          .then((response) => response.data)
          .catch((response) => alert(response.message));
        if (image === undefined) window.location.reload();
        return image;
      });
      const fileUpload = await Promise.all(filePromises);
      setFile(fileUpload);
      setListUser(fileUpload[0].responses);
      setFileDowload(fileUpload[0].fileData);
      console.log(fileUpload);
      setLoading(false);
      if (listUsers.length > 0) {
        alert("Thêm nhân viên thành công");
      }
      if (listUsers.length === 0) {
        alert("Thêm nhân viên không thành công");
      }
    } else {
      console.log("avb");
    }
  };

  useEffect(() => {
    if (fileDowload) {
      window.location.href = fileDowload; // Tải xuống tệp
    }
    if (listUsers.length > 0) {
      sendMail();
    }
  }, [listUsers]);

  const sendMail = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ url: "", userIdRequests: listUsers }),
      };
      const response = await fetch(
        `${process.env.REACT_APP_API_PATH}company/business-admin/send/mail`,
        requestOptions
      );
      if (response.ok) {
        console.log("Mail sent successfully.");
      } else {
        console.error("Error sending mail:", response.status);
      }
    } catch (error) {
      console.error("Error sending mail:", error);
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      <Navbar />
      <div className="p-16 p-8 m-auto md:w-2/3 mb-12 w-full">
        <div className="mt-4">
          <div className="grid gap-3 justify-center w-full mt-3">
            <h1 className="text-3xl font-bold mb-4">Thêm nhân viên</h1>
            <div className="mbsc-col-md-10 mbsc-col-xl-8 w-full mbsc-form-grid">
              <div className="flex justify-end">
                <Link
                  to="https://h2s-s3.s3.ap-northeast-1.amazonaws.com/AddBusinessTemplate.xlsx"
                  target="_blank"
                  download
                  className="btn__primary "
                >
                  Tải bản mẫu excel
                </Link>
              </div>
              <div className="mbsc-row margin_bottom_20px mt-3">
                <div className="mbsc-col-12">
                  Thêm nhân viên bằng file excel:
                </div>
                <input
                  type="file"
                  multiple="false"
                  onChange={addByExcel}
                  disabled={loading}
                />
                {/* <button onClick={addByExcel} type="submit">
                  Add User By Excel
                </button> */}
              </div>
              <div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="Email">
                    Email:{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    type="text"
                    id="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailError}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="Phone">
                    Số điện thoại{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    error={phoneError}
                    helperText={phoneError}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="username">
                    Tên người dùng{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <TextField
                    inputClassName="mt-2"
                    className="block col-span-8 w-full"
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    error={usernameError}
                    helperText={usernameError}
                    inputProps={{ minLength: "4", maxLength: "32" }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Chức vụ{" "}
                    <span className="text-red-500 ml-1 font-bold text-xl">
                      *
                    </span>
                  </div>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    onChange={(e) => setRole(e.target.value)}
                    defaultValue={BUSINESS_MEMBER}
                  >
                    <MenuItem value={BUSINESS_MEMBER}>Nhân viên</MenuItem>
                    {showBusinessAdmin && (
                      <MenuItem value={BUSINESS_ADMIN}>Quản lý</MenuItem>
                    )}
                  </Select>
                  <FormHelperText>{roleError}</FormHelperText>
                </div>
                <div className="flex content-center items-center justify-center">
                  <button
                    onClick={addUser}
                    className="btn__primary mt-3.5"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Thêm nhân viên"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessUser;
