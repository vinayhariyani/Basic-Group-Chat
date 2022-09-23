import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDQpLJ4wnXWuVpbgikWo4qqG0KZ-iC7F10",
  authDomain: "chatapp-byvinay.firebaseapp.com",
  projectId: "chatapp-byvinay",
  storageBucket: "chatapp-byvinay.appspot.com",
  messagingSenderId: "553417069866",
  appId: "1:553417069866:web:a20cd7a9422ded7f70ba53",
};

export const app = initializeApp(firebaseConfig);
