import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Booking.css"
import { HotelBookingDetail } from "./HotelBookingDetail";
import Input from "../base/input"; 
import { FcCheckmark, FcLock } from "react-icons/fc";
import { format } from 'date-fns';
export const BookingRequestDetail = () => {


    const {paymentId}  = useParams();
    const [details, setDetails] = useState('');
    // const paymentIdAsNumber = parseInt(paymentId, 10);
    console.log("id",paymentId);

    const listDetail = async () => {
        // const res = await detailApi(paymentId);
        // if (res && res.status === 200) {
        //   console.log(res);
        //   setDetails(res.data);
        //   // navigation("https://www.facebook.com/");
        // }
      }

      useEffect( () => {
        listDetail();
      },[]);
    //  const formatDate = format(new Date(details.checkinAt), 'yyyy-MM-dd'); 
      // console.log("Bug",details.user.username);
    return (
        
          <div className="checkout-Wrapper">
            { details &&
            <div className="checkout-container">
    
                <div className="userInfo">
                  <div className="advice">
                    <span className="greenBar"></span>
                    <span className="tik">
                      <svg width="14px" height="14px" viewBox="0 0 24 24">
                        <path
                          fill="rgb(50, 169, 35)"
                          id="check-valid-state_24px-a"
                          d="M1.146 4.353a.5.5 0 1 1 .708-.706l15.699 15.731a.5.5 0 0 0 .7.008l3.718-3.578a.5.5 0 1 1 .693.72l-3.717 3.578a1.5 1.5 0 0 1-2.102-.021L1.146 4.353z"
                        ></path>
    
                        <use transform="matrix(-1 0 0 1 23.817 0)"></use>
                      </svg>
                    </span>
                    <span className="great">Great choice of property</span>
                    <span className="average">
                      {" "}
                      - with an average guest rating of{" "}
                    </span>
                    <span className="great">  </span>
                    <span className="average">
                      {" "}
                      from  reviews
                    </span>
                  </div>
    
                  <div className="form-container">
                    <div className="time-holder">
                      {/* <div className="timehold">
                        <span className="holding">Holding Pricing...</span>
                        <svg
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                          enable-background="new 0 54 500 500"
                        >
                          <path
                            fill="rgb(57,111,198)"
                            d="M12 23.5C5.649 23.5.5 18.351.5 12S5.649.5 12 .5 23.5 5.649 23.5 12 18.351 23.5 12 23.5zm0-2a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM11.5 6a1 1 0 0 1 2 0v7.08a1 1 0 0 1-.262.675l-3.5 3.83a1 1 0 1 1-1.476-1.35l3.238-3.543V6z"
                          ></path>
                        </svg>
    
                        <button className="continue">I need more time</button>
                      </div> */}
                    </div>
                    
                    <h4>Booking confirmation</h4>
                    <div className="input-container">
                      <label htmlFor="">Full name</label>
                      <Input
                      text={details.user.username}
                      hide={true}
                      ></Input>
                    </div>
                    <div className="input-container">
                      <label htmlFor="">Email</label>
                      <Input  text={details.user.email} hide={true}></Input>
                    </div>
                   
                    
                    {/* <div className="input-container">
                      <label htmlFor="">Retype email</label>
                      <input type="text" placeholder="Retype email" />
                    </div> */}
                    <div className="divide">
                      <div className="input-container">
                        <label htmlFor="">Phone number</label>
                        <Input  text={details.contact} hide={true}></Input>
                      </div>{" "}
                      <div className="input-container">
                        <label htmlFor="">Status</label>
                        <div className="inpp">
                        {details.status}
                          <FcCheckmark
                            style={{
                              marginLeft: 311,
                              marginTop: -31,
                              width: 20,
                              height: 20,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {/* <h4 style={{ marginBottom: 15 }}>Let us know what you need</h4>
                    <label style={{ marginLeft: 20 }}>
                      Requests are fulfilled on a first come, first served basis.
                      We'll send yours right after you book.
                    </label> */}
                    {/* <div className="preference">
                      <div className="question">
                        <label htmlFor="" style={{ display: "block" }}>
                          Do you have a smoking preference?
                        </label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input type="radio" className="check" />
                          <label htmlFor="">Non-smoking</label>
                          <input
                            style={{ marginLeft: 130 }}
                            type="radio"
                            className="check"
                          />
                          <label htmlFor="">Smoking</label>
                        </div>
                      </div>
                      <div className="question">
                        <label htmlFor="" style={{ display: "block" }}>
                          What bed configuration do you prefer?
                        </label>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input type="radio" className="check" />
                          <label htmlFor="">I'd like a large bed</label>
                          <input
                            type="radio"
                            style={{ marginLeft: 100 }}
                            className="check"
                          />
                          <label htmlFor="">I'd like twin beds</label>
                        </div>
                      </div>
                    </div> */}

                    <div className="next">
                    <div className="divide">
                      <div className="input-container">
                        <label htmlFor="">Check-In:</label>
                        {details.checkinAt}
                      </div>{" "}
                      <div className="input-container">
                        <label htmlFor="">Check-Out:</label>
                        {details.checkoutAt}
                      </div>
                    </div>
                    <div className="divide">
                      <div className="input-container">
                        <label htmlFor="">Accommodation Name</label>
                        {details.accommodationName}
                      </div>{" "}
                      <div className="input-container">
                        <label htmlFor="">Owner Name</label>
                        {details.ownerName}
                      </div>
                    </div>

                    </div>
                  </div>
                </div>
    
              <div className="hotel-detail">
                <HotelBookingDetail data={details}/>
              </div>
            </div>
            
            }
           </div>
   
    
      );
}