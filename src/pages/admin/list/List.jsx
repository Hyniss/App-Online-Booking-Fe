import React from "react";
import "./List.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Datatable from "../../../components/datatable/Datatable";
import { useLocation } from "react-router-dom";
import DatatableAccommodation from "../../../components/datatable/DatatableAccommodation";
import DatatableContract from "../../../components/datatable/DatatableContract";

const List = () => {
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        {path.includes("/user") && <Datatable />}
        {path.includes("/accommodation") && <DatatableAccommodation />}
        {path.includes("/contract") && <DatatableContract />}
      </div>
    </div>
  );
};

export default List;
