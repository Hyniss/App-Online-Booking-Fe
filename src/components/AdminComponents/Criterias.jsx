import AddIcon from "@mui/icons-material/Add";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import React from "react";
import { useElementProp } from "../../CustomHooks/hooks";
import { CriteriaMenu, supportCriterias } from "./CriteriaMenu";

export const SearchCriterias = ({ criteriaList, setCriteriaList, fields, searchCallback = null, buttonClassName = "", criteriaClassName = "" }) => {
    const [showCriteriaOptions, setShowCriteriaOptions] = React.useState(false);
    const [showingFields, setShowingFields] = React.useState(fields);
    const [buttonRef, position] = useElementProp();
    return (
        <div className='flex gap-3 flex-wrap'>
            <button
                onClick={() => setShowCriteriaOptions((option) => !option)}
                ref={buttonRef}
                className={`rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12 ${buttonClassName}`}>
                <AddIcon />
            </button>
            {(criteriaList || []).map((criteria, index) => {
                const field = fields.filter((column) => column.value === criteria.key)[0];
                return (
                    <div
                        className={`rounded-md px-3 text-sm font-medium bg-gray-200/75 hover:bg-gray-300/75 cursor-default h-12 flex items-center text-gray-500 gap-1 ${criteriaClassName}`}
                        key={index}>
                        <span className=''>{field.text} </span>
                        <span className='text-indigo-500'>{supportCriterias[criteria.operation].label} </span>
                        {criteria.value.map((value) =>
                            field.availableValues ? (
                                field.availableValues[value].element
                            ) : (
                                <span key={index} className='select-none rounded-md px-3 py-1 text-sm font-medium bg-gray-200 text-gray-600 hover:bg-gray-300/75 block w-max border border-gray-300'>
                                    {value}
                                </span>
                            )
                        )}
                        <button
                            className='ml-2 p-1 rounded-md hover:bg-gray-300'
                            onClick={() =>
                                Promise.resolve()
                                    .then(() => setCriteriaList((criterias) => criterias.filter((c) => c !== criteria)))
                                    .then(() => searchCallback && searchCallback())
                                    .then(() => {
                                        const newFields = [...showingFields, field];
                                        setShowingFields(fields.filter((field_) => newFields.includes(field_)));
                                    })
                            }>
                            <CloseRoundedIcon className='text-xl' fontSize='6' />
                        </button>
                    </div>
                );
            })}
            {showCriteriaOptions && (
                <CriteriaMenu
                    fields={showingFields}
                    style={{ top: position.bottom + 8, left: position.left }}
                    setShowCriteriaOptions={setShowCriteriaOptions}
                    onAddCriteria={(key, operation, value) =>
                        Promise.resolve()
                            .then(() => setCriteriaList((criterias) => [...criterias, { key, operation, value: value }]))
                            .then(() => searchCallback && searchCallback())
                            .then(() => setShowingFields(showingFields.filter((field) => field.value !== key)))
                    }
                />
            )}
        </div>
    );
};
