import React, { useState } from "react";
import { useEffect, useRef } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import { FaLocationDot } from "react-icons/fa6";

import "./Map.css";
const token=process.env.REACT_APP_TOKEN;

const Maps = (props) => {
  const [viewPort, setViewPort] = useState({
    latitude: props.location.lat,
    longitude: props.location.lng,
    zoom: 6,
  }); 
  useEffect( ()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      // console.log(position.coords)
    })
  }, []);
  return (
    <div className={`map ${props.className}`} style={props.style}>
      <ReactMapGl
        {...viewPort}
        mapboxAccessToken={token}
        width="100%"
        accessToken={token}
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/imnotaryan/clxgi0gz7006v01qwgk3lfhyz"
      >
        
      <Marker latitude ={props.location.lat} longitude={props.location.lng}>
      <FaLocationDot size={25}/>
      </Marker>

      </ReactMapGl>
    </div>
  );
};

export default Maps;
