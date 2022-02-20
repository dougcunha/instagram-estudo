import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/functions';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCDTIoEN5Pqo1XvLJfGZnAqJvJ5Zi8JRYQ",
    authDomain: "instagram-clone-danki-code-12.firebaseapp.com",
    projectId: "instagram-clone-danki-code-12",
    storageBucket: "instagram-clone-danki-code-12.appspot.com",
    messagingSenderId: "217644316265",
    appId: "1:217644316265:web:260da9f65c0e72de6514f8",
    measurementId: "G-S6C0N2EQY9"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();
export { db, auth, storage, functions, firebaseApp };