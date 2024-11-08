import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);
const userId = "bdIwoa9UL7cwEdUApGDIP2uOqAe2"; // Remplacez par l'ID de l'utilisateur

// Fonction de déconnexion
document.getElementById("logoutButton").addEventListener("click", async (event) => {
    event.preventDefault(); // Empêche le lien de rediriger immédiatement

    try {
        await signOut(auth);
        console.log("Déconnexion réussie.");
        window.location.href = "index.html"; // Remplacez par la page de redirection souhaitée
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }
});
// Fonction pour charger les données initiales
async function chargerDonnees() {
    await chargerScore();
    await chargerScoreParticipation();
    await chargerTotalUtilisateurs();
}

// Fonction pour charger le score écologique depuis Firestore
async function chargerScore() {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById("recyclage").value = data.score_recyclage || 0;
            document.getElementById("carbone").value = data.score_carbone || 0;
            document.getElementById("energie").value = data.score_energie || 0;

            const scoreEcologique = calculerScoreEcologique(data.score_recyclage, data.score_carbone, data.score_energie);
            afficherScore(scoreEcologique);
            changerImage(scoreEcologique);
        } else {
            console.log("Aucun score trouvé pour cet utilisateur.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement du score :", error);
    }
}

// Fonction pour envoyer les scores mis à jour dans Firestore et afficher le calcul
async function envoyerScores() {
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

        const scoreEcologique = calculerScoreEcologique(scoreRecyclage, scoreCarbone, scoreEnergie);
        afficherScore(scoreEcologique);
        changerImage(scoreEcologique);

        Swal.fire({
            title: "Les scores ont été mis à jour avec succès !",
            icon: "success"
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Erreur lors de la mise à jour des scores !",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
        console.error("Erreur lors de la mise à jour des scores :", error);
    }
}

// Fonction pour calculer le score écologique
function calculerScoreEcologique(recyclage, carbone, energie) {
    const totalMax = 100 + 100 + 100;
    const scoreTotal = recyclage + carbone + energie;
    return Math.min((scoreTotal / totalMax) * 100, 100).toFixed(2);
}

function afficherScore(score) {
    document.getElementById("score").innerText = `Votre Score Écologique: ${score}%`;
}

// Fonction pour changer l'image en fonction du score
function changerImage(score) {
    const image = document.getElementById("scoreImage");
    if (!image) {
        console.error("Élément de l'image non trouvé.");
        return;
    }

    let imageIndex = 7;
    if (score < 20) imageIndex = 1;
    else if (score < 40) imageIndex = 2;
    else if (score < 60) imageIndex = 3;
    else if (score < 80) imageIndex = 4;
    else if (score < 90) imageIndex = 5;
    else if (score < 100) imageIndex = 6;

    image.src = `imageSite/icones/camamber/camamberd${imageIndex}.png`;
}

// Fonction pour charger le nombre de participations de l'utilisateur
async function chargerScoreParticipation() {
    try {
        const sessionRef = collection(db, "session");
        const q = query(sessionRef, where("users", "array-contains", userId));
        const querySnapshot = await getDocs(q);
        const participationCount = querySnapshot.size;

        document.querySelector(".blockscore:first-child p").innerText = participationCount;
    } catch (error) {
        console.error("Erreur lors du chargement du nombre de participations :", error);
    }
}

// Fonction pour charger le nombre total d'utilisateurs
async function chargerTotalUtilisateurs() {
    try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const userCount = querySnapshot.size;

        document.querySelector(".blockscore:last-child p").innerText = userCount;
    } catch (error) {
        console.error("Erreur lors du chargement du nombre total d'utilisateurs :", error);
    }
}



// Charger les données initiales au chargement de la page
window.addEventListener("DOMContentLoaded", chargerDonnees);
document.getElementById("envoyerScoresButton").addEventListener("click", envoyerScores);