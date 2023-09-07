import React, { useEffect, useState } from "react";
import "./AddBusinessUser.css";
import Navbar from "../../../components/navbar/Navbar";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { FormHelperText, MenuItem, Select, TextField } from "@mui/material";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import { callRequest } from "../../../utils/requests";

const AddBusinessUserAdmin = () => {
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
  const [jobDescriptionError, setJobDescriptionError] = useState("");
  const [employeeCodeError, setEmployeeCodeError] = useState("");
  const BUSINESS_MEMBER = "BUSINESS_MEMBER";
  const [listUsers, setListUser] = useState([]);
  const [role, setRole] = useState(BUSINESS_MEMBER);

  const addUser = async (event) => {
    event.preventDefault();

    var raw = JSON.stringify({
      email,
      region: "84",
      phone,
      username,
      role,
    });

    const addResponse = await fetch(
      `${process.env.REACT_APP_API_PATH}company/business-admin/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: raw,
      }
    );

    if (addResponse.ok) {
      const addResponseData = await addResponse.json();
      const status = addResponseData.status;
      if (status === 200) {
        alert(addResponseData.message);
        setEmail("");
        setRegion("");
        setPhone("");
        setUsername("");
        setRole(BUSINESS_MEMBER);
      } else {
        const errors = addResponseData.data;
        setEmailError(errors["email"]);
        setRegionError(errors["region"]);
        setPhoneError(errors["phone"]);
        setUsernameError(errors["username"]);
        setRoleError(errors["role"]);
      }
    }
  };

  const addByExcel = async (event) => {
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
          .catch((response) => console.log("response", response));
        return image;
      });
      const fileUpload = await Promise.all(filePromises);
      setFile(fileUpload);
      setListUser(fileUpload[0].responses);
      console.log(fileUpload);
    } else {
      console.log("avb");
    }
  };

  useEffect(() => {
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
      <div className="mbsc-grid mbsc-grid-fixed p-16 p-8 m-auto w-2/3 mb-12">
        <h1>Thêm nhân viên mới</h1>
        <div className="mbsc-form-group">
          <div className="mbsc-row mbsc-justify-content-center">
            <div className="mbsc-col-md-10 mbsc-col-xl-8 mbsc-form-grid">
              <div className="mbsc-row margin_bottom_20px">
                <div className="mbsc-col-12">Thêm nhân viên bằng file excel:</div>
                <input type="file" multiple="false" onChange={addByExcel} />
                {/* <button onClick={addByExcel} type="submit">
                  Add User By Excel
                </button> */}
              </div>
              <form onSubmit={addUser}>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="Email">
                    Email:
                  </div>
                  <TextField
                    className="w_100"
                    type="text"
                    label="Email"
                    id="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    helperText={emailError}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="Phone">
                    Số điện thoại:
                  </div>
                  <TextField
                    className="w_100"
                    label="Phone"
                    id="Phone"
                    onChange={(e) => setPhone(e.target.value)}
                    error={phoneError}
                    helperText={phoneError}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="username">
                    Tên người dùng:
                  </div>
                  <TextField
                    className="w_100"
                    id="username"
                    label="User name"
                    onChange={(e) => setUsername(e.target.value)}
                    error={usernameError}
                    helperText={usernameError}
                    inputProps={{ minLength: "4", maxLength: "32" }}
                  />
                </div>
                <div className="mbsc-row margin_bottom_20px">
                  <div className="mbsc-col-12" htmlFor="roomCount">
                    Chức vụ:
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
                  </Select>
                  <FormHelperText>{roleError}</FormHelperText>
                </div>
                <button type="submit">Thêm nhân viên mới</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessUserAdmin;
