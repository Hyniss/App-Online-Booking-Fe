import React, { useEffect, useRef, useState } from "react";
import "./BecomeHouseOwner.css";
import Navbar from "../../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { callRequest } from "../../../utils/requests";
import { useEffectOnce } from "../../../CustomHooks/hooks";

const BecomeHouseOwner = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [dialogShown, setDialogShown] = useState(false);
  const contractContentRef = useRef(null);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [selectedOption, setSelectedOption] = useState("");
  const [bankCodeError, setBankCodeError] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountNoError, setAccountNoError] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNameError, setAccountNameError] = useState("");

  const username = JSON.parse(localStorage.getItem("auth")).username;
  const email = JSON.parse(localStorage.getItem("auth")).email;
  const id = JSON.parse(localStorage.getItem("auth")).id;
  const phone = JSON.parse(localStorage.getItem("auth")).phone;
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = String(currentDate.getMonth() + 1)
    .padStart(2, "0")
    .toString();
  const day = String(currentDate.getDate()).padStart(2, "0").toString();
  const formattedDate = `${year}-${month}-${day}`;
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffectOnce(() => {
    if (phone === null && !dialogShown) {
      setDialogShown(true);
      const userConfirmed = window.confirm("Vui lòng cập nhật số điện thoại");
      if (userConfirmed) {
        navigate("/personal-info");
      } else {
        navigate("/");
      }
    }
  });

  const handleFormSubmit = async () => {
    if (isChecked) {
      const contractContent = contractContentRef.current.innerHTML;
      // eslint-disable-next-line no-useless-escape
      const tempContent = contractContent.replace(/"([^"]+)"/g, '"$1"');
      const finalContent = tempContent.replace(
        /<img src=\"https:\/\/h2s-s3\.s3\.ap-northeast-1\.amazonaws\.com\/b0fec14bb02b4b8f_20230711101111551%2B0000\.png\">/g,
        '<img src="https://h2s-s3.s3.ap-northeast-1.amazonaws.com/b0fec14bb02b4b8f_20230711101111551%2B0000.png"></img>'
      );
      const dataContract = {
        userId: id,
        contractName: `${username}'s contract`,
        content: finalContent,
        region: "84",
        profit: "15",
        bankCode: selectedOption || "VCB",
        accountNo: accountNo,
        accountName: accountName,
      };
      console.log("Contract Content:", dataContract);

      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(dataContract),
      };

      callRequest("user/register/house-owner", requestOptions)
        .then((response) => {
          localStorage.setItem("register-HO", "yes");
          navigate(`/`);
        })
        .catch((response) => {
          const errors = response.data;
          setAccountNoError(errors["accountNo"]);
          setBankCodeError(errors["bankCode"]);
          setAccountNameError(errors["accountName"]);
          if (errors["userId"]) {
            alert(errors["userId"]);
          }
        });
    }
  };
  return (
    <div>
      <Navbar />
      <div ref={contractContentRef} className="contract-content">
        <div style={{ fontFamily: "Arial" }}>
          <img src="https://h2s-s3.s3.ap-northeast-1.amazonaws.com/b0fec14bb02b4b8f_20230711101111551%2B0000.png"></img>
          <h3>Điều khoản Chỗ nghỉ của Quý vị với Home2stay.com</h3>
          <h3>Giữa:</h3>
          <p>Home2stay.com</p>
          <h3>Và Quý vị (gọi là "Đối tác" hoặc "Chỗ nghỉ"):</h3>
          <p>Chủ nhà: {username}</p>
          <p>Email: {email}</p>
          <h3>Cùng thống nhất các điều sau:</h3>
          <p>
            Đối với tất cả mọi chỗ nghỉ được đăng ký trên Home2stay.com, đăng ký
            với tên hay dưới tên Đối tác, phần trăm hoa hồng sẽ áp dụng là:{" "}
            <p className="font-black">15%</p>
          </p>
          <h4>Thực thi và thực hiện</h4>
          <p>
            Hợp đồng chỉ có hiệu lực sau khi được sự đồng ý và xác nhận bởi
            Home2stay.com
          </p>
          <h4>Điều khoản chung</h4>
          <p>
            Hợp Đồng này tùy thuộc vào và chịu sự chi phối của các Điều Khoản
            Chung ("ĐKC" ). Đối tác xác nhận đã đọc và chính thức chấp thuận các
            ĐKC.
          </p>
          <h4>Chỗ nghỉ đăng ký thêm</h4>
          <p>
            Mỗi chỗ nghỉ đăng ký thêm trên Home2stay.com, đăng ký với tên hay
            dưới tên Đối tác sẽ tự động thuộc phạm vi Hợp Đồng này và sẽ tùy
            thuộc vào và chịu sự chi phối của các ĐKC. Tất cả mọi đặt phòng chỗ
            nghỉ nhận được trước khi được đăng ký thêm sẽ được tôn trọng bởi Đối
            tác (a) theo điều khoản của Hợp Đồng này (và ĐKC), và (b) những điều
            kiện đặt phòng tương ứng và phần trăm hoa hồng được áp dụng vào ngày
            đặt phòng.
          </p>
          <h4>Đơn vị Đối tác đã xác nhận những điều sau:</h4>
          <p>
            Đơn vị Đối tác chứng nhận rằng đây là hoạt động kinh doanh chỗ nghỉ
            hợp pháp với đầy đủ giấy phép và chứng từ cần thiết, sẵn sàng xuất
            trình khi có yêu cầu. Home2stay.com có quyền kiểm chứng và điều tra
            những chi tiết mà Quý vị cung cấp trong quá trình đăng ký này.
          </p>
          <p className="date">
            <h4>Ngày:</h4> {formattedDate}
          </p>
        </div>
      </div>
      <div className="contract-content">
        <div className="mbsc-row margin_bottom_20px"></div>
        <div className="mbsc-row margin_bottom_20px">
          <div className="mbsc-col-12" htmlFor="roomCount">
            Ngân hàng:
          </div>
          <select
            className="rounded-md border-gray-300"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            {/* Add your select options here */}
            <option value="VCB">Vietcom Bank</option>
            <option value="TECHCOMBANK">Techcom Bank</option>
            <option value="TPBANK">Tp Bank</option>
            <option value="VIETINBANK">VietTin Bank</option>
            <option value="VIETABANK">VietA Bank</option>
            {/* Add more options as needed */}
          </select>
          <div className="error_message">{bankCodeError}</div>
        </div>
        <div className="mbsc-row margin_bottom_20px">
          <div className="mbsc-col-12" htmlFor="roomCount">
            Tài khoản ngân hàng (*):
          </div>
          <TextField
            type="number"
            inputClassName="mt-2"
            className="block col-span-8 w-full"
            id="roomCount"
            value={accountNo}
            onChange={(e) => setAccountNo(e.target.value)}
            error={accountNoError}
            helperText={accountNoError}
          />
        </div>
        <div className="mbsc-row margin_bottom_20px">
          <div className="mbsc-col-12" htmlFor="roomCount">
            Tên chủ tài khoản (*):
          </div>
          <TextField
            inputClassName="mt-2"
            className="block col-span-8 w-full"
            id="roomCount"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value.toUpperCase())}
            error={accountNameError}
            helperText={accountNameError}
          />
        </div>
      </div>
      <div className="constract-confirm">
        <input
          className="checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <p>
          Nếu bạn đồng ý với mọi điều khoản của chúng tôi, vui lòng chọn đồng ý
        </p>
      </div>
      <div className="contact-submit">
        <button
          className="btn-submit btn__primary"
          onClick={handleFormSubmit}
          disabled={!isChecked}
        >
          Đăng ký thành chủ nhà
        </button>
      </div>
    </div>
  );
};

export default BecomeHouseOwner;
