import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
// import Swiper core and required modules
import { Navigation, Pagination } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { getHomeId } from "../../Redux/features/searchWidgetSlice";
import { searcHomeApi } from "../../api/searchHome";
import { UserContext } from "../../context/userContext";
import PagingHomePage from "../PagingHomePage/PagingHomePage";

export default function DisplayCategoryList() {
    // const {user} = useContext(UserContext);
    // console.log("Logid",user.id);
    const dispatch = useDispatch();
    const [isFevorate, setIsFevorate] = useState([]);
    const [isHovered, setIsHovered] = useState({
        index: null,
        isHovered: false,
    });

    const [fromPrice, setfromPrice] = useState("");
    const [toPrice, settoPrice] = useState("");
    const [types, setTypes] = useState(["HOUSE", "APARTMENT", "GUEST_HOUSE", "HOTEL"]);
    console.log("typesH", types);
    const [listAllHome, setlistAllHome] = useState([]);
    const [dataPaging, setdataPaging] = useState("");
    const [amenityIds, setAmenityIds] = useState([]);
    const [locationIds, setlocationIds] = useState([]);
    const [checkArray, setcheckArray] = useState([]);
    const navigate = useNavigate();
    const { filter, modal } = useContext(UserContext);

    const handleViewDetail = (id) => {
        dispatch(getHomeId(id));
        navigate(`/${id}`);
    };

    //checkArray sẽ thay bằng locationIds vì nó sử dụng đc còn loca thì không :(
    const listHome = useCallback(async () => {
        const res = await searcHomeApi(
            fromPrice,
            toPrice,
            types,
            amenityIds,
            locationIds
        );
        if (res && res.data) {
            setlistAllHome(res.data.items);
            setdataPaging(res.data);
        }
    }, [fromPrice, toPrice, types, amenityIds, locationIds]);

    useEffect(() => {
        console.log("favorite", modal);
        if (filter.id !== "") {
            setlocationIds([filter.id]);
        }
        if (modal.min !== "") {
            setfromPrice(modal.min);
        }
        if (modal.max !== "") {
            settoPrice(modal.max);
        }
        setTypes(modal.types);
        setAmenityIds(modal.amenityIds);
    }, [filter, modal]);

    useEffect(() => {
        listHome();
    }, [fromPrice, toPrice, types, amenityIds, locationIds, listHome]);
    // const DisplayItems = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12];
    // console.log("fevorate", isFevorate);
    const fevorateHandler = (index) => {
        let isExist = isFevorate.includes(index);
        if (isExist) {
            const remaingFevorate = isFevorate.filter((Index) => Index !== index);
            setIsFevorate(remaingFevorate);
            return;
        }
        setIsFevorate([...isFevorate, index]);
    };
    return (
        <>
            <Box
                container
                spacing={1}
                sx={{
                    width: "95%",
                    height: "auto",
                    margin: "auto",
                    marginTop: "100px",
                    padding: "10px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gridGap: "1rem ",
                }}>
                {listAllHome &&
                    listAllHome.length > 0 &&
                    listAllHome.map((item, index) => {
                        return (
                            <Box
                                onMouseEnter={() =>
                                    setIsHovered({ index, isHovered: true })
                                }
                                onMouseLeave={() =>
                                    setIsHovered({ index, isHovered: false })
                                }
                                onClick={() => handleViewDetail(item.id)}
                                mb={2}
                                key={index}>
                                <Box
                                    sx={{
                                        borderRadius: "9px",
                                        position: "relative",
                                        zIndex: "1",
                                    }}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "250px",
                                            borderRadius: "9px",
                                            position: "relative",
                                        }}>
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            spaceBetween={50}
                                            slidesPerView={1}
                                            navigation={
                                                isHovered.index === index &&
                                                isHovered.isHovered
                                                    ? true
                                                    : false
                                            }
                                            pagination={{ clickable: true }}
                                            onSwiper={(swiper) => {}}
                                            onSlideChange={() => {}}
                                            style={{
                                                "--swiper-navigation-color": "#FFF",
                                                "--swiper-pagination-color": "#FFF",
                                                "--swiper-navigation-size": "25px",
                                            }}>
                                            {item.thumbnails.map((image) => {
                                                return (
                                                    <SwiperSlide>
                                                        <Avatar
                                                            src={`${image}`}
                                                            sx={{
                                                                width: "100%",
                                                                height: "250px",
                                                            }}
                                                            variant='rounded'
                                                        />
                                                    </SwiperSlide>
                                                );
                                            })}
                                        </Swiper>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='24px'
                                            height='24px'
                                            fill={
                                                isFevorate.includes(index)
                                                    ? "red"
                                                    : "rgba(0, 0, 0, 0.5)"
                                            }
                                            onClick={() => {
                                                fevorateHandler(index);
                                            }}
                                            class='bi bi-heart-fill'
                                            viewBox='0 0 32 32'
                                            style={{
                                                position: "absolute",
                                                right: "5%",
                                                top: "5%",
                                                zIndex: "2",
                                                cursor: "pointer",
                                                display: "block",
                                                stroke: "white",
                                                strokeWidth: 2,
                                                overflow: "visible",
                                            }}>
                                            <path d='m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z'></path>
                                        </svg>
                                    </Box>

                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            fontFamily: "sans-serif",
                                            marginBottom: "-2px",
                                        }}>
                                        {item.name}
                                    </Typography>
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontSize: "14px",
                                            color: "gray",
                                            marginBottom: "-2px",
                                        }}>
                                        {/* {item.shortDescription} */}
                                    </Typography>
                                    <Typography
                                        variant='h6'
                                        sx={{ fontSize: "14px", color: "gray" }}>
                                        {/* {item.id} */}
                                    </Typography>
                                    <Typography>
                                        <span style={{ fontWeight: "bold" }}>
                                            {item.minPrice.toLocaleString("vi-VN")} VNĐ
                                        </span>{" "}
                                        /night
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
            </Box>
            <PagingHomePage
                sx={{
                    width: { xs: '100%', sm: '100%', md: '100%', lg: '85%' },
                    height: 'auto',
                    margin:{ xs: '30px 0', sm: '30px 0', md: '30px 0', lg: '30px 0' },
                    top: '50%',
                    // boxShadow: 'none',
                }}
                data={dataPaging}
                fromPrice={fromPrice}
                toPrice={toPrice}
                types={types}
                amenityIds={amenityIds}
                locationIds={locationIds}
                setlistAllHome={setlistAllHome}></PagingHomePage>
        </>
    );
}
