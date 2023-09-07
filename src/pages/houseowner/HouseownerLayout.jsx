import Navbar from "../../components/navbar/Navbar";
import SidebarHouseowner from "../business/sidebar/SidebarHouseowner";


const HouseownerLayout = ({ children }) => {
    return (
        <div className='h-screen overflow-hidden'>
            <Navbar />
            <div className='flex h-full'>
                <SidebarHouseowner />
                <div className='w-full h-full overflow-auto bg-gray-100/75'>{children}</div>
            </div>
        </div>
    );
};

export default HouseownerLayout;
