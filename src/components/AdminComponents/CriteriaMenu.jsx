import { useCallbackState, useClickOutside } from "../../CustomHooks/hooks";
import { strings } from "../../utils/strings";
import Input from "../base/input";

export const supportCriterias = {
    CONTAINS: {
        operator: "CONTAINS",
        label: "chứa",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='text'></Input>
        ),
    },
    STARTS_WITH: {
        operator: "STARTS_WITH",
        label: "bắt đầu bằng",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='text'></Input>
        ),
    },
    ENDS_WITH: {
        operator: "ENDS_WITH",
        label: "kết thúc bằng",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='text'></Input>
        ),
    },
    EQUALS: {
        operator: "EQUALS",
        label: "là",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='number'></Input>
        ),
    },
    EQUALS_NUMBER: {
        operator: "EQUALS",
        label: "bằng",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='number'></Input>
        ),
    },
    GREATER_THAN: {
        operator: "GREATER_THAN",
        label: "lớn hơn",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='number'></Input>
        ),
    },
    LESS_THAN: {
        operator: "LESS_THAN",
        label: "nhỏ hơn",
        inputs: (value, setValue) => (
            <Input
                onChangeValue={(value) => setValue([value])}
                placeHolder={"Nhập giá trị..."}
                className='w-96 mt-2'
                inputClassName='h-12'
                text={value.current[0]}
                type='number'></Input>
        ),
    },
    IN: {
        label: "thuộc",
        operator: "IN",
        inputs: (value, setValue, availableValues) => (
            <div className='ml-[1.75rem]'>
                {Object.keys(availableValues).map((key) => {
                    const id = strings.generateId();
                    return (
                        <div
                            key={id}
                            className='mt-2 flex gap-2 items-center'
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setValue((values_) => [...values_, e.target.value]);
                                } else {
                                    setValue((values_) =>
                                        values_.filter((v) => v !== e.target.value)
                                    );
                                }
                            }}>
                            <input
                                type='checkbox'
                                id={id}
                                name={"criteriaValue"}
                                value={key}
                            />
                            <label
                                htmlFor={id}
                                className=' selection:text-indigo-500 block h-max'>
                                {availableValues[key].element}
                            </label>
                        </div>
                    );
                })}
            </div>
        ),
    },
    BEFORE: { label: "trước", operator: "BEFORE" },
    AFTER: { label: "sau", operator: "AFTER" },
    BETWEEN: { label: "trong khoảng", operator: "BETWEEN" },
};

export const CriteriaMenu = ({
    fields,
    style,
    setShowCriteriaOptions,
    onAddCriteria,
}) => {
    const [key, setKey] = useCallbackState(null);
    const [operator, setOperator] = useCallbackState(null);
    const [value, setValue] = useCallbackState([]);
    const [field, setField] = useCallbackState(null);
    const criteriaRef = useClickOutside(setShowCriteriaOptions);

    const onSetOperator = (value) => {
        setOperator(value);
        setValue([]);
    };

    return (
        <div className='fixed flex gap-3' style={style} ref={criteriaRef}>
            <div className='p-2 bg-white rounded-md flex flex-col drop-shadow-xl gap-1 border border-gray-100'>
                {fields.map((field, index) => (
                    <button
                        onClick={() =>
                            Promise.resolve()
                                .then(() => setKey(field.value))
                                .then(() => setField(field))
                        }
                        className={`text-left px-4 py-2 text-sm rounded-md ${
                            key.current === field.value
                                ? "bg-gray-100 hover:bg-gray-200"
                                : "hover:bg-gray-100"
                        }`}
                        key={index}>
                        {field.text}
                    </button>
                ))}
            </div>
            {key.current && (
                <div className='p-4 bg-white rounded-md flex flex-col drop-shadow-xl gap-3 min-w-[24rem] h-max'>
                    {(field.current?.criteriaList || []).map((criteria, index) => (
                        <OptionRadio
                            criteria={criteria}
                            name={"criteria"}
                            onSelected={onSetOperator}
                            setValue={setValue}
                            value={value}
                            selectingOperator={operator}
                            key={index}
                            availableValues={field.current?.availableValues}
                        />
                    ))}
                    <div className='flex gap-2 w-full'>
                        <button
                            onClick={() => setShowCriteriaOptions(false)}
                            className='rounded-md px-6 text-sm font-medium bg-gray-200 text-black hover:bg-gray-200 py-3'>
                            Huỷ
                        </button>
                        <button
                            disabled={
                                !(
                                    operator.current &&
                                    value.current &&
                                    value.current.length > 0
                                )
                            }
                            onClick={() => {
                                onAddCriteria(
                                    key.current,
                                    operator.current,
                                    value.current
                                );
                                setShowCriteriaOptions(false);
                            }}
                            className='rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 py-3 w-full disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400'>
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const OptionRadio = ({
    name,
    criteria,
    selectingOperator,
    onSelected,
    value,
    setValue,
    availableValues,
}) => {
    const id = strings.generateId();
    const inputs = supportCriterias[criteria].inputs;
    const operator = supportCriterias[criteria].operator;
    return (
        <div className=''>
            <input
                type='radio'
                id={id}
                name={name}
                value={operator}
                className='!border-solid'
                onChange={(e) => onSelected(operator)}
            />
            <label htmlFor={id} className='ml-3 selection:text-indigo-500'>
                {supportCriterias[criteria].label}
            </label>
            {selectingOperator.current === operator &&
                inputs &&
                inputs(value, setValue, availableValues)}
        </div>
    );
};
