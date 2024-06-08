import React from "react";
import PlaceList from "../components/PlaceList";
import {useParams} from 'react-router-dom';

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Saw-ghar",
    description: "One of the oldest building in GTG",
    imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3-l3nz1_HShG3ELwruAdywpyNBDR0Tyy9g&s',
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
        lat:40.7484405,
        lng: -73.9856644
    },
    creator: 'u1'
  },
  {
    id: "p2",
    title: "Empire-building",
    description: "One of the oldest building in GTG",
    imageUrl:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3-l3nz1_HShG3ELwruAdywpyNBDR0Tyy9g&s',
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
        lat:40.7484405,
        lng: -73.9856644
    },
    creator: 'u2'
  }
];

const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces =DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces}/>
};

export default UserPlaces;