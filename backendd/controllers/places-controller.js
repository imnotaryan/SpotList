const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getCoordsForAddress = require("../util/location");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find the place by provided place Id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("Fething failed, please try again later", 500);
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find the places by provided user Id.", 404)
    );
  }
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  // console.log("sddsffdfffs")
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid input passed, please check your data",
      422
    );
    return next(error);
  }
  // console.log("after")
  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    console.log("bad")
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.responseData.userId,
  });

  let user;
  try {
    user = await User.findById(req.responseData.userId);
  } catch (err) {
    
    return next(new HttpError("Creation failed, try again", 500));
  }

  if (!user) {
    return next(new HttpError("cannot find user for provided Id", 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creation failed, please try again", 500);
    // console.log(error);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, cannot update", 500);
    return next(error);
  }

  if (place.creator.toString() !== req.responseData.userId) {
    const error = new HttpError("You are not allowed to edit this place", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, cannot update", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, cannot find place to delete",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Something went wrong, cannot find place to delete",
      404
    );
    return next(error);
  }
  if (place.creator.id !== req.responseData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place",
      401
    );
    return next(error);
  }

  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something went wrong, cannot delete", 500);
    return next(error);
  }

  fs.unlink(imagePath, (err) => {});

  res.status(200).json({ message: "Deleted place." });
};

exports.getPlacesByUserId = getPlacesByUserId;
exports.getPlaceById = getPlaceById;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
