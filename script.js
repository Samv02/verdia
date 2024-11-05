// document.querySelector(".updateInfo").addEventListener("submit", (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const username = form.elements.username.value;
//     const firstname = form.elements.firstname.value;
//     const lastname = form.elements.lastname.value;
//     console.log(username, firstname, lastname);
// });

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

export const firebaseConfig = {
    apiKey: "AIzaSyBSH-hvCVkKhhMrdtfnoqSZ0TZzjmPMulo",
    authDomain: "verdia-4401d.firebaseapp.com",
    projectId: "verdia-4401d",
    storageBucket: "verdia-4401d.firebasestorage.app",
    messagingSenderId: "639552213584",
    appId: "1:639552213584:web:b1ede9db70fc1cceb63755",
    measurementId: "G-YV1L49M89L",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

// Gestion de la connexion avec email
async function loginWithEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Erreur de connexion : ", error.message);
    }
}
window.loginWithEmail = loginWithEmail; // Rendre la fonction accessible globalement

// Inscription avec email
async function signUpWithEmail() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Erreur d'inscription : ", error.message);
    }
}
window.signUpWithEmail = signUpWithEmail; // Rendre la fonction accessible globalement

// Connexion avec Google
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Erreur Google : ", error.message);
    }
}
window.loginWithGoogle = loginWithGoogle; // Rendre la fonction accessible globalement

// Déconnexion
async function logout() {
    await signOut(auth);
}
window.logout = logout; // Rendre la fonction accessible globalement

//Récuperation de la page html courante
const path = window.location.pathname;
const htmlNamePage = path.split("/").pop();

//Suivi de l'état d'authentification
if (htmlNamePage == "auth-page.html") {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("login").classList.remove("active");
            document.getElementById("chat").classList.add("active");
        } else {
            document.getElementById("login").classList.add("active");
            document.getElementById("chat").classList.remove("active");
        }
    });
}
