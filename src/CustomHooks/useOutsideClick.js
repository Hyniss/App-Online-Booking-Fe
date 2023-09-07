import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { disableOuterClick } from "../Redux/features/searchWidgetSlice";
//!! first way using custome hook


const useOutsideClick = (ref, callback) => {
    const dispatch= useDispatch()
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
    // console.log('current is different')
   dispatch(disableOuterClick())
     callback();
   
    }
    else {
        // console.log('current is same')
        // disable outer click effect for the first time 
       callback()
        dispatch(disableOuterClick())
    }
    

  };

  useEffect(() => {
     document.addEventListener("click", handleClick);
    return () => {
       
      document.removeEventListener("click", handleClick);
     
    };
  },[]);
};

export default useOutsideClick;

//!! second way using code snippet 
//! outer click check start
// const wrapperRef = useRef(false);

  // // below is the same as componentDidMount and componentDidUnmount
  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, false);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, false);
  //   };
  // }, [wrapperRef]);

  // const handleClickOutside = event => {
  //   if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //     console.log('outer click run')
  //     dispatch(setOuterClick())
   
  //   }

  // };

  //! outer click check end