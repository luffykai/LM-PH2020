"use strict";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "" /* Please Fill in apiKey */,
  authDomain: "lm-ph2020.firebaseapp.com",
  databaseURL: "https://lm-ph2020.firebaseio.com",
  projectId: "lm-ph2020",
  storageBucket: "lm-ph2020.appspot.com",
  messagingSenderId: "1083392040408",
  appId: "1:1083392040408:web:38449f3320b530d891e6ad",
  measurementId: "G-JES8JBQ70D"
};

// // Initialize Cloud Firestore through Firebase
firebase.initializeApp(FIREBASE_CONFIG);

export default firebase;
