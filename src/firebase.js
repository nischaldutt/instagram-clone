// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBjOWvwCvnt_RGh3m1GPfixH0TWIxwKMTc",
  authDomain: "instagram-clone-27222.firebaseapp.com",
  databaseURL: "https://instagram-clone-27222.firebaseio.com",
  projectId: "instagram-clone-27222",
  storageBucket: "instagram-clone-27222.appspot.com",
  messagingSenderId: "514545883954",
  appId: "1:514545883954:web:2110686e7e7c756e1cd52b",
  measurementId: "G-33K0TG29QM",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
