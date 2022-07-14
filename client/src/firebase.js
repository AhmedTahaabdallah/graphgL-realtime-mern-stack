// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import * as firebase from "firebase";

import { initializeApp } from "firebase/app";
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  getAuth, 
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
  signOut
 } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdXBiLYYXlQh3w-PyK9zqYEYq14NGAybo",
  authDomain: "gqlreactnode-2022.firebaseapp.com",
  projectId: "gqlreactnode-2022",
  storageBucket: "gqlreactnode-2022.appspot.com",
  //messagingSenderId: "906401383296",
  appId: "1:906401383296:web:3691b0a52891d236b2b765",
  measurementId: "G-PFKRR0EN7N"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

initializeApp(firebaseConfig);

//export default firebase;

export const auth = getAuth();
export const sendSignInLinkToEmail2 = sendSignInLinkToEmail;
export const signInWithEmailLink2 = signInWithEmailLink;
export const signInWithEmailAndPassword2 = signInWithEmailAndPassword;
export const sendPasswordResetEmail2 = sendPasswordResetEmail;
export const updatePassword2 = updatePassword;
export const onAuthStateChanged2 = onAuthStateChanged;
export const signOut2 = signOut;
export const googleAuthProvider = new GoogleAuthProvider();
export const signInWithPopup2 = signInWithPopup;