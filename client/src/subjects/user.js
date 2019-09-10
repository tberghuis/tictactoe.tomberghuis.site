import { BehaviorSubject } from "rxjs";
import firebase from "@/firebaseInit";

const bsUser = new BehaviorSubject(null);
export default bsUser;

firebase.auth().onAuthStateChanged(async user => {
  bsUser.next(user);
  // if (user) {
    window.USER = user;
  // }
});
