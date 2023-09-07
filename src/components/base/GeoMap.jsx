import LocationOnIcon from "@mui/icons-material/LocationOn";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import React from "react";
import Map, { Layer, Marker, Source } from "react-map-gl";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useClickOutside } from "../../CustomHooks/hooks";
import { strings } from "../../utils/strings";

const HANOI_COORDINATE = {
    latitude: 21.028511,
    longitude: 105.804817,
};

export const GeoMap = ({
    location,
    markers = [],
    markerElement = null,
    onClick = null,
    onSelectSearchedLocation = null,
    onClearSearching = null,
    className = "",
    searchable = false,
    searchingLocationDefaultValue = "",
    focusLocation = null,
}) => {
    const [center, setCenter] = React.useState({
        latitude: location?.latitude ?? HANOI_COORDINATE.latitude,
        longitude: location?.longitude ?? HANOI_COORDINATE.longitude,
        zoom: 13,
    });

    const [searchingLocation, setSearchingLocation] = React.useState(
        searchingLocationDefaultValue
    );
    const [foundLocations, setFoundLocations] = React.useState("");
    const [openSearchModal, setOpenSearchModal] = React.useState(false);
    const focusZone = {
        longitude: focusLocation?.longitude ?? HANOI_COORDINATE.longitude,
        latitude: focusLocation?.latitude ?? HANOI_COORDINATE.latitude,
        rangeInKm: focusLocation?.rangeInKm ?? 0,
    };
    const circle = turf.circle(
        [focusZone.longitude, focusZone.latitude],
        focusZone.rangeInKm
    );

    var line = turf.lineString(...circle.geometry.coordinates);

    const onSearching = (value) => {
        setSearchingLocation(value);
        if (strings.isBlank(value)) {
            onClearSearching && onClearSearching();
        }
    };

    const searchLocationByName = (location) => {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        const endpoint = "mapbox.places";

        fetch(
            `https://api.mapbox.com/geocoding/v5/${endpoint}/${location}.json?access_token=${TOKEN}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                setFoundLocations(result.features);
                setOpenSearchModal((result.features || []).length > 0);
            })
            .catch((error) => console.log("error", error));
    };

    const ref = useClickOutside(setOpenSearchModal);

    const TOKEN =
        "pk.eyJ1IjoiaG9tZTJzdGF5IiwiYSI6ImNsazl2anNmNjAxMWEzam8zajAxMzVneWYifQ.q3kU4RqNM7EnbCCaNDC6Gw";

    return (
        <div className={`relative ${className} w-full h-96`}>
            {searchable && (
                <div className='z-10 w-48 sm:w-64 absolute top-4 right-4'>
                    <div className='h-fit !border border-gray-300 bg-white rounded-md flex overflow-hidden items-center pr-3 pl-4 !outline-none focus:!outline-none w-full'>
                        <input
                            type='text'
                            className='w-full h-fit px-0 focus:outline-none border-transparent focus:border-transparent focus:ring-0'
                            value={searchingLocation}
                            placeholder={"Tìm địa điểm..."}
                            onChange={(e) => {
                                const location = e.target.value;
                                onSearching(location);
                                if (strings.isNotBlank(location)) {
                                    searchLocationByName(location.trim());
                                }
                            }}
                            onClick={(e) => {
                                if (strings.isNotBlank(searchingLocation)) {
                                    searchLocationByName(searchingLocation.trim());
                                }
                            }}
                        />
                        <CloseRoundedIcon
                            className='scale-75 text-red-500 cursor-pointer'
                            onClick={() => onSearching("")}
                        />
                    </div>
                    {openSearchModal && (
                        <div
                            className='w-full h-fit rounded-md bg-white border border-gray-300 mt-1 overflow-auto max-h-48'
                            ref={ref}>
                            {foundLocations.map((location_, index) => (
                                <button
                                    onClick={() => {
                                        setCenter({
                                            longitude: location_.center[0],
                                            latitude: location_.center[1],
                                            zoom: center.zoom,
                                        });
                                        onSearching(location_.text);
                                        setOpenSearchModal(false);
                                        onSelectSearchedLocation &&
                                            onSelectSearchedLocation(
                                                location_.center[0],
                                                location_.center[1],
                                                location_.text
                                            );
                                    }}
                                    className='py-2 px-3 w-full text-left hover:bg-gray-100 text-[0.75rem] border-t'
                                    key={index}>
                                    <span className='block font-bold tex-sm'>
                                        {location_.text}
                                    </span>
                                    {location_.place_name.replace(
                                        `${location_.text}, `,
                                        ""
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <Map
                {...center}
                onClick={(event) =>
                    onClick && onClick(event.lngLat.lat, event.lngLat.lng)
                }
                onMove={(event) => setCenter(event.viewState)}
                className='w-full h-full'
                mapStyle='mapbox://styles/mapbox/streets-v9'
                mapboxAccessToken={TOKEN}>
                {focusLocation?.rangeInKm > 0 && (
                    <Source id='my-data' type='geojson' data={circle}>
                        <Layer
                            id='point-90-hi'
                            type='fill'
                            paint={{
                                "fill-color": "#088",
                                "fill-opacity": 0.1,
                                "fill-outline-color": "yellow",
                            }}
                        />
                    </Source>
                )}

                {focusLocation?.rangeInKm > 0 && (
                    <Source id='my-ata' type='geojson' data={line}>
                        <Layer
                            id='point-9-hi'
                            type='line'
                            paint={{
                                "line-color": "blue",
                                "line-width": 1,
                            }}
                        />
                    </Source>
                )}
                {(markers || [])
                    .filter((x) => x)
                    .map((marker, index) => {
                        return (
                            <Marker
                                key={index}
                                longitude={marker.longitude}
                                latitude={marker.latitude}>
                                {markerElement ? (
                                    markerElement
                                ) : marker.element ? (
                                    marker.element
                                ) : (
                                    <LocationOnIcon className='text-primary-500 scale-150' />
                                )}
                            </Marker>
                        );
                    })}
            </Map>
        </div>
    );
};

export const searchLocation = async ({ long, lat }) => {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    return fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=pk.eyJ1IjoiaG9tZTJzdGF5IiwiYSI6ImNsazl2anNmNjAxMWEzam8zajAxMzVneWYifQ.q3kU4RqNM7EnbCCaNDC6Gw`,
        requestOptions
    )
        .then((response) => response.json())
        .catch((error) => console.log("error", error));
};
