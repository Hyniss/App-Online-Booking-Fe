import React, { useState } from "react";


const UserContext = React.createContext({status:'',auth: false});


const UserProvider = ({ children }) => {
    // User is the name of the "data" that gets stored in context
    const[users,setUsers] = React.useState({status:'',auth: false});
    // Login updates the user data with a name parameter

  
    // Logout updates the user data to default
    const changeStatus = (status) => {
      setUsers((users) => ({
        status: status,
        auth: true,
      }));
      localStorage.setItem("status",status);
    };
  
    return (
      <UserContext.Provider value={{users,changeStatus }}>
        {children}
      </UserContext.Provider>
    );
  }
  
  export { UserProvider, UserContext}