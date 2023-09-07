import React from "react";
import DatatableAccommodationHouseOwner from "../../../components/datatable/DatatableAccommodationHouseOwner";
import Navbar from "../../../components/navbar/Navbar";
import "./ListAccommodation.css";
const ListAccommodation = () => {
    return (
        <div className='list'>
            <div className='listContainer'>
                <Navbar />
                <DatatableAccommodationHouseOwner />
            </div>
        </div>
    );
};

export default ListAccommodation;
