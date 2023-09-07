import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import React from "react";

export const Paging = ({
    setPageSize,
    search,
    pageSizes,
    currentPage,
    totalPages,
    setCurrentPage,
}) => {
    const [showingPages, setShowingPages] = React.useState([]);

    React.useEffect(() => {
        const getShowingPages = () => {
            const pagesArround = [
                currentPage - 2,
                currentPage - 1,
                currentPage,
                currentPage + 1,
                currentPage + 2,
            ];
            return pagesArround.filter((pageNo) => pageNo > 1 && pageNo < totalPages);
        };
        setShowingPages(getShowingPages());
    }, [currentPage, totalPages]);

    return (
        <div className='flex gap-2 p-4 border-t border-gray-200 items-center'>
            <label className='ml-auto font-medium text-sm'>
                Số lượng trên một trang:{" "}
            </label>
            <div className='w-16'>
                <select
                    className='!h-10 font-medium text-sm !px-4  rounded-md border-gray-300'
                    onChange={(e) =>
                        Promise.resolve()
                            .then(() => setPageSize(parseInt(e.target.value)))
                            .then(() => search())
                    }>
                    {pageSizes.map((index) => (
                        <option value={index} key={index}>
                            {index}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={() =>
                    Promise.resolve()
                        .then(() => setCurrentPage((page) => page - 1))
                        .then(() => search())
                }
                disabled={currentPage <= 1}
                className='bg-gray hover:bg-gray-200 rounded-md p-1 disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-300'>
                <KeyboardArrowLeftRoundedIcon />
            </button>
            <button
                onClick={() =>
                    Promise.resolve()
                        .then(() => setCurrentPage(1))
                        .then(() => search())
                }
                className={` border border-gray-300 hover:bg-gray-200 rounded-md py-1 px-[0.625rem] disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-300 font-medium text-sm ${
                    currentPage === 1 ? "bg-indigo-100" : ""
                }`}>
                1
            </button>
            {showingPages.length > 0 && !showingPages.includes(2) && (
                <label className='block'>...</label>
            )}
            {showingPages.map((pageNo) => (
                <button
                    key={pageNo}
                    onClick={() =>
                        Promise.resolve()
                            .then(() => setCurrentPage(pageNo))
                            .then(() => search())
                    }
                    className={` border border-gray-300 hover:bg-gray-200 rounded-md py-1 px-[0.625rem] disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-300 font-medium text-sm ${
                        currentPage === pageNo ? "bg-indigo-100" : ""
                    }`}>
                    {pageNo}
                </button>
            ))}
            {showingPages.length > 0 && !showingPages.includes(totalPages - 1) && (
                <label className='block'>...</label>
            )}
            {totalPages > 1 && (
                <button
                    onClick={() =>
                        Promise.resolve()
                            .then(() => setCurrentPage(totalPages))
                            .then(() => search())
                    }
                    className={` border border-gray-300 hover:bg-gray-200 rounded-md py-1 px-[0.625rem] disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-300 font-medium text-sm ${
                        currentPage === totalPages ? "bg-indigo-100" : ""
                    }`}>
                    {totalPages}
                </button>
            )}
            <button
                onClick={() =>
                    Promise.resolve()
                        .then(() => setCurrentPage((page) => page + 1))
                        .then(() => search())
                }
                disabled={currentPage >= totalPages}
                className='hover:bg-gray-200 rounded-md p-1 disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-300'>
                <KeyboardArrowRightRoundedIcon />
            </button>
        </div>
    );
};
