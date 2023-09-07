import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";
import { fomatDate } from "../../common/regex";

export const HDatePicker = ({ editable = false,value,field, error, errorStyle, minDate = null,  maxDate = null, className = "", classNameContainer = "", onChangeValue = null }) => {
    return (
        <div className={classNameContainer}>
        <label className="mx-2 ">{field} <span className='text-red-500 font-bold text-xl'>*</span> </label>
        
        <DatePicker
            dateFormat='dd/MM/yyyy'
            className={className}
            placeholderText="DD/MM/YYYY"
            readOnly = {editable}
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
        {error && error.trim() !== "" && <p className={`text-danger-500 ${errorStyle}`}>{error}</p>}
        </div>
    );
};
