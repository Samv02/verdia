import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
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
import { firebaseConfig, app, db, auth } from "./script.js";

// Affichage en temps réel des messages
const messagesDiv = document.getElementById("messages");
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = `${messageData.user}: ${messageData.content}`;
        messagesDiv.appendChild(messageElement);
    });
});
