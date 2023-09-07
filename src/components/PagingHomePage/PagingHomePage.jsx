import React, { Component, useCallback, useEffect, useState } from "react";
import { CssBaseline, Paper } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { searcHomeApi } from "../../api/searchHome";

const PagingHomePage = ( {data,fromPrice, toPrice, types, amenityIds, locationIds,setlistAllHome}) => {
    const [page,setPage] = useState(1);
    console.log("types",types);

    const handleChange = (e,p) => {
        setPage(p);
        
    }

    const listHome = async () => {
        const res = await searcHomeApi(fromPrice, toPrice, types, amenityIds, locationIds,page);
        if (res && res.data && Array.isArray(res.data.items)) {
            const someNewData = res.data.items;
            setlistAllHome([...someNewData]);
          }
      };

      useEffect(() => {
        listHome();
      }, [page]);

    console.log("page",page);
    return (
        <>
                
                <Pagination
                 count={data.totalPages} 
                 onChange={handleChange}
                 />
            
        </>
    );
};

export default PagingHomePage;