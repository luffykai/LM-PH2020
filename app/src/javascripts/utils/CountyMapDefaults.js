const CountyTypes = require("./CountyTypes");

const CountyMapDefaults = {
  [CountyTypes.HSINCHU]: {
    center: {
      lat: 24.7858178,
      lng: 120.9526337,
    },
    zoom: 12.86,
  },
  [CountyTypes.KAOHSIUNG]: {
    center: {
      lat: 22.6311876,
      lng: 120.3370974,
    },
    zoom: 12.36,
  },
  [CountyTypes.KINMEN]: {
    center: {
      lat: 24.444409,
      lng: 118.34799,
    },
    zoom: 12.58,
  },
  [CountyTypes.LIENCHIANG]: {
    center: {
      lat: 26.1950683,
      lng: 119.9668753,
    },
    zoom: 12.91,
  },
  [CountyTypes.NANTOU]: {
    center: {
      lat: 23.859214,
      lng: 120.965297,
    },
    zoom: 10.55,
  },
  [CountyTypes.NEW_TAIPEI]: {
    center: {
      lat: 25.160994,
      lng: 121.564604,
    },
    zoom: 11,
  },
  [CountyTypes.PENGHU]: {
    center: {
      lat: 23.581511,
      lng: 119.580488,
    },
    zoom: 12.43,
  },
  [CountyTypes.TAICHUNG]: {
    center: {
      lat: 24.153038,
      lng: 120.680802,
    },
    zoom: 12.47,
  },
  [CountyTypes.TAINAN]: {
    center: {
      lat: 22.991912,
      lng: 120.20161,
    },
    zoom: 13.24,
  },
  [CountyTypes.TAIPEI]: {
    center: {
      lat: 25.045204,
      lng: 121.538817,
    },
    zoom: 13.66,
  },
  [CountyTypes.TAITUNG]: {
    center: {
      lat: 22.75495,
      lng: 121.117761,
    },
    zoom: 13.23,
  },
  [CountyTypes.TAOYUAN]: {
    center: {
      lat: 24.993843,
      lng: 121.309029,
    },
    zoom: 13.71,
  },
};

module.exports = CountyMapDefaults;
