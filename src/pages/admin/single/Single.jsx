import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chart from "../../../components/chart/Chart";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import List from "../../../components/table/Table";
import "./Single.css";
import { callRequest } from "../../../utils/requests";
import { Spinner } from "../../../components/base/Animations";
import { Photo } from "../../../components/base/Photo";

const Single = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
    };
    callRequest(`user/admin?id=${userId}`, requestOptions)
      .then((response) => {
        setUser(response);
      })
      .catch((response) => alert(response.message));
  };

  if (!user) {
    return (
      <div className="flex items-center flex-col justify-center px-8 py-4">
        <span className="text-primary-500 scale-[2]"></span>
        <Spinner className="text-primary-500 w-8 h-8" />
        <label htmlFor="" className="text-2xl mt-4">
          Xin vui lòng chờ
        </label>
      </div>
    );
  }

  function convertSpending(spending) {
    const output = spending.map((item) => {
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];
      const monthName = monthNames[item.month - 1];

      return {
        name: monthName,
        Total: Number(item.amount),
      };
    });
    return output;
  }

  function snakeCaseToTitleCase(str) {
    const words = str.split(",");
    const titleCaseWords = words.map((word) => {
      const trimmedWord = word.trim();
      const lowerCasedWord = trimmedWord.toLowerCase();
      return (
        lowerCasedWord.charAt(0).toUpperCase() +
        lowerCasedWord.slice(1).replace("_", " ")
      );
    });
    return titleCaseWords.join(", ");
  }

  function convertStatus(params) {
    let status = "";
    if (params === "ACTIVE") status = "Hoạt động";
    else if (params === "PENDING") status = "Chờ duyệt";
    else status = "Cấm";
    return status;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <h1 className="title">Thông tin cá nhân</h1>
            <div className="item">
              <Photo
                src={user.data.avatar}
                className="rounded-full cursor-pointer object-cover"
                style={{
                  width: 100,
                  height: 100,
                }}
                errorSrc={
                  "https://media.licdn.com/dms/image/D5603AQFjj8ax4V-xAA/profile-displayphoto-shrink_800_800/0/1630492357650?e=2147483647&v=beta&t=YjkYny8bntrJCfZC9myByVcPUdSEt-7kM8e31ajsByo"
                }
              />
              {/* <img className="itemImg" src={user.data.avatar} alt="avatar" /> */}
              {/* <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              /> */}
              <div className="details">
                <h1 className="itemTitle">{user.data.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{user.data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <span className="itemValue">{user.data.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Vai trò:</span>
                  <span className="itemValue">
                    {snakeCaseToTitleCase(user.data.roles.toString())}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Trạng thái:</span>
                  <span className="itemValue">
                    {convertStatus(user.data.status)}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Cập nhật lần cuối:</span>
                  <span className="itemValue">{user.data.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart
              aspect={3 / 1}
              title="Thống kê chi tiêu (trong 6 tháng)"
              data={convertSpending(user.data.spendingResponses)}
            />
          </div>
        </div>
        {/* <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div> */}
      </div>
    </div>
  );
};

export default Single;
