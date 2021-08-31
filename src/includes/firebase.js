/* eslint-disable */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBERCcnJAcVhsJYNeNSHo2_4lqw1Ldlirw",
  authDomain: "music-sharing-app-15966.firebaseapp.com",
  projectId: "music-sharing-app-15966",
  storageBucket: "music-sharing-app-15966.appspot.com",
  messagingSenderId: "786529258780",
  appId: "1:786529258780:web:1f153d6614a67ff545fed9",
};

// Initializing Firebase
firebase.initializeApp(firebaseConfig);

// Auth object returned by auth
const auth = firebase.auth();

// Access to the database
const db = firebase.firestore();

// Accessing the storage object for music uploading
const storage = firebase.storage();

// Adding persistence
db.enablePersistence().catch((err) => console.error("Firebase persistence error: ", err));

// Access or create a new collection into the database
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export { auth, db, usersCollection, songsCollection, commentsCollection, storage };
