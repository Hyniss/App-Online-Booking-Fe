import React from "react";
import "../../css/style.css";
import { callRequest } from "../../utils/requests";
import { GeoMap } from "../base/GeoMap";

export const DemoUploadFiles = () => {
    const [images, setImages] = React.useState([]);
    const [location, setLocation] = React.useState();
    const storedToken = localStorage.getItem("token");
    const changeMultipleFiles = async (event) => {
        if (event.target.files) {
            const imagePromises = Array.from(event.target.files).map(async (file) => {
                var myHeaders = new Headers();
                myHeaders.append("X-LOCALE", "vi");
                myHeaders.append("Authorization", `Bearer ${storedToken}`);

                var formdata = new FormData();
                formdata.append("image", file);

                var requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: formdata,
                    redirect: "follow",
                };

                const image = await callRequest("room/house-owner/upload", requestOptions)
                    .then((response) => response.data)
                    .catch((response) => console.log("response", response));
                return image;
            });
            const images = await Promise.all(imagePromises);
            setImages(images);
            console.log(images);
        }
    };
    return (
        <div>
            <input type='file' onChange={changeMultipleFiles} multiple={true} />
            {images.map((imageUrl, index) => (
                <img src={imageUrl} key={index} />
            ))}
            <GeoMap
                markers={[location]}
                searchable={true}
                onClick={(lat, long) =>
                    setLocation({ latitude: lat, longitude: long })
                }></GeoMap>
        </div>
    );
};
