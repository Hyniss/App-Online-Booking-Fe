import vi from "date-fns/locale/vi"; // the locale you want
import "mapbox-gl/dist/mapbox-gl.css";
import "moment/locale/vi";
import moment from "moment/moment";
import React from "react";
import { registerLocale } from "react-datepicker";
import { Route, Routes } from "react-router-dom";
import { BookingRequestDetail } from "./components/BookingRequestHistory/BookRequestDetail";
import { BookingRequestHistory } from "./components/BookingRequestHistory/BookRequestHistory";
import { BookingRequestBusiness } from "./components/BookingRequestHistory/BookingRequestBusiness";
import { BookingRequestHistoryHo } from "./components/BookingRequestHistory/BookingRequestHistoryHo";
import { Transaction } from "./components/BookingRequestHistory/Transaction";
import { HomePage } from "./components/HomePage/HomePage";
import Register from "./components/Register/Register";
import RegisterBusinessOwner from "./components/Register/RegisterBusinessOwner";
import RegisterUsingPhone from "./components/Register/RegisterUsingPhone";
import RegisterVerifyToken from "./components/Register/RegisterVerifyToken";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import { DemoUploadFiles } from "./components/demo/UploadMultipleFiles";
import Login from "./components/login/Login";
import { AccountPage } from "./components/settings/AccountPage";
import { PersonalInformation } from "./components/settings/PersonalInfo";
import { UpdateEmailVerificationPage } from "./components/settings/UpdateEmailVerificationPage";
import UserProfile from "./components/settings/UserProfile";
import { AdminDetailCompany } from "./pages/admin/company/AdminDetailCompany.";
import { AdminListCompany } from "./pages/admin/company/AdminListCompany";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import List from "./pages/admin/list/List";
import New from "./pages/admin/new/New";
import Single from "./pages/admin/single/Single";
import { CompanyDetail } from "./pages/business/CompanyDetail";
import DetailBusinessBooking from "./pages/business/businessBooking/DetailBusinessBooking";
import ListBusinessBooking from "./pages/business/businessBooking/ListBusinessBooking";
import BusinessTransactionDetail from "./pages/business/businessTransaction/BusinessTransactionDetail";
import ListBusinessTransaction from "./pages/business/businessTransaction/ListBusinessTransaction";
import AddBusinessUser from "./pages/business/manageBusinessUser/AddBusinessUser";
import ListBusinessUser from "./pages/business/manageBusinessUser/ListBusinessUser";
import { Travelstatementuser } from "./pages/business/travelstatementuser/travelstatementuser";
import { Travelstatementba } from "./pages/businessadmin/travelstatementba";
import { BookingRequest } from "./pages/guest/DetailAccommodation/BookingRequest";
import BookingResult from "./pages/guest/DetailAccommodation/BookingResult";
import { DetailAccommodation } from "./pages/guest/DetailAccommodation/DetailAccommodation";
import { DetailBooking } from "./pages/guest/DetailAccommodation/DetailBooking";
import CreateAccommodation from "./pages/houseowner/createAccommodation/CreateAccommodation";
import CreateRoom from "./pages/houseowner/createAccommodation/CreateRoom";
import DetailAccommodationForHouseOwner from "./pages/houseowner/detailAccommodation/DetailAccommodationForHousOwner";
import ListAccommodation from "./pages/houseowner/listAccommodation/ListAccommodation";
import BecomeHouseOwner from "./pages/houseowner/registHouseowner/BecomeHouseOwner";
import DetailRoom from "./pages/houseowner/room/DetailRoom";
import CalendarOfRoom from "./pages/houseowner/updateAccommodation/CalendarOfRoom";
import UpdateAccommodation from "./pages/houseowner/updateAccommodation/UpdateAccommodation";
import UpdateRoom from "./pages/houseowner/updateAccommodation/UpdateRoom";

function App() {
    moment.locale("vi");
    registerLocale("vi", vi);

    return (
        <div className='App'>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<RegisterUsingPhone />} />
                <Route path='/register/verify' element={<RegisterVerifyToken />} />
                <Route path='/register/email' element={<Register />} />
                <Route path='/register/business' element={<RegisterBusinessOwner />} />
                <Route path='/password/reset' element={<ResetPassword />} />
                <Route path='/profile/:id' element={<UserProfile />} />
                <Route path='/personal-info' element={<PersonalInformation />} />
                <Route
                    path='/personal-info/password/verify'
                    element={<UpdateEmailVerificationPage />}
                />
                <Route path='/detail/:id' element={<BookingRequest />} />
                <Route path='/demo/upload' element={<DemoUploadFiles />} />
                <Route path='/business/company/detail' element={<CompanyDetail />} />
                <Route path='/book/:id/transaction' element={<BookingResult />} />
                <Route path='/admin/company' element={<AdminListCompany />} />
                <Route path='/admin/company/:id' element={<AdminDetailCompany />} />
                <Route path='/DetailAccommodation' element={<DetailAccommodation />} />
                <Route path='/:id' element={<DetailAccommodation />} />
                <Route path='/book/:id' element={<DetailBooking />} />
                <Route path='/house-owner/register' element={<BecomeHouseOwner />} />
                <Route path='/book/history' element={<BookingRequestHistory />} />
                <Route
                    path='/book/history-houseowner'
                    element={<BookingRequestHistoryHo />}
                />
                <Route
                    path='/RequestDetail/:paymentId'
                    element={<BookingRequestDetail />}
                />
                <Route path='/transaction' element={<Transaction />} />
                <Route path='/account' element={<AccountPage />} />
                <Route path='/admin'>
                    <Route index element={<Dashboard />} />
                    <Route path='users'>
                        <Route index element={<List />} />
                        <Route path=':userId' element={<Single />} />
                        <Route path='new' element={<New />} />
                    </Route>
                    <Route path='accommodation'>
                        <Route index element={<List />} />
                        <Route path=':accommodationId' element={<Single />} />
                        <Route path='new' element={<New />} />
                    </Route>
                    <Route path='contract'>
                        <Route index element={<List />} />
                        <Route path=':contract' element={<Single />} />
                        <Route path='new' element={<New />} />
                    </Route>
                    <Route path='company'>
                        <Route path=':contract' element={<Single />} />
                        <Route path='new' element={<New />} />
                    </Route>
                </Route>
                <Route path='/house-owner/accommodation/'>
                    <Route index element={<ListAccommodation />} />
                    <Route
                        path=':accommodationId'
                        element={<DetailAccommodationForHouseOwner />}
                    />
                    <Route path='new' element={<CreateAccommodation />} />
                    <Route
                        path='update/:accommodationId'
                        element={<UpdateAccommodation />}
                    />
                    <Route
                        path=':accommodationId/room/:roomId'
                        element={<DetailRoom />}
                    />
                    <Route
                        path=':accommodationId/room/:roomId/calendar'
                        element={<CalendarOfRoom />}
                    />
                    <Route path='new/room/:accommodationId' element={<CreateRoom />} />
                    <Route
                        path=':accommodationId/updateRoom/:roomId'
                        element={<UpdateRoom />}
                    />
                </Route>
                <Route path='/business'>
                    <Route path='transaction' element={<ListBusinessTransaction />} />
                    <Route
                        path='transaction/:transactionId'
                        element={<BusinessTransactionDetail />}
                    />
                    <Route path='user/createUser' element={<AddBusinessUser />} />
                    <Route path='user' element={<ListBusinessUser />} />
                    <Route path='booking' element={<ListBusinessBooking />} />
                    <Route
                        path='booking/:bookingId'
                        element={<DetailBusinessBooking />}
                    />
                    <Route
                        path='travel-statement/business-admin'
                        element={<Travelstatementba />}
                    />
                    <Route
                        path='travel-statement/business-member'
                        element={<Travelstatementuser />}
                    />
                    <Route path='booking-request' element={<BookingRequestBusiness />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
