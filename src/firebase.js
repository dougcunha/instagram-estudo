import { initializeApp } from 'firebase/app';

import { serverTimestamp } from 'firebase/firestore';

import {
    collection,
    getFirestore,
    doc,
    deleteDoc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot
} from 'firebase/firestore';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";

import {
    ref,
    getStorage,
    deleteObject,
    uploadBytes,
    getDownloadURL,
    uploadBytesResumable
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCDTIoEN5Pqo1XvLJfGZnAqJvJ5Zi8JRYQ",
    authDomain: "instagram-clone-danki-code-12.firebaseapp.com",
    projectId: "instagram-clone-danki-code-12",
    storageBucket: "instagram-clone-danki-code-12.appspot.com",
    messagingSenderId: "217644316265",
    appId: "1:217644316265:web:260da9f65c0e72de6514f8",
    measurementId: "G-S6C0N2EQY9"
};

const app = initializeApp(firebaseConfig);

export {
    app,
    getFirestore,
    getAuth,
    deleteObject,
    getStorage,
    uploadBytes,
    uploadBytesResumable,
    deleteDoc,
    ref,
    getDownloadURL,
    updateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
};