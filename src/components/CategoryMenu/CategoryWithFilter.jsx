import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import CategoryTabList from './CategoryTabList'
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterModal from '../Filter/FilterModal';


export default function CategoryWithFilter() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  return (
    <>
    <Paper sx={{width:{xs:'100%', sm:'100%',md:"100%",lg:'100%'} , height:'90px', display:'flex',justifyContent:'space-evenly', alignContent:'center' , alignItems:'center',paddingTop:'10px'  , gap:'10px' ,position:'sticky' , top:'80px' , zIndex:'10' , flexWrap:'nowrap'}}>
      <CategoryTabList/>

      <Paper sx={{width:'7%' , height:'55%' , borderRadius:'9px',marginTop:'5px', marginRight:'35px' , display:'flex',justifyContent:'space-evenly',alignContent:'center',alignItems:'center' , cursor:'pointer'}} onClick={()=>{
         setOpen(true)
      }}>
           <FilterListIcon sx={{fontSize:'18px',color:'black'}}/> <Typography sx={{fontSize:'14px',fontWeight:'light'}}>Filters</Typography>
      </Paper>
    </Paper>
    <FilterModal open={open} handleClose={handleClose}/>
    </>
  )
}
