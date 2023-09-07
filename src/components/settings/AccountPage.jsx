import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import RequestPageOutlinedIcon from "@mui/icons-material/RequestPageOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useAuth } from "../../context/Auth";
import { strings } from "../../utils/strings";
import BaseLayout from "../BaseLayout";
export const AccountPage = () => {
    const [user, ,] = useAuth([
        "ADMIN",
        "CUSTOMER",
        "HOUSE_OWNER",
        "BUSINESS_OWNER",
        "BUSINESS_ADMIN",
        "BUSINESS_MEMBER",
    ]);
    return (
        <BaseLayout>
            <div className='px-4 w-full max-w-[1080px] my-12 sm:my-24 m-auto'>
                <h3 className='text-3xl font-bold'>Thông tin tài khoản</h3>
                <div className='flex gap-2 md:items-center md:flex-row flex-col items-start'>
                    <h3 className='text-xl mt-2'>
                        <span className='font-bold'>{user?.username}</span>
                        <span>, {user?.email ?? strings.phoneWoRegion(user?.phone)}</span>
                    </h3>
                    <a
                        href={`/profile/${user?.id}`}
                        className='btn__primary px-3 py-2 !text-white block'>
                        Chi tiết thông tin
                    </a>
                </div>
                <div className='mt-12 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center mb-12'>
                    <a
                        href='personal-info'
                        className='w-full rounded-md border border-gray-300 hover:ring-[3px] ring-gray-200 px-4 py-4'>
                        <AccountCircleOutlinedIcon className='scale-125' />
                        <h4 className='mt-8 text-xl font-bold'>Thông tin cá nhân</h4>
                        <p className='text-gray-500'>
                            Cung cấp thông tin của bạn để chúng tôi dễ dàng liên hệ một
                            cách tốt nhất
                        </p>
                    </a>
                    {user?.roles.includes("CUSTOMER")  && (
                        <a
                            href='/book/history'
                            className='w-full rounded-md border border-gray-300 hover:ring-[3px] ring-gray-200 px-4 py-4'>
                            <ShoppingCartOutlinedIcon className='scale-125' />
                            <h4 className='mt-8 text-xl font-bold'>Lịch sử đặt phòng</h4>
                            <p className='text-gray-500'>
                                Những phòng mà bạn đã đặt trên hệ thống
                            </p>
                        </a>
                    )}
                    {user?.roles.includes("CUSTOMER") &&
                        !user?.roles.includes("HOUSE_OWNER") && (
                            <a
                                href='/house-owner/register'
                                className='w-full rounded-md border border-gray-300 hover:ring-[3px] ring-gray-200 px-4 py-4'>
                                <HowToRegOutlinedIcon className='scale-125' />
                                <h4 className='mt-8 text-xl font-bold'>
                                    Trở thành chủ nhà
                                </h4>
                                <p className='text-gray-500'>
                                    Đăng ký trở thành chủ nhà để đăng những ngôi nhà của
                                    bạn
                                </p>
                            </a>
                        )}
                    {user?.roles.includes("HOUSE_OWNER") && (
                        <a
                            href='/house-owner/accommodation/'
                            className='w-full rounded-md border border-gray-300 hover:ring-[3px] ring-gray-200 px-4 py-4'>
                            <HomeWorkOutlinedIcon className='scale-125' />
                            <h4 className='mt-8 text-xl font-bold'>
                                Quản lý nhà của tôi
                            </h4>
                            <p className='text-gray-500'>
                                Quản lý những ngôi nhà mà bạn đã đăng ký
                            </p>
                        </a>
                    )}
                    {user?.roles.includes("HOUSE_OWNER") && (
                        <a
                            href='/book/history-houseowner'
                            className='w-full rounded-md border border-gray-300 hover:ring-[3px] ring-gray-200 px-4 py-4'>
                            <RequestPageOutlinedIcon className='scale-125' />
                            <h4 className='mt-8 text-xl font-bold'>Quản lý đặt phòng</h4>
                            <p className='text-gray-500'>
                                Quản lý những yêu cầu của khách hàng đặt phòng của bạn
                            </p>
                        </a>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
};
