import React, { useState } from "react";
import "./Dashboard.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Widget from "../../../components/widget/widget";
import Featured from "../../../components/featured/Featured";
import Chart from "../../../components/chart/Chart";
import List from "../../../components/table/Table";
import { useEffectOnce } from "../../../CustomHooks/hooks";
import { callRequest } from "../../../utils/requests";

const Dashboard = () => {
  const [usersData, setUsersData] = useState({});
  const [bookingsData, setBookingsData] = useState({});
  const [earningsData, setEarningsData] = useState({});
  const [todayRevenue, setTodayRevenue] = useState("");
  const [lastWeekRevenue, setLastWeekRevenue] = useState("");
  const [lastMonthRevenue, setLastMonthRevenue] = useState("");
  const [revenueOfMonths, setRevenueOfMonths] = useState([]);
  useEffectOnce(() => {
    const getData = () => {
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      callRequest(`user/admin/dashboard`, requestOptions)
        .then((response) => {
          setUsersData(response.data.users);
          setBookingsData(response.data.bookings);
          setEarningsData(response.data.earnings);
          setTodayRevenue(response.data.todayRevenue);
          setLastWeekRevenue(response.data.lastWeekRevenue);
          setLastMonthRevenue(response.data.lastMonthRevenue);
          setRevenueOfMonths(response.data.revenueOfMonths);
        })
        .catch((error) => console.log("error", error));
    };

    getData();
  });

  const sortedRevenue = revenueOfMonths.sort((a, b) => {
    if (a.year === b.year) {
      return a.month - b.month;
    } else {
      return a.year - b.year;
    }
  });

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

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Navbar />
        <div className="widgets">
          <Widget
            type="user"
            amount={usersData.total}
            diff={usersData.increasePercentage}
          />
          <Widget
            type="booking"
            amount={bookingsData.total}
            diff={bookingsData.increasePercentage}
          />
          <Widget
            type="earning"
            amount={Number(earningsData.total).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
            diff={earningsData.increasePercentage}
          />
        </div>
        <div className="charts">
          <Featured
            todayRevenue={todayRevenue}
            lastWeekRevenue={lastWeekRevenue}
            lastMonthRevenue={lastMonthRevenue}
          />
          <Chart
            title="Doanh thu trong 1 năm"
            aspect={2 / 1}
            data={convertSpending(sortedRevenue)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
