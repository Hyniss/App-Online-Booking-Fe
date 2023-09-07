import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

export const XDatePicker = ({
    value,
    minDate = null,
    maxDate = null,
    className = "",
    onChangeValue = null,
}) => {
    return (
        <DatePicker
            dateFormat='dd/MM/yyyy'
            locale='vi'
            className={className}
            selected={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={(value) => {
                if (onChangeValue) {
                    onChangeValue(value);
                }
            }}
            onKeyDown={(e) => {
                e.preventDefault();
            }}
        />
    );
};
