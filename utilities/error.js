"use strict";

const GenerateHttpError = ({ message, httpErrorCode = 500 }) => {
  const error = new Error(message);
  error.httpErrorCode = httpErrorCode;

  return error;
};

//Token
const TokenInvalidError = () => {
  return GenerateHttpError({
    message: "Token is invalid",
    httpErrorCode: 400,
  });
};

//Authorization
const InvalidUserCredentialError = () => {
  return GenerateHttpError({
    message: "invalid user credential.",
    httpErrorCode: 400,
  });
};

//Car
const CarListingIdInvalidError = () => {
  return GenerateHttpError({
    message: "Car listing id invalid",
    httpErrorCode: 400,
  });
};

const CarIdInvalidError = () => {
  return GenerateHttpError({
    message: "Car id invalid",
    httpErrorCode: 400,
  });
};

const ListingMetadataInvalidError = () => {
  return GenerateHttpError({
    message: "Invalid listing payload",
    httpErrorCode: 400,
  });
};

const CarMetadataInvalidError = () => {
  return GenerateHttpError({
    message: "Invalid car payload",
    httpErrorCode: 400,
  });
};

const CarListingExistError = () => {
  return GenerateHttpError({
    message: "A similar car listing created by you already exist in database.",
    httpErrorCode: 409,
  });
};

const CarExistError = () => {
  return GenerateHttpError({
    message: "A similar car created by you already exist in database.",
    httpErrorCode: 409,
  });
};

const CarDoesntExistError = () => {
  return GenerateHttpError({
    message: "The car doesnt exist in database.",
    httpErrorCode: 404,
  });
};

const ListingDoesntExistError = () => {
  return GenerateHttpError({
    message: "The car listing doesnt exist in database.",
    httpErrorCode: 404,
  });
};

const NotCarOwnerError = () => {
  return GenerateHttpError({
    message: "You do not own the car to create/update a listing",
    httpErrorCode: 400,
  });
};

const BookingOwnListingError = () => {
  return GenerateHttpError({
    message: "You cannot book your own listing",
    httpErrorCode: 400,
  });
};

const ListingAlreadyBookedError = () => {
  return GenerateHttpError({
    message: "Listing already booked",
    httpErrorCode: 400,
  });
};

//User
const UserMetadataInvalidError = () => {
  return GenerateHttpError({
    message: "user metadata is invalid.",
    httpErrorCode: 400,
  });
};

const UserNotFoundError = () => {
  return GenerateHttpError({
    message: "user not found.",
    httpErrorCode: 404,
  });
};

const PasswordInvalidError = () => {
  return GenerateHttpError({
    message: "Invalid credentials.",
    httpErrorCode: 401,
  });
};

const UserIdInvalidError = () => {
  return GenerateHttpError({
    message: "User id is invalid",
    httpErrorCode: 400,
  });
};

const dateInvalidError = () => {
  return GenerateHttpError({
    message: "date is invalid.",
    httpErrorCode: 400,
  });
};

const passedDateError = () => {
  return GenerateHttpError({
    message:
      "Cannot update listing availability date to an already passed date.",
    httpErrorCode: 400,
  });
};

module.exports = {
  GenerateHttpError,
  TokenInvalidError,
  InvalidUserCredentialError,
  UserMetadataInvalidError,
  UserNotFoundError,
  CarListingExistError,
  CarExistError,
  PasswordInvalidError,
  UserIdInvalidError,
  ListingMetadataInvalidError,
  CarListingIdInvalidError,
  CarMetadataInvalidError,
  CarIdInvalidError,
  CarDoesntExistError,
  NotCarOwnerError,
  ListingDoesntExistError,
  dateInvalidError,
  BookingOwnListingError,
  ListingAlreadyBookedError,
  passedDateError,
};
