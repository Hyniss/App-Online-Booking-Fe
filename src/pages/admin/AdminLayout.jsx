import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

export const AdminLayout = ({ children }) => (
    <div className='flex overflow-hidden h-screen'>
        <div className='w-80'>
            <Sidebar className='row-span-2 h-full bg-white' />
        </div>
        <div className='w-full'>
            <Navbar />
            {children}
        </div>
    </div>
);
