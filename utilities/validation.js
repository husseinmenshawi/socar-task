"use strict";

const Yup = require("yup");

const isCreateListingObject = (input) => {
  return Yup.object()
    .shape({
      carId: isUUID(),
      availableDate: dateArray(),
    })
    .required()
    .isValidSync(input);
};

const isCreateCarObject = (input) => {
  return Yup.object()
    .shape({
      carModal: requiredString(),
      manufactureYear: requiredString(),
      numberOfSeats: requiredString(),
      gearType: requiredString(),
      price: requiredInteger(),
    })
    .required()
    .isValidSync(input);
};

const isCredentialObject = (input) => {
  return Yup.object()
    .shape({
      email: email(),
      password: password(),
    })
    .isValidSync(input);
};

const isFindCarListingObject = (input) => {
  return Yup.object()
    .shape({
      carId: optionalUUID(),
      availableDate: dateStringFormat(),
      carStatusId: optionalInteger(),
    })
    .isValidSync(input);
};

const isString = (input) => {
  return requiredString().isValidSync(input);
};

const isInteger = (input) => {
  return requiredInteger().isValidSync(input);
};

const isUUID = (input) => {
  return requiredUUID().isValidSync(input);
};

const dateStringFormat = () => {
  //Matches YYYY-MM-DD
  return Yup.string()
    .trim()
    .matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
};

const requiredInteger = () => {
  return Yup.number().required().integer().min(1);
};

const requiredUUID = () => {
  return Yup.string().required().min(36).max(36).trim().strict();
};

const requiredString = () => {
  return Yup.string().min(1).required();
};

const optionalInteger = () => {
  return Yup.number().notRequired().integer().min(1);
};

const optionalString = () => {
  return Yup.string().min(1).notRequired();
};

const optionalUUID = () => {
  return Yup.string().notRequired().min(36).max(36).trim().strict();
};

const email = () => {
  return Yup.string().required().min(1).trim().strict().email();
};

const password = () => {
  return Yup.string().required().min(6).trim().strict();
};

const dateArray = () => {
  return Yup.array().of(dateStringFormat()).required().min(1);
};

module.exports = {
  isCreateListingObject,
  isCredentialObject,
  isString,
  isInteger,
  isUUID,
  isCreateCarObject,
  dateStringFormat,
  isFindCarListingObject
};
