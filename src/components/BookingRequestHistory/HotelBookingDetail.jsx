import React from "react";
import "./Booking.css";
import { ImLocation2 } from "react-icons/im";
import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FcInfo } from "react-icons/fc";
import { IoPeopleOutline } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { useState } from "react";

export const HotelBookingDetail = ({ data }) => {
  const [isHover, setHover] = useState(false);
 console.log("data",data.bookingRequestSpecifics);
 const totalPrice = parseInt(data.transaction.amount, 10);
  return (
    <>
    
      <div className="hotelInfo">
        <div className="hotel-img">
          <img  alt="" />
        </div>
        <div className="hotelDetails">
          <div className="best">{data.accommodationName}</div>
          <div className="hotelName"></div>
          <div className="stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
          </div>
          <p className="addre"></p>
          <div className="exellent">
            <ImLocation2 style={{ width: 20, height: 15 }} />
            <span>Excellent location</span>
            <span className="exellent1">- What's nearby?</span>
          </div>
        </div>
      </div>
      {data && data.bookingRequestSpecifics.map((item, index) => {
        // const room = HomeDetail.rooms.find((e) => e.id === item.roomId);
        if (Array.isArray(item.room)) {
        return   item.room.map((itemRoom, indexRoom) => (
             
          <div key={indexRoom} className="hotelInfo1">
            <div className="dateHolder">
              {/* <span>{From} - {To}</span>
              <span>{duration} night</span> */}
            </div>
            <div className="quantity">{item.totalRooms} x {itemRoom.name}</div>
            {/* <div className="ratingHolder">
          <div className="ratingBox">5</div>
          <div className="rev">
            <div>Excellent cleanliness</div>
            <div>From  reviews</div>
          </div>
        </div> */}
            <div className="line"></div>
            <div className="roomNumber">
              <IoPersonOutline />
              {/* <span>{room.properties[0].value} {room.properties[0].key}, {room.properties[3].value} {room.properties[3].key}</span> */}
            </div>
            <div className="roomNumber">
              <IoPeopleOutline />
              {/* <span>{room.properties[3].value} {room.properties[3].key}</span> */}
            </div>
            <div className="line"></div>
            {/* <span className="great1" style={{ fontSize: 14 }}>
          RISK FREE cancellation before 23:59 hrs. on 01 September 2021
          (property local time)
        </span> */}
          </div>
          ));
    }else{
        return  (
             
            <div key={index} className="hotelInfo1">
              <div className="dateHolder">
                {/* <span>{From} - {To}</span>
                <span>{duration} night</span> */}
              </div>
              <div className="quantity">{item.room.name}</div>
              {/* <div className="ratingHolder">
            <div className="ratingBox">5</div>
            <div className="rev">
              <div>Excellent cleanliness</div>
              <div>From  reviews</div>
            </div>
          </div> */}
              <div className="line"></div>
              <div className="roomNumber">
                <IoPersonOutline />
                <span>{item.room.properties[0].value} {item.room.properties[0].key}</span>
              </div>
              <div className="roomNumber">
                <IoPersonOutline />
                <span>{item.room.properties[2].value} {item.room.properties[2].key}</span>
              </div>
              <div className="roomNumber">
                <IoPeopleOutline />
                <span>{item.room.properties[1].value} {item.room.properties[1].key}</span>
              </div>
              <div className="roomNumber">
                <IoPeopleOutline />
                <span>{item.room.properties[3].value} {item.room.properties[3].key}</span>
              </div>
              <div className="roomNumber">
                <IoPeopleOutline />
                <span>{item.room.properties[4].value} {item.room.properties[4].key}</span>
              </div>
              <div className="line"></div>
              <span className="great1" style={{ fontSize: 14 }}>
               Price : {item.room.price}
          </span>
            </div>
            );
    }
      })}


      {/* <div className="Hurry">
        <span className="redbar"></span>
        <img src="Timer.png" alt="" />
        <div className="hurryInfo">
          <p className="hurryUp">
            Hurry! Our last room for your dates at this price
          </p>
          <span className="hurryUp1">It's only</span>
          <span className="hurryUp">2</span>
          <span className="hurryUp1">days untill your check-in.</span>
          <span className="hurryUp">Rates may rise if you don’t book now.</span>
        </div>
      </div> */}

      <div className="PriceHolder">
        <div className="PriceInfo">
          <div>
            <span>Total Room: ({data.totalRooms})</span>
            <span>Price : {totalPrice.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div style={{ marginTop: 20 }}>
            <span>Booking about tax and fees</span>
            <span style={{ color: "rgb(72,139,248)", fontWeight: 500 }}>
              
            </span>
          </div>
        </div>
        <div className="dateHolder1">
          <div className="it">
            <span>Total Price</span>
            <div
              className="moreInfo"
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              <FcInfo style={{ cursor: "pointer" }} />
              <div
                className={`pricePolicy ${isHover ? "activePo" : "deactive"}`}
              >
                <h4>Hotel tax and services fees</h4>
                <p>
                  Taxes and service fees are generally recovery charges which
                  Agoda pays to the vendor or which are collected by the vendor.
                  For more details, please see the Agoda Terms of Use. Tax and
                  service fees may also contain fees that Agoda retains as
                  compensation for processing the reservation.
                </p>
              </div>
            </div>
          </div>
          <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
        </div>
        <span style={{ fontSize: 24, fontWeight: 500, marginLeft: 12 }}>
            {data.transaction.bankTransactionNo && "Đã Thanh Toán"} 
        </span>
        <span style={{ fontSize: 12 }}>
        </span>
      </div>
    </>
  );
};
