import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./script.js";

const auth = getAuth();
// function getUserMail() {
//     if (auth.currentUser) {
//         return auth.currentUser.email;
//     } else {
//         return "";
//     }
// }
console.log(auth.currentUser);
//console.log(firebase.auth().currentUser);
console.log(window.currentUser);
if (auth.currentUser) {
    document.getElementById("username").textContent = auth.currentUser.email;
    document.getElementById("firstname").textContent =
        auth.currentUser.displayName;
    document.getElementById("lastname").textContent =
        auth.currentUser.displayName;
    console.log(auth.currentUser);
}
