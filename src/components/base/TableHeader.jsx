import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
export const TableHeader = ({
    index,
    data: column,
    sortProperty,
    setSortProperty,
    isDescending,
    setIsDescending,
}) => {
    const setSortColumn = () => {
        setIsDescending(sortProperty === column.value ? !isDescending : true);
        setSortProperty(column.value);
    };

    return (
        <th
            className={`h-16 text-left text-black dark:text-white ${
                index === 0 ? "px-8" : "px-4"
            }`}
            onClick={() => setSortColumn()}>
            <button className='mr-auto inline-flex w-full cursor-pointer select-none items-start gap-2'>
                <h3
                    className={`${
                        sortProperty === column.value && "text-primary-500"
                    } my-auto text-sm font-medium`}>
                    {column.text}
                </h3>
                {sortProperty === column.value && !isDescending && (
                    <ArrowDropUpRoundedIcon />
                )}
                {sortProperty === column.value && isDescending && (
                    <ArrowDropDownRoundedIcon />
                )}
            </button>
        </th>
    );
};
