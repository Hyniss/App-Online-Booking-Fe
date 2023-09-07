import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { categoryApi } from '../../api/categoryApi';
import { UserContext } from '../../context/userContext';
// const tabItems=[
//   {
//     image:"https://a0.muscache.com/pictures/c0a24c04-ce1f-490c-833f-987613930eca.jpg",
//     name:'National parks'
//   },{
//     image:'https://a0.muscache.com/pictures/c5a4f6fc-c92c-4ae8-87dd-57f1ff1b89a6.jpg',
//     name:'OMG!'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/732edad8-3ae0-49a8-a451-29a8010dcc0c.jpg',
//     name:'Cabins'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/677a041d-7264-4c45-bb72-52bff21eb6e8.jpg',
//     name:'Lakefront'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/6b639c8d-cf9b-41fb-91a0-91af9d7677cc.jpg',
//     name:'Golfing'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/eb7ba4c0-ea38-4cbb-9db6-bdcc8baad585.jpg',
//     name:'Private Rooms'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg',
//     name:'Amazing Pools'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/aaa02c2d-9f0d-4c41-878a-68c12ec6c6bd.jpg',
//     name:'Farms'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg',
//     name:'Amazing Views'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg',
//     name:'Beachfront'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/ee9e2a40-ffac-4db9-9080-b351efc3cfc4.jpg',
//     name:'Tropical'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/1b6a8b70-a3b6-48b5-88e1-2243d9172c06.jpg',
//     name:'Castles'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/6ad4bd95-f086-437d-97e3-14d12155ddfe.jpg',
//     name:'Countryside'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/35919456-df89-4024-ad50-5fcb7a472df9.jpg',
//     name:'Tiny Homes'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg',
//     name:'Luxe'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/33dd714a-7b4a-4654-aaf0-f58ea887a688.jpg',
//     name:'Historical homes'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/3726d94b-534a-42b8-bca0-a0304d912260.jpg',
//     name:'Trending'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/ca25c7f3-0d1f-432b-9efa-b9f5dc6d8770.jpg',
//     name:'Camping'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg',
//     name:'Earth homes'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/4d4a4eba-c7e4-43eb-9ce2-95e1d200d10e.jpg',
//     name:'Treehouses'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/8e507f16-4943-4be9-b707-59bd38d56309.jpg',
//     name:'Islands'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg',
//     name:'Mansions'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/ed8b9e47-609b-44c2-9768-33e6a22eccb2.jpg',
//     name:'Iconic cities'
//   },
//   {
//     image:'https://a0.muscache.com/pictures/5ed8f7c7-2e1f-43a8-9a39-4edfc81a3325.jpg',
//     name:'Bed and breakfasts'
//   }
//  ,{
//   image:'https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg',
//   name:'Arctic'
//  }

// ]

export default function CategoryTabList() {
  const [value, setValue] = React.useState(0);
  const [listAllCategory, setlistAllCategory] = React.useState([]);
  const {FilterGuest} = React.useContext(UserContext);
  const {filter} = React.useContext(UserContext);
  React.useEffect(() => {
    listCategory();
  }, [])

  React.useEffect(() => {
    FilterGuest(filter.id)
  }, [filter.id])
  const listCategory = async () => {
    const res = await categoryApi();
    if(res && res.data)
    {
      setlistAllCategory(res.data);
    }
  }
  const filterCategory = (id) => {
    FilterGuest(id)
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: {xs:"80%",sm:'80%',md:'84%',lg:'84%'},
        height:'100%',
        bgcolor: 'background.paper',
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        textColor="#000000"
        indicatorColor="secondary"
        scrollButtons
        aria-label="visible arrows tabs example"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
          padding:'10px',
          "& .MuiTabs-indicator": {
           
            backgroundColor: "black"
          },
        
        }}
      >
       { listAllCategory && listAllCategory.length > 0 &&
        listAllCategory.map((item, index) =>{
          return (
            <Tab onClick={()=>filterCategory(item.id)}  key={`category-${index}`}  label={<span style={{textTransform:'capitalize'}}>{item.name}</span>} icon={<img src={`${item.image}`} style={{color:'black' , width:'24px',height:'24px' }}/>}  sx={{fontSize:'12px'}}/>
          )
        })
       }
       

           
    
      
      </Tabs>
    </Box>
  );
}
