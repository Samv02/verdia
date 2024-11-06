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

// Fonction pour envoyer un message
async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();
    if (message) {
        try {
            await addDoc(collection(db, "messages"), {
                content: message,
                timestamp: Date.now(),
                user: auth.currentUser.email || auth.currentUser.displayName,
            });
            messageInput.value = "";
        } catch (e) {
            console.error("Erreur d'envoi : ", e);
        }
    }
}
window.sendMessage = sendMessage; // Rendre la fonction accessible globalement
