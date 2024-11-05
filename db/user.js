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
    doc,
    setDoc,
    updateDoc,
    Timestamp,
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

//CREATE
// Fonction pour créer un document "user"
// type User = {
//     id: string,
//     isAdmin: boolean,
//     nom: string,
//     prenom: string,
//     username: string,
// };

//@param {Object} user - Objet contenant les informations de l'utilisateur
export async function createUserDocument(user) {
    try {
        // Créez une référence au document "user" avec l'ID spécifié
        const userRef = doc(db, "users", user.id);

        // Structure de données du document
        const userData = {
            date_creation: Timestamp.now(), // Code temporel
            isadmin: false, // Booléen
            nom: user.nom, // Chaîne (nom de l'utilisateur)
            prenom: user.prenom, // Chaîne (prénom de l'utilisateur)
            mail: user.mail,
            score_carbone: 0, // Chiffre (score carbone)
            score_energie: 0, // Chiffre (score énergie)
            score_recyclage: 0, // Chiffre (score recyclage)
            username: user.username, // Chaîne vide pour le nom d'utilisateur
        };

        // Enregistrement du document dans Firestore
        await setDoc(userRef, userData);
        console.log("Document 'user' créé avec succès !");
    } catch (error) {
        console.error("Erreur lors de la création du document : ", error);
    }
}

//UPDATE

// Fonction pour mettre à jour un document "user" avec les champs spécifiés
export async function updateUserDocument(userId, updatedFields) {
    try {
        // Référence au document de l'utilisateur
        const userRef = doc(db, "users", userId);

        // Mise à jour du document avec les champs fournis
        await updateDoc(userRef, updatedFields);

        console.log("Document 'user' mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de la mise à jour du document : ", error);
    }
}
//DELETE
