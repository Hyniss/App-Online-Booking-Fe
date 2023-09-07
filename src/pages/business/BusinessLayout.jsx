import Navbar from "./../../components/navbar/Navbar";
import SidebarBusiness from "./sidebar/SidebarBusiness";

const BusinessLayout = ({ children, company = null }) => {
    return (
        <div className='h-screen overflow-hidden'>
            <Navbar />
            <div className='flex h-full'>
                <SidebarBusiness company={company} />
                <div className='w-full h-full overflow-auto bg-gray-100/75'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BusinessLayout;
