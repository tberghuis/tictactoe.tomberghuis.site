import firebase from "@/firebaseInit";

const provider = new firebase.auth.GoogleAuthProvider();

export function loginGoogle() {
  firebase.auth().signInWithRedirect(provider);
}

export function logout() {
  firebase.auth().signOut();
}
