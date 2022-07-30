// Import the functions you need from the SDKs you need
import {getApps, initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getAuth} from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBas79KYQqGstVBB2SDnOSSlh2lbUxjwls",
  authDomain: "nextjs-chat-app-a1e09.firebaseapp.com",
  projectId: "nextjs-chat-app-a1e09",
  storageBucket: "nextjs-chat-app-a1e09.appspot.com",
  messagingSenderId: "226300898407",
  appId: "1:226300898407:web:54d8e55f959e421e67b8c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}
