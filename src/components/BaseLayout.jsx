import Navbar from "./navbar/Navbar";

const BaseLayout = ({ children }) => {
    return (
        <div className='h-screen overflow-hidden'>
            <Navbar />
            <div className='w-full overflow-auto h-[calc(100vh-4rem)]'>{children}</div>
        </div>
    );
};

export default BaseLayout;
