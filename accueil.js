import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSH-hvCVkKhhMrdtfnoqSZ0TZzjmPMulo",
    authDomain: "verdia-4401d.firebaseapp.com",
    projectId: "verdia-4401d",
    storageBucket: "verdia-4401d.firebasestorage.app",
    messagingSenderId: "639552213584",
    appId: "1:639552213584:web:b1ede9db70fc1cceb63755",
    measurementId: "G-YV1L49M89L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function envoyerScores() {
    const userId = "bdIwoa9UL7cwEdUApGDIP2uOqAe2"; // Remplacez par l'ID de l'utilisateur
    const scoreRecyclage = parseFloat(document.getElementById("recyclage").value) || 0;
    const scoreCarbone = parseFloat(document.getElementById("carbone").value) || 0;
    const scoreEnergie = parseFloat(document.getElementById("energie").value) || 0;

    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            score_recyclage: scoreRecyclage,
            score_carbone: scoreCarbone,
            score_energie: scoreEnergie
        });
        console.log("Les scores ont été mis à jour avec succès !");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des scores :", error);
    }
}

document.getElementById("envoyerScoresButton").addEventListener("click", envoyerScores);
