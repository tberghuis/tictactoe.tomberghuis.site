import * as firebase from "firebase/app";
import "firebase/auth";

export default firebase;

const firebaseConfig = {
  apiKey: "AIzaSyD3ML8a3mF7ogaFnCsHygUOOzSgAqAhS-E",
  authDomain: "tictactoe-b4558.firebaseapp.com",
  databaseURL: "https://tictactoe-b4558.firebaseio.com",
  projectId: "tictactoe-b4558",
  storageBucket: "",
  messagingSenderId: "74748385045",
  appId: "1:74748385045:web:aa055556cf2a0142"
};

firebase.initializeApp(firebaseConfig);
