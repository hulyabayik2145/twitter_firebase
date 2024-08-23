// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-sZpYPCNlL3CeEyYRfrSTxtzN1CMEgvw",
    authDomain: "twitter-9c985.firebaseapp.com",
    projectId: "twitter-9c985",
    storageBucket: "twitter-9c985.appspot.com",
    messagingSenderId: "647049118716",
    appId: "1:647049118716:web:c01c8ea359b6e2f8632879"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//firebase auth nin refereansını alma
export const auth = getAuth(app);
//google sağlayıcısını kurma

export const provider = new GoogleAuthProvider();

// veri tabanın referansını alma
export const db = getFirestore(app);

//dosya yükleme alanının referansını al

export const storage = getStorage(app);

