import React, { useContext } from "react";
import { SearchCriterias } from "../AdminComponents/Criterias"; 
import { Paging } from "../AdminComponents/Paging"; 
// import Input from "../base/input"; 
import { TableHeader } from "../base/TableHeader"; 
import { useAuth } from "../../context/Auth"; 
import {
    useCallbackState,
    useClickOutside,
    useEffectOnce,
} from "../../CustomHooks/hooks";
import { callRequest } from "../../utils/requests"; 
import { strings } from "../../utils/strings"; 
import { UserContext } from "../../context/userContext";

const DatatableTransactionBusinessOwner = () => {
  const user = useAuth();
  const pageSizes = [5, 10, 20];

  // Page details
  const [isDescending, setIsDescending] = useCallbackState(null);
  const [sortProperty, setSortProperty] = useCallbackState(null);
  const [currentPage, setCurrentPage] = useCallbackState(1);
  const [pageSize, setPageSize] = useCallbackState(pageSizes[0]);
  const [criteriaList, setCriteriaList] = useCallbackState([]);

  const [companyList, setCompanyList] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [name, setName] = React.useState("");

  const columns = [
    //   {
    //       value: "id",
    //       text: "Id",
    //       criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
    //   },
      {
        value: "paymentMethod",
        text: "Ngân hàng",
        criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
    },
      {
          value: "transactionRequestNo",
          text: "Số giao dịch yêu cầu",
          criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
      },
      {
          value: "bankTransactionNo",
          text: "Số giao dịch ngân hàng",
          criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
      },
      {
          value: "payDate",
          text: "Ngày giao dịch",
          criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
      },
      {
          value: "createdAt",
          text: "Ngày tạo",
          criteriaList: ["EQUALS", "BEFORE", "AFTER", "BETWEEN"],
      },
      
      {
          value: "amount",
          text: "Chi phí",
          criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
      },
  ];

  const search = React.useCallback(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    const searchingCriterias = [...criteriaList.current];
    if (strings.isNotBlank(name)) {
        searchingCriterias.push({
            key: "name",
            operation: "CONTAINS",
            value: [name],
        });
    }
    var raw = JSON.stringify({
        page: currentPage.current,
        size: pageSize.current,
        orderBy: sortProperty.current || "createdAt",
        descending: isDescending.current,
        criteriaList: searchingCriterias,
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };

    callRequest("transaction/business-admin", requestOptions).then((response) => {
        setCompanyList(response.data.items);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.totalPages);
    });
});



  // const send = React.useCallback(() => {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");
  //     myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

  //     var raw = JSON.stringify({
  //         message: name,
  //     });

  //     var requestOptions = {
  //         method: "POST",
  //         headers: myHeaders,
  //         body: raw,
  //         redirect: "follow",
  //     };

  //     callRequest("notification/send", requestOptions);
  // });

  useEffectOnce(() => search());
  console.log("Son1",companyList); 
  return (
     
          <div className='p-16 bg-gray-50 w-full overflow-auto col-span-1 h-full'>
              <p className='text-3xl font-bold'>Danh sách giao dịch</p>
              <div className='flex gap-2 items-center mt-4'>
                  {/* <Input
                      onChangeValue={setName}
                      field=''
                      placeHolder={"Search by company name"}
                      className='w-96'
                      inputClassName='h-12'
                      type='text'></Input>
                  <button
                      className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                      onClick={() => search()}>
                      Search
                  </button> */}
                  {/* <button
                      className='rounded-md px-6 text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-12'
                      onClick={() => send()}>
                      Send
                  </button> */}
              </div>
              {/* <SearchCriterias
                  criteriaList={criteriaList.current}
                  setCriteriaList={setCriteriaList}
                  fields={columns}
                  searchCallback={search}
              /> */}
              <div className='rounded-md bg-white shadow-sm mt-4'>
                  <table className='h-full w-full table-fixed'>
                      <thead>
                          <tr>
                              {columns.map((column, index) => (
                                  <TableHeader
                                      key={column.value}
                                      index={index}
                                      data={column}
                                      sortProperty={sortProperty.current}
                                      setSortProperty={(sortProp) =>
                                          Promise.resolve()
                                              .then(() => setSortProperty(sortProp))
                                              .then(() => search())
                                      }
                                      isDescending={isDescending.current}
                                      setIsDescending={setIsDescending}
                                  />
                              ))}
                              {/* <th className='h-16 w-[6rem] px-4 text-black'></th>
                              <th className='h-16 w-[6rem] px-4 text-black'></th>
                              <th className='h-16 w-[6rem] px-4 text-black'></th>
                              <th className='h-16 w-[6rem] px-4 text-black'></th> */}
                          </tr>
                      </thead>
                      <tbody>
                          {companyList.map((company) => (
                              <CompanyRow
                                  data={company}
                                  key={company.id}
                                  fields={columns}
                              />
                          ))}
                      </tbody>
                  </table>
                  {Paging({
                      setPageSize,
                      search,
                      pageSizes,
                      currentPage: currentPage.current,
                      totalPages,
                      setCurrentPage,
                  })}
              </div>
          </div>

  );
};

const CompanyRow = ({ data, fields }) => {
  const [company, setCompany] = React.useState(data);
  const [openModal, setOpenModal] = React.useState(false);
  const [rejectMessage, setRejectMessage] = React.useState("");
  const [rejectMessageError, setRejectMessageError] = React.useState("");
  const ref = useClickOutside(setOpenModal);
 

  return (
      <tr className='border-t border-gray-200 hover:bg-gray-100'>
          {fields.map((field, index) => {
              console.log("field",field);
              if (field.availableValues) {
                  const x = company[field.value];
                  const element = field.availableValues[x]?.element;
                  if (element) {
                      return (
                          <td
                              key={index}
                              className={`h-[64px] overflow-hidden text-black ${
                                  index === 0 ? "px-8" : "px-4"
                              }`}>
                              {element}
                          </td>
                      );
                  }
              }
              else if (field.value === "amount") {
                // Access the nested 'user.username' property from the 'company' object
                const amount = company.amount || ""; // Use optional chaining to handle undefined properties

                return (
                    <td
                        key={index}
                        className={`h-[64px] overflow-hidden text-black ${index === 0 ? "px-8" : "px-4"
                            }`}
                    >
                        {strings.toMoney((amount))}
                    </td>
                );
            }
              return (
                  <td
                      key={index}
                      className={`h-[64px] overflow-hidden text-black ${
                          index === 0 ? "px-8" : "px-4"
                      }`}>
                      {company[field.value]}
                  </td>
              );
          })}

          {/* <td className='h-[64px] py-2'>
              <div className='px-2'>
                  <a
                      href={`/detail/${company.id}`}
                      className='rounded-md py-2 text-sm font-medium bg-indigo-500 !text-white hover:bg-indigo-600 block text-center w-full'>
                      View
                  </a>
              </div>
          </td> */}
          
      </tr>
  );
};

export default DatatableTransactionBusinessOwner;
