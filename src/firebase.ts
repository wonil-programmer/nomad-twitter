// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9IaV7bWBHx1HiiHU7MhFAAKQ0ay5ekkE",
  authDomain: "x-clone-648c5.firebaseapp.com",
  projectId: "x-clone-648c5",
  storageBucket: "x-clone-648c5.appspot.com",
  messagingSenderId: "1064642301819",
  appId: "1:1064642301819:web:9a0cefcb2afec54618f7de",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
