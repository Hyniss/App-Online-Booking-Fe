import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import moment from "moment/moment";
import React from "react";
import {
    useCallbackState,
    useEffectOnce,
    useHover,
    useInfiniteScroll,
    useQueryParameters,
    useVisible,
} from "../../CustomHooks/hooks";
import { strings } from "../../utils/strings";
import { daysBetween } from "../../utils/times";
import { SearchCriterias } from "../AdminComponents/Criterias";
import BaseLayout from "../BaseLayout";
import { Spinner } from "../base/Animations";
import { ApiButton } from "../base/Buttons";
import { GeoMap, searchLocation } from "../base/GeoMap";
import { Photo } from "../base/Photo";
import { RefDecorator } from "../base/RefDecorator";
import { XText } from "../base/Texts";
import { XDatePicker } from "../base/XDatePicker";
import { XSlider, Xtheme } from "../base/XSlider";
import { NumberInputWithSteps, UnitInput } from "../base/input";
import { callRequest } from "./../../utils/requests";
import { Modal } from "./../base/Modal";

export const HomePage = () => {
    const homeTypes = [
        { icon: <CottageOutlinedIcon />, value: "HOUSE", name: "Nhà ở" },
        { icon: <ApartmentOutlinedIcon />, value: "APARTMENT", name: "Căn hộ" },
        { icon: <HomeWorkOutlinedIcon />, value: "HOTEL", name: "Khách sạn" },
    ];
    const [openFilterModal, setOpenFilterModal] = React.useState(false);
    const [showMoreAmenities, setShowMoreAmenities] = React.useState(false);

    const marks = [
        {
            value: 0,
            label: strings.toMoney(0),
        },
        {
            value: 33,
            label: strings.toMoney(10_000_000),
        },
        {
            value: 100,
            label: strings.toMoney(100_000_000),
        },
    ];

    const round = (value, nearestTenth) => {
        return Math.ceil(value / nearestTenth) * nearestTenth;
    };

    const [homestaysRef, setHomestays] = useCallbackState([]);
    const [amenities, setAmenities] = React.useState([]);
    const [properties, setProperties] = React.useState([]);
    const [priceValue, setPriceValue] = React.useState([0, 100]);
    const [homestayQueryParams, setHomestayQueryParams] = React.useState(null);

    const queryParams = useQueryParameters();

    function extractDateFromQuery(key) {
        const value = queryParams[key];
        if (strings.isBlank(value)) {
            return null;
        }
        try {
            return moment(value, "DD/MM/YYYY").toDate();
        } catch (error) {
            return null;
        }
    }

    const defaultValue = {
        views: [],
        types: homeTypes,
        amenities: [],
        fromPrice: 0,
        toPrice: 100_000_000,
        fromDate: null,
        toDate: null,
        totalRooms: 0,
        lng: null,
        lat: null,
        range: 10,
    };

    const [searchingViewsRef, setSearchingViews] = useCallbackState(
        strings.toList(queryParams.views) ?? defaultValue.views
    );
    const [searchingHomeTypesRef, setSearchingHomeTypes] = useCallbackState(
        extractTypesFromQuery()
    );
    const [searchingAmenitiesRef, setSearchingAmenities] = useCallbackState(
        strings.toList(queryParams.amenities) ?? defaultValue.amenities
    );
    const [criteriaListRef, setCriteriaList] = useCallbackState([]);
    const [checkInDate, setCheckInDate] = React.useState(
        extractDateFromQuery("fromDate") ?? defaultValue.fromDate
    );
    const [checkOutDate, setCheckOutDate] = React.useState(
        extractDateFromQuery("toDate") ?? defaultValue.toDate
    );
    const [searchTotalPrice, setSearchTotalPrice] = React.useState(
        queryParams.searchTotalPrice === "true"
    );
    const [totalRooms, setTotalRooms] = React.useState(
        strings.toNumber(queryParams.totalRooms) || defaultValue.totalRooms
    );
    const [priceRange, setPriceRange] = React.useState([
        strings.toNumber(queryParams.fromPrice) || defaultValue.fromPrice,
        strings.toNumber(queryParams.toPrice) || defaultValue.toPrice,
    ]);
    const [searchingLongLat, setSearchingLongLat] = React.useState(
        strings.isNumeric(queryParams.lat) && strings.isNumeric(queryParams.lng)
            ? [strings.toNumber(queryParams.lng), strings.toNumber(queryParams.lat)]
            : null
    );
    const [currentPageRef, setCurrentPage] = useCallbackState(1);
    const [lastPageRef, setLastPage] = useCallbackState(-1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [totalHomesFound, setTotalHomesFound] = React.useState(1);
    const [rangeRef, setRange] = useCallbackState(
        queryParams.range || defaultValue.range
    );

    const [isSearchingRef, setIsSearching] = useCallbackState(false);

    const updateUrl = () => {
        const params = {
            views: searchingViewsRef.current,
            types: searchingHomeTypesRef.current.map((x) => x.value),
            amenities: searchingAmenitiesRef.current,
            fromPrice: priceRange[0],
            toPrice: priceRange[1],
            fromDate:
                checkInDate != null ? moment(checkInDate).format("DD/MM/YYYY") : null,
            toDate:
                checkOutDate != null ? moment(checkOutDate).format("DD/MM/YYYY") : null,
            totalRooms: totalRooms,
            lng: searchingLongLat?.length === 2 ? searchingLongLat[0] : null,
            lat: searchingLongLat?.length === 2 ? searchingLongLat[1] : null,
            searchTotalPrice,
            statement: queryParams.statement,
            locationName: searchingLocationRef.current,
            range: rangeRef.current,
        };

        window.history.replaceState(null, "Home Page", strings.toQuery(params));

        const homestayParams = {
            fromDate:
                checkInDate != null ? moment(checkInDate).format("DD/MM/YYYY") : null,
            toDate:
                checkOutDate != null ? moment(checkOutDate).format("DD/MM/YYYY") : null,
            statement: queryParams.statement,
        };
        setHomestayQueryParams(strings.toQuery(homestayParams));
    };

    const search = async () => {
        if (isSearchingRef.current) {
            return;
        }

        if (lastPageRef.current >= currentPageRef.current) {
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            viewIds: searchingViewsRef.current,
            amenityIds: searchingAmenitiesRef.current,
            types: searchingHomeTypesRef.current.map((x) => x.value),
            criteriaList: criteriaListRef.current,
            searchTotalPrice,
            priceRange: {
                start: priceRange[0],
                end: priceRange[1],
            },
            dates: {
                start:
                    checkInDate != null
                        ? moment(checkInDate).startOf("day").format("HH:mm DD/MM/YYYY")
                        : null,
                end:
                    checkOutDate != null
                        ? moment(checkOutDate).startOf("day").format("HH:mm DD/MM/YYYY")
                        : null,
            },
            totalRooms: totalRooms,
            coordinate: {
                lat: searchingLongLat?.length === 2 ? searchingLongLat[0] : null,
                lng: searchingLongLat?.length === 2 ? searchingLongLat[1] : null,
                range: rangeRef.current / 1.60934,
            },
            size: 12,
            page: currentPageRef.current,
        });

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        setIsSearching(true);
        callRequest("accommodation/search", requestOptions)
            .then((response) => {
                if (currentPageRef.current === 1) {
                    setHomestays(response.data.items || []);
                } else {
                    const existingIds = homestaysRef.current.map((x) => x.id);
                    const newHomes = response.data.items.filter(
                        (home) => !existingIds.includes(home.id)
                    );
                    setHomestays([...homestaysRef.current, ...newHomes]);
                }
                updateUrl();
                setTotalHomesFound(response.data.totalItems);
                setTotalPages(response.data.totalPages);
                setLastPage(response.data.page || 1);
            })
            .catch((error) => {
                console.log("error", error);
            })
            .finally(() => {
                setIsSearching(false);
            });
    };

    useEffectOnce(() => {
        const getAmenitiesToSearch = async () => {
            var requestOptions = {
                method: "GET",
                redirect: "follow",
            };

            callRequest("accommodation/search/filter-items", requestOptions)
                .then((response) => {
                    setAmenities(response.data.amenities || []);
                    const props = response.data.details.map((prop) => {
                        return {
                            value: prop.id,
                            text: prop.value,
                            criteriaList: ["EQUALS_NUMBER", "LESS_THAN", "GREATER_THAN"],
                        };
                    });
                    setProperties(props);
                })
                .catch((error) => console.log("error", error));
        };

        // search();
        getAmenitiesToSearch();
    });

    function extractTypesFromQuery() {
        if (!queryParams.types) {
            return defaultValue.types;
        }
        const typeValues = strings.toList(queryParams.types);
        return homeTypes.filter((type) => typeValues.includes(type.value));
    }

    function isChoosingType(type) {
        return searchingHomeTypesRef.current.some((type_) => type.value === type_.value);
    }

    const handleCheckInDate = (date) => {
        setCheckInDate(date);
        setCheckOutDate(null);
    };

    const handleCheckOutDate = (date) => {
        setCheckOutDate(date);
    };

    const [locationName, setLocationName] = React.useState();

    const searchLocationName = (long, lat) => {
        searchLocation({ long, lat }).then((result) => {
            try {
                const place = result.features.filter((feature) =>
                    feature.place_type.includes("place")
                )[0];
                if (place) {
                    setLocationName(place.place_name);
                    return;
                }
                setLocationName(result.features[0].place_name);
            } catch (error) {}
        });
    };

    const [, lastElementRef] = useInfiniteScroll({
        page: currentPageRef.current,
        setPage: setCurrentPage,
        totalPages,
        action: search,
    });

    const [focusZoneRef, setFocusZone] = useCallbackState({
        rangeInKm: rangeRef.current,
    });

    const [searchingLocationRef, setSearchingLocation] = useCallbackState(
        queryParams.locationName
    );

    useEffectOnce(() => {
        if (searchingLongLat?.length === 2) {
            searchLocationName(searchingLongLat[0], searchingLongLat[1]);
        }
    });

    return (
        <BaseLayout>
            <div className='flex items-center px-4 sm:px-12 lg:px-24 border-b border-gray-200 gap-4'>
                <ViewCarousel
                    isSearching={isSearchingRef.current}
                    setSearchingViews={(views) => {
                        Promise.resolve()
                            .then(() => setSearchingViews(views))
                            .then(() => setCurrentPage(1))
                            .then(() => setLastPage(-1))
                            .then(() => setHomestays([]))
                            .then(() => search());
                    }}
                    searchingViews={searchingViewsRef.current}
                />
                <div
                    onClick={() => setOpenFilterModal(true)}
                    className='btn__primary px-4 py-2 flex items-center cursor-pointer gap-2'>
                    <FilterListRoundedIcon />
                    <h5 className='text-sm'>Lọc</h5>
                </div>
                {openFilterModal && (
                    <Modal
                        setOpenModal={setOpenFilterModal}
                        className='w-full sm:w-[80%] mx-4 max-w-[960px] '>
                        <div className='px-2 sm:px-6 mt-2 overflow-x-hidden max-h-[75vh]'>
                            <div className='pt-4 w-full'>
                                <h2 className='text-lg font-bold mb-4'>Loại nhà</h2>
                                <div className='gap-4 items-center w-full grid grid-cols-1 lg:grid-cols-3'>
                                    {homeTypes.map((type) => (
                                        <div
                                            key={type.value}
                                            className={`p-4 w-full border  rounded-lg cursor-pointer ${
                                                isChoosingType(type)
                                                    ? "border-primary-500 ring-2 ring-primary-200"
                                                    : "border-gray-200"
                                            }`}
                                            onClick={() => {
                                                if (isChoosingType(type)) {
                                                    setSearchingHomeTypes(
                                                        searchingHomeTypesRef.current.filter(
                                                            (type_) =>
                                                                type.value !== type_.value
                                                        )
                                                    );
                                                } else {
                                                    setSearchingHomeTypes([
                                                        ...searchingHomeTypesRef.current,
                                                        type,
                                                    ]);
                                                }
                                            }}>
                                            <div className='mb-8'>{type.icon}</div>
                                            <h2 className='font-bold'>{type.name}</h2>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='mt-8 pt-4 border-t border-gray-200'>
                                {searchingLongLat && locationName && (
                                    <div className='flex items-center gap-2'>
                                        <label className='block'>
                                            Nơi bạn đang tìm kiếm là{" "}
                                            <span className='font-bold'>
                                                {locationName}
                                            </span>
                                        </label>
                                        <label htmlFor='' className='border-l pl-2'>
                                            Phạm vi tìm kiếm
                                        </label>
                                        <UnitInput
                                            value={rangeRef.current}
                                            onChangeValue={(value) => {
                                                setRange(value);
                                                setFocusZone({
                                                    ...focusZoneRef.current,
                                                    rangeInKm: value,
                                                });
                                            }}
                                            min={1}
                                            max={50}
                                            label='Km'
                                        />
                                        <button
                                            className='btn__primary h-9 px-3'
                                            onClick={() => {
                                                searchLocationName(null);
                                                setSearchingLongLat(null);
                                            }}>
                                            Hoàn tác
                                        </button>
                                    </div>
                                )}
                                <GeoMap
                                    className='w-full h-[24rem] mt-4 rounded-md overflow-hidden'
                                    searchingLocationDefaultValue={
                                        searchingLocationRef.current
                                    }
                                    onClearSearching={() => {
                                        searchLocationName(null);
                                        setSearchingLocation(null);
                                        setSearchingLongLat(null);
                                    }}
                                    onSelectSearchedLocation={(long, lat, location) => {
                                        setSearchingLocation(location);
                                        setSearchingLongLat([long, lat]);
                                        searchLocationName(long, lat);
                                        setFocusZone({
                                            longitude: long,
                                            latitude: lat,
                                            rangeInKm: focusZoneRef.current.rangeInKm,
                                        });
                                    }}
                                    searchable={true}
                                    focusLocation={{
                                        ...focusZoneRef.current,
                                        rangeInKm: searchingLongLat
                                            ? focusZoneRef.current.rangeInKm
                                            : 0,
                                    }}
                                />
                            </div>
                            <div className='mt-8 pt-4 border-t border-gray-200'>
                                <h2 className='text-lg font-bold mb-4'>
                                    Chi tiết phòng ở
                                </h2>
                                <div className='flex items-center gap-2 mt-4 flex-wrap w-full'>
                                    <div className=''>
                                        <label className='block mb-1 font-bold'>
                                            Check-in
                                        </label>
                                        <XDatePicker
                                            value={checkInDate}
                                            minDate={moment().add(1, "days").toDate()}
                                            onChangeValue={handleCheckInDate}
                                            className='h-[3rem] w-48 rounded-md border border-gray-300 cursor-pointer'
                                        />
                                    </div>
                                    <div className=''>
                                        <label className='block mb-1 font-bold'>
                                            Check-out
                                        </label>
                                        <XDatePicker
                                            value={checkOutDate}
                                            minDate={
                                                checkInDate === null
                                                    ? null
                                                    : moment(checkInDate)
                                                          .add(1, "days")
                                                          .toDate()
                                            }
                                            onChangeValue={handleCheckOutDate}
                                            className='h-[3rem] w-48 rounded-md border border-gray-300 cursor-pointer'
                                        />
                                    </div>
                                    {checkInDate && checkOutDate && (
                                        <div className=''>
                                            <label className='block mb-1 font-bold'>
                                                Tổng số phòng
                                            </label>
                                            <NumberInputWithSteps
                                                inputClassName='!h-[3rem] w-[5rem]'
                                                min={0}
                                                max={100}
                                                text={totalRooms}
                                                onChangeValue={setTotalRooms}
                                            />
                                        </div>
                                    )}
                                </div>
                                {checkInDate && checkOutDate && (
                                    <div className='mt-4'>
                                        <div className='flex items-center gap-2 mb-4 flex-wrap'>
                                            <input
                                                name='xaxsa'
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSearchTotalPrice(false);
                                                    }
                                                }}
                                                defaultChecked={!searchTotalPrice}
                                                type='radio'
                                                id='searchOne'
                                                className=''
                                            />
                                            <label
                                                htmlFor='searchOne'
                                                className='cursor-pointer !text-base'>
                                                Tìm theo giá tiền của
                                                <span className='font-bold'> 1 đêm</span>
                                            </label>
                                            {daysBetween(checkInDate, checkOutDate) >
                                                1 && (
                                                <div className='mr-4 flex items-center gap-2'>
                                                    <input
                                                        name='xaxsa'
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSearchTotalPrice(true);
                                                            }
                                                        }}
                                                        defaultChecked={searchTotalPrice}
                                                        type='radio'
                                                        id='searchall'
                                                        className=''
                                                    />
                                                    <label
                                                        htmlFor='searchall'
                                                        className='cursor-pointer !text-base'>
                                                        Tìm theo giá tiền của
                                                        <span className='font-bold'>
                                                            {" "}
                                                            {daysBetween(
                                                                checkInDate,
                                                                checkOutDate
                                                            ) === 1
                                                                ? "1 đêm"
                                                                : daysBetween(
                                                                      checkInDate,
                                                                      checkOutDate
                                                                  ) +
                                                                  " " +
                                                                  "đêm"}
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                        <h4 className=''>
                                            {"Từ "}{" "}
                                            <span className='font-bold text-primary-500'>
                                                {strings.toMoney(priceRange[0])}
                                            </span>
                                            {" Đến "}{" "}
                                            <span className='font-bold text-primary-500'>
                                                {strings.toMoney(priceRange[1])}
                                            </span>
                                        </h4>
                                        <XSlider
                                            theme={Xtheme}
                                            value={priceValue}
                                            onChange={(_event, newValue) => {
                                                setPriceValue(newValue);
                                                const valueRules = [
                                                    {
                                                        minPercentage: 0,
                                                        maxPercentage: 33,
                                                        maxValue: 10_000_000,
                                                        minValue: 0,
                                                    },
                                                    {
                                                        minPercentage: 33,
                                                        maxPercentage: 100,
                                                        maxValue: 100_000_000,
                                                        minValue: 10_000_000,
                                                    },
                                                ];
                                                const priceOf = (value) => {
                                                    const index = valueRules.findIndex(
                                                        (v) =>
                                                            value - v.maxPercentage <= 0
                                                    );
                                                    const mark = valueRules[index];
                                                    const pricePerPercentage =
                                                        (mark.maxValue - mark.minValue) /
                                                        (mark.maxPercentage -
                                                            mark.minPercentage);
                                                    const price =
                                                        mark.minValue +
                                                        (value - mark.minPercentage) *
                                                            pricePerPercentage;
                                                    return round(price, 100_000);
                                                };
                                                setPriceRange([
                                                    priceOf(newValue[0]),
                                                    priceOf(newValue[1]),
                                                ]);
                                            }}
                                            step={0.00000001}
                                            disableSwap
                                            defaultValue={20}
                                            marks={marks}
                                        />
                                    </div>
                                )}
                                {(properties || []).length > 0 && (
                                    <div className='z-10 mt-2'>
                                        <SearchCriterias
                                            criteriaList={criteriaListRef.current}
                                            setCriteriaList={setCriteriaList}
                                            fields={properties}
                                            buttonClassName='bg-primary-500 hover:bg-primary-600 h-[2.5rem] mt-0'
                                            criteriaClassName='h-[2.5rem]'
                                        />
                                    </div>
                                )}
                            </div>
                            <div className='mt-8 pt-4 border-t border-gray-200'>
                                <h2 className='text-lg font-bold mb-4'>Tiện ích</h2>
                                <div className='gap-4 items-center w-full grid grid-cols-2'>
                                    {amenities
                                        .slice(
                                            0,
                                            !showMoreAmenities ? 10 : amenities.length
                                        )
                                        .map((amenity) => {
                                            const id = strings.generateId();
                                            return (
                                                <div
                                                    key={amenity.id}
                                                    className='flex gap-2 items-center '>
                                                    <input
                                                        id={id}
                                                        type='checkbox'
                                                        defaultChecked={searchingAmenitiesRef.current.some(
                                                            (item) => item === amenity.id
                                                        )}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSearchingAmenities(
                                                                    (list) => [
                                                                        ...list,
                                                                        amenity.id,
                                                                    ]
                                                                );
                                                            } else {
                                                                setSearchingAmenities(
                                                                    (list) =>
                                                                        list.filter(
                                                                            (item) =>
                                                                                item !==
                                                                                amenity.id
                                                                        )
                                                                );
                                                            }
                                                        }}
                                                        className='rounded-md !border-1 border-gray-400 !text-primary-400 ring-primary-300 cursor-pointer'
                                                    />
                                                    <label
                                                        className='cursor-pointer'
                                                        htmlFor={id}>
                                                        {amenity.name}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                </div>
                                {amenities.length > 10 && (
                                    <button
                                        onClick={() =>
                                            setShowMoreAmenities(!showMoreAmenities)
                                        }
                                        className='btn__primary px-4 py-2 mt-4 mb-2'>
                                        {showMoreAmenities ? "Ẩn" : "Xem thêm"}
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <button
                                onClick={() =>
                                    Promise.resolve()
                                        .then(() => {
                                            setSearchingViews(defaultValue.views);
                                            setSearchingHomeTypes(defaultValue.types);
                                            setSearchingAmenities(defaultValue.amenities);
                                            setCriteriaList([]);
                                            setCheckInDate(defaultValue.fromDate);
                                            setCheckOutDate(defaultValue.toDate);
                                            setTotalRooms(defaultValue.totalRooms);
                                            setPriceRange([
                                                defaultValue.fromDate,
                                                defaultValue.toDate,
                                            ]);
                                            setSearchingLongLat(null);
                                            setCurrentPage(1);
                                            setLastPage(-1);
                                            setHomestays([]);
                                        })
                                        .then(() => search())
                                }
                                className='rounded-md hover:bg-gray-200 px-4 py-2 mt-4 ml-auto text-black text-sm'>
                                Xoá lựa chọn
                            </button>
                            <ApiButton
                                loading={isSearchingRef.current}
                                onClick={() =>
                                    Promise.resolve()
                                        .then(() => {
                                            setCurrentPage(1);
                                            setLastPage(-1);
                                            setHomestays([]);
                                        })
                                        .then(() => search())
                                }>
                                <p className=''>Tìm kiếm</p>
                            </ApiButton>
                        </div>
                    </Modal>
                )}
            </div>
            <HomestayArea
                loading={isSearchingRef.current}
                homestays={homestaysRef.current}
                homestayQueryParams={homestayQueryParams}
                lastElementRef={lastElementRef}
                totalElements={totalHomesFound}
                locationName={locationName}
                focusZoneRef={focusZoneRef}
                searchingLongLat={searchingLongLat}
            />
        </BaseLayout>
    );
};

const HomestayCard = ({ homestay, queryParams, innerRef, focusHomestayOnMap }) => {
    const [showingThumbnailIndex, setShowingThumbnailIndex] = React.useState(0);
    const [hoverProp, isHoverThumbnail] = useHover();
    const thumbnails = homestay.thumbnails || [];
    const totalShow = thumbnails.length > 15 ? 15 : thumbnails.length;
    return (
        <div
            className='rounded-md overflow-hidden border border-gray-200 flex flex-col'
            ref={innerRef}>
            <div className='relative ' {...hoverProp}>
                <a href={`/${homestay.id}${queryParams}`} className='w-full block'>
                    <Photo
                        src={thumbnails[showingThumbnailIndex]}
                        className='w-full h-64 object-cover'
                        alt={`Ảnh nhà ${showingThumbnailIndex + 1}`}
                    />
                </a>
                {isHoverThumbnail && (
                    <button
                        onClick={() =>
                            setShowingThumbnailIndex(
                                (index) => (index - 1 + totalShow) % totalShow
                            )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center`}>
                        <ChevronLeftRoundedIcon className='' />
                    </button>
                )}
                {isHoverThumbnail && (
                    <button
                        onClick={() =>
                            setShowingThumbnailIndex(
                                (index) => (index + 1 + totalShow) % totalShow
                            )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center`}>
                        <ChevronRightRoundedIcon className='' />
                    </button>
                )}
                <div className='absolute left-1/2 -translate-x-1/2 bottom-4 gap-1 flex'>
                    {thumbnails.slice(0, 15).map((thumnail, index) => (
                        <button
                            key={index}
                            onClick={() => setShowingThumbnailIndex(index)}
                            className={`w-2 h-2 rounded-full bg-white shadow-md ${
                                index === showingThumbnailIndex
                                    ? "bg-opacity-100"
                                    : "bg-opacity-50"
                            }`}></button>
                    ))}
                </div>
            </div>
            <div className='flex flex-col h-full'>
                <div className='p-4 '>
                    <a
                        className='text-md font-bold block hover:text-indigo-500'
                        href={`/${homestay.id}`}>
                        {homestay.name}
                    </a>
                    <XText className='text-sm' ellipsis={{ maxLine: 3 }}>
                        {homestay.shortDescription}
                    </XText>
                </div>
                <div className='p-4 border-t mt-auto h-fit'>
                    <div className='mb-2'>
                        <button
                            placeholder={"asdasdasdasd"}
                            onClick={() => {
                                focusHomestayOnMap(homestay);
                            }}
                            className='flex gap-2 items-center cursor-pointer px-3 py-2 bg-gray-200 hover:bg-gray-300  rounded-md  placeholder:italic placeholder:uppercase placeholder:text-gray-900'>
                            <MapOutlinedIcon />
                            <XText
                                ellipsis={{ maxLine: 1, canShowMore: false }}
                                className='text-black text-sm text-left break-all'>
                                {homestay.address}
                            </XText>
                        </button>
                        <div className='flex items-center ml-auto min-w-fit mt-2'>
                            {homestay.reviewRate ? (
                                <div className='flex items-center'>
                                    {homestay.reviewRate < 4.2 && (
                                        <StarBorderOutlinedIcon className='mt-[-2px] block h-[1rem] mr-1' />
                                    )}
                                    {4.2 <= homestay.reviewRate &&
                                        homestay.reviewRate <= 4.8 && (
                                            <StarHalfOutlinedIcon className='mt-[-2px] block h-[1rem] mr-1' />
                                        )}
                                    {4.8 < homestay.reviewRate && (
                                        <StarOutlinedIcon className='mt-[-2px] block h-[1rem] mr-1' />
                                    )}
                                    <h2 className='block'>{homestay.reviewRate}</h2>
                                </div>
                            ) : (
                                <div className='flex items-center'>
                                    <StarBorderRoundedIcon className='text-gray-500' />
                                    <h5 className=''>Chưa có đánh giá</h5>
                                </div>
                            )}
                            <h2 className='border-l ml-2 pl-2'>
                                {homestay.totalBookings ?? 0} đã đặt
                            </h2>
                        </div>
                    </div>
                    <h4 className='text-orange-500 rounded-md w-fit mr-auto'>{`${strings.toMoney(
                        homestay.minPrice
                    )} - ${strings.toMoney(homestay.maxPrice)} /Đêm`}</h4>
                </div>
            </div>
        </div>
    );
};

const ViewCarousel = ({ setSearchingViews, searchingViews, isSearching }) => {
    const [views, setViews] = React.useState([]);
    const [firstViewRef, isFirstViewVisible] = useVisible();
    const [lastViewRef, isLastViewVisible] = useVisible();
    const slideRef = React.useRef();

    useEffectOnce(() => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        callRequest("accommodation/category", requestOptions)
            .then((response) => {
                const views = response.data || [];
                setViews(views);
            })
            .catch((error) => console.log("error", error));
    });

    return (
        <div className='flex items-center w-full overflow-hidden'>
            <button
                onClick={() => {
                    const slide = slideRef.current;
                    slide.scrollTo({
                        left: slide.scrollLeft - 200,
                    });
                }}
                className={`px-2 rounded-md py-4 ${
                    isFirstViewVisible ? "text-gray-300" : "hover:bg-gray-200"
                }`}>
                <ChevronLeftRoundedIcon className='' />
            </button>
            <div
                className='grid grid-flow-col gap-4 select-none overflow-hidden'
                ref={slideRef}>
                {views.map((view, index) => (
                    <RefDecorator
                        key={index}
                        innerRef={
                            index === 0
                                ? firstViewRef
                                : index === views.length - 1
                                ? lastViewRef
                                : null
                        }>
                        <div
                            onClick={() => {
                                if (isSearching) {
                                    return;
                                }
                                if (searchingViews.includes(view.id)) {
                                    setSearchingViews(
                                        searchingViews.filter((v) => v !== view.id)
                                    );
                                } else {
                                    setSearchingViews([...searchingViews, view.id]);
                                }
                            }}
                            className={`flex flex-col justify-center items-center py-2 px-4 cursor-pointer h-full relative hover:bg-gray-100`}>
                            <img
                                src={view.image}
                                alt=''
                                className='w-4 h-4 sm:w-6 sm:h-6'
                            />
                            <h5 className='text-[0.625rem] sm:text-[0.75rem] text-center'>
                                {view.name}
                            </h5>
                            {searchingViews.includes(view.id) && (
                                <div className='absolute w-full h-[2px] bottom-0 left-0 bg-gray-500'></div>
                            )}
                        </div>
                    </RefDecorator>
                ))}
            </div>
            <button
                onClick={() => {
                    const slide = slideRef.current;
                    slide.scrollTo({
                        left: slide.scrollLeft + 200,
                    });
                }}
                className={`px-2 rounded-md py-4 ${
                    isLastViewVisible ? "text-gray-300" : "hover:bg-gray-200"
                }`}>
                <ChevronRightRoundedIcon className='' />
            </button>
        </div>
    );
};
const HomestayArea = ({
    homestays,
    totalElements,
    loading,
    homestayQueryParams,
    lastElementRef,
    locationName,
    focusZoneRef,
    searchingLongLat,
}) => {
    const [openMapModal, setOpenMapModal] = React.useState(false);
    const [focusOn, setFocusOn] = React.useState(homestays[0]);

    return (
        <div className='px-4 sm:px-12 lg:px-24 m-auto mb-24 overflow-hidden'>
            {homestays?.length > 0 && (
                <div className='flex justify-center mb-4 mt-6'>
                    <button
                        onClick={() => setOpenMapModal(true)}
                        className='flex gap-2 items-center cursor-pointer px-6 py-3 bg-gray-200 hover:bg-gray-300  rounded-md'>
                        <MapOutlinedIcon />
                        <h4 className=' text-black text-sm'>Xem trên bản đồ</h4>
                    </button>
                </div>
            )}
            {openMapModal && homestays?.length > 0 && (
                <Modal setOpenModal={setOpenMapModal} className='mx-4 w-full md:w-fit'>
                    <div className='p-2 mt-2 w-full md:w-[75vw] lg:w-[50vw]'>
                        <div className='rounded-md overflow-hidden'>
                            {strings.isNotBlank(locationName) && (
                                <label className='block mb-4'>
                                    Nơi bạn đang tìm kiếm là{" "}
                                    <span className='font-bold'>{locationName}</span>
                                </label>
                            )}
                            <GeoMap
                                location={getFocusLocation()}
                                focusLocation={{
                                    ...focusZoneRef.current,
                                    rangeInKm: searchingLongLat
                                        ? focusZoneRef.current.rangeInKm
                                        : 0,
                                }}
                                className='w-full max-h-[75vh] rounded-md'
                                markers={homestays.map((homestay) => ({
                                    longitude: homestay.longitude,
                                    latitude: homestay.latitude,
                                    element: (
                                        <HomestayMarker
                                            homestay={homestay}
                                            homestayQueryParams={homestayQueryParams}
                                        />
                                    ),
                                }))}
                            />
                        </div>
                    </div>
                </Modal>
            )}
            {homestays.length > 0 && (
                <div className='grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center'>
                    {(homestays || []).map((homestay, index) => {
                        if (index === homestays.length - 1) {
                            return (
                                <HomestayCard
                                    homestay={homestay}
                                    key={index}
                                    queryParams={homestayQueryParams}
                                    innerRef={lastElementRef}
                                    focusHomestayOnMap={() => {
                                        setOpenMapModal(true);
                                        setFocusOn(homestay);
                                    }}
                                    homestays={homestays}
                                />
                            );
                        }
                        return (
                            <HomestayCard
                                homestay={homestay}
                                key={index}
                                queryParams={homestayQueryParams}
                                homestays={homestays}
                                focusHomestayOnMap={() => {
                                    setOpenMapModal(true);
                                    setFocusOn(homestay);
                                }}
                            />
                        );
                    })}
                </div>
            )}
            {loading && (
                <div className='mt-8 flex items-center justify-center w-full'>
                    <Spinner className='w-8 h-8 text-gray-500' />
                </div>
            )}
        </div>
    );

    function getFocusLocation() {
        if (focusOn?.longitude && focusOn.latitude) {
            return {
                longitude: focusOn.longitude,
                latitude: focusOn.latitude,
            };
        }
        if (homestays.length > 0) {
            return {
                longitude: homestays[0].longitude,
                latitude: homestays[0].latitude,
            };
        }
        return null;
    }
};

const HomestayMarker = ({ homestay, homestayQueryParams }) => {
    const [markerProp, isHoverMarker] = useHover();
    const [detailProp, isHoverDetail] = useHover();
    return (
        <div className='relative'>
            <LocationOnIcon
                className='text-primary-500 scale-150 cursor-pointer z-0'
                {...markerProp}
            />
            {(isHoverMarker || isHoverDetail) && (
                <div
                    className='rounded-md bg-white p-1 absolute left-6 top-0'
                    {...detailProp}>
                    <HomestayOnMap
                        homestay={homestay}
                        queryParams={homestayQueryParams}
                    />
                </div>
            )}
        </div>
    );
};

const HomestayOnMap = ({ homestay, queryParams }) => {
    const [showingThumbnailIndex, setShowingThumbnailIndex] = React.useState(0);
    const [hoverProp, isHoverThumbnail] = useHover();
    const thumbnails = homestay.thumbnails || [];
    const totalShow = thumbnails.length > 15 ? 15 : thumbnails.length;
    return (
        <div className='rounded-md overflow-hidden w-64 z-[200]'>
            <div className='relative ' {...hoverProp}>
                <div className='w-full block'>
                    <Photo
                        src={thumbnails[showingThumbnailIndex]}
                        className='w-full h-24 object-cover rounded-md'
                    />
                </div>
                {isHoverThumbnail && (
                    <button
                        onClick={() =>
                            setShowingThumbnailIndex(
                                (index) => (index - 1 + totalShow) % totalShow
                            )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center`}>
                        <ChevronLeftRoundedIcon className='' />
                    </button>
                )}
                {isHoverThumbnail && (
                    <button
                        onClick={() =>
                            setShowingThumbnailIndex(
                                (index) => (index + 1 + totalShow) % totalShow
                            )
                        }
                        className={`absolute top-1/2 -translate-y-1/2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center`}>
                        <ChevronRightRoundedIcon className='' />
                    </button>
                )}
                <div className='absolute left-1/2 -translate-x-1/2 bottom-4 gap-1 flex'>
                    {thumbnails.slice(0, 15).map((thumnail, index) => (
                        <button
                            key={index}
                            onClick={() => setShowingThumbnailIndex(index)}
                            className={`w-2 h-2 rounded-full bg-white shadow-md ${
                                index === showingThumbnailIndex
                                    ? "bg-opacity-100"
                                    : "bg-opacity-50"
                            }`}></button>
                    ))}
                </div>
            </div>
            <div className='block ' href={`/${homestay.id}`}>
                <div className='p-2'>
                    <h3 className='text-md font-bold'>{homestay.name}</h3>
                    <h4 className='text-sm'>{homestay.address}</h4>
                    <h4 className='text-[0.75rem] text-orange-500 rounded-md w-fit mb-1 mr-auto'>{`${strings.toMoney(
                        homestay.minPrice
                    )} - ${strings.toMoney(homestay.maxPrice)} /Đêm`}</h4>
                    {homestay.reviewRate ? (
                        <div className='flex gap-1'>
                            {homestay.reviewRate < 4.2 && (
                                <StarBorderOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            {4.2 <= homestay.reviewRate && homestay.reviewRate <= 4.8 && (
                                <StarHalfOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            {4.8 < homestay.reviewRate && (
                                <StarOutlinedIcon className='block h-[1rem] mr-1' />
                            )}
                            <h2 className='block mt-1'>{homestay.reviewRate}</h2>
                        </div>
                    ) : (
                        <div className='flex gap-1 items-center'>
                            <StarBorderRoundedIcon className='text-gray-500' />
                            <h5 className=''>Chưa có đánh giá</h5>
                        </div>
                    )}
                </div>
                <a
                    href={`/${homestay.id}${queryParams}`}
                    className='block btn__primary px-2 py-1 mb-1 mx-1 !text-white w-fit'>
                    Chi tiết
                </a>
            </div>
        </div>
    );
};
