import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useClickOutside } from "../../CustomHooks/hooks";

export const Modal = ({
    children,
    setOpenModal,
    className = "",
    openOnOutside = true,
}) => {
    const ref = useClickOutside((value) => openOnOutside && setOpenModal(value));
    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center z-[10000]`}>
            <div className={`bg-white rounded-md shadow-lg ${className}`} ref={ref}>
                <div className='px-4 pt-4 flex'>
                    <button
                        onClick={() => setOpenModal(false)}
                        className='rounded-full text-sm font-medium bg-danger-500 text-white hover:bg-danger-600 w-6 h-6 ml-auto flex items-center justify-center'>
                        <CloseRoundedIcon fontSize='8' />
                    </button>
                </div>
                <div className='px-4 pb-4'>{children}</div>
            </div>
        </div>
    );
};
