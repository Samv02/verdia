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
import { createUserDocument } from "./db/user.js";

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
    const email = document.getElementById("emaillog").value;
    const password = document.getElementById("passwordlog").value;
    try {
        console.log(auth + " " + email + " " + password);
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "accueil.html";
    } catch (error) {
        console.error("Erreur de connexion : ", error.message);
        document.getElementById("connectionMessage").innerHTML =
            "<p>Erreur de connexion</p>";
    }
}
window.loginWithEmail = loginWithEmail; // Rendre la fonction accessible globalement

// Inscription avec email
async function signUpWithEmail() {
    const email = document.getElementById("emailsign").value;
    const password = document.getElementById("passwordsign").value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = "accueil.html";
    } catch (error) {
        console.error("Erreur d'inscription : ", error.message);
        switch (error.message) {
            case "Firebase: Error (auth/email-already-in-use).":
                Swal.fire({
                    title: "Cet email est déjà utilisé.",
                    icon: "error",
                });
                break;
            case "Firebase: Password should be at least 6 characters (auth/weak-password).":
                Swal.fire({
                    title: "Le mot de passe doit contenir au moins 6 caractères.",
                    icon: "error",
                });
                break;
            case "Firebase: Error (auth/invalid-email).":
                Swal.fire({
                    title: "L'email est invalide.",
                    icon: "error",
                });
                break;
            default:
        }
    }
}
window.signUpWithEmail = signUpWithEmail; // Rendre la fonction accessible globalement

// Connexion avec Google
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        window.location.href = "accueil.html";
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

//Creation du document utilisateur
export function AddUserToDatabase(user) {
    const objectUser = {
        id: user.uid,
        nom: user.displayName,
        prenom: "",
        username: "",
        mail: user.email,
    };
    createUserDocument(objectUser);
}

//Suivi de l'état d'authentification
if (htmlNamePage == "auth-page.html") {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById("login").classList.remove("active");
            document.getElementById("chat").classList.add("active");
            //Si user est connecté, création du document utilisateur
            AddUserToDatabase(user);
            window.location.href = "accueil.html";
        } else {
            document.getElementById("login").classList.add("active");
            document.getElementById("chat").classList.remove("active");
        }
    });
}
