import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    where,
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

let currentQuestion = 0;
let timeLeft = 1000;
let score = 0;
let timerInterval;
let quizzTheme = null;

async function getAllTextFields() {
    const quizzCollection = collection(db, "quizz");
    const container = document.getElementById("buttonContainer");

    try {
        const querySnapshot = await getDocs(quizzCollection);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;

            if (data.quizz) {
                //const button = document.createElement("button");
                //button.innerText = data.quizz;

                // Ajouter un événement onclick pour afficher l'ID du document dans la console
                // button.onclick = () => {
                //     fetchQuizId(docId, data.quizz);
                // };

                // Ajouter le bouton au container
                //container.appendChild(button);

                ///////////////////////////////////:
                //<div
                //     class="relative bg-cover bg-center h-64"
                //     style="background-image: url('')"
                // >
                //     <!-- Le titre avec un fond blanc centré -->
                //     <div class="absolute inset-0 flex items-center justify-center">
                //         <h1
                //             class="bg-white px-6 py-3 text-2xl font-bold text-center text-black shadow-lg"
                //         >
                //             Mon Titre
                //         </h1>
                //     </div>
                // </div>

                //Creation de la div pour le quizz
                const divQuizz = document.createElement("div");
                // divQuizz.classList.add(
                //     "relative",
                //     "bg-cover",
                //     "bg-center",
                //     "max-w-xs",
                //     "overflow-hidden",
                //     "rounded",
                //     "shadow-lg",
                //     "transition",
                //     "duration-300",
                //     "ease-in-out",
                //     "transform",
                //     "hover:-translate-y-1",
                //     "hover:scale-105",
                //     "hover:shadow-2xl",
                //     "cursor-pointer"
                // );
                divQuizz.classList.add(
                    "relative",
                    "bg-cover",
                    "bg-center",
                    "h-64",
                    "rounded",
                    "shadow-lg",
                    "transition",
                    "duration-300",
                    "ease-in-out",
                    "transform",
                    "hover:-translate-y-1",
                    "hover:scale-105",
                    "hover:shadow-2xl",
                    "cursor-pointer"
                );
                const divImage = document.createElement("div");
                divImage.classList.add(
                    "absolute",
                    "inset-0",
                    "rounded",
                    "bg-cover",
                    "bg-center",
                    "filter",
                    "brightness-50",
                    "z-0"
                );
                const linkImage = data.quizz + ".webp";
                const encodedUrl = encodeURIComponent(linkImage);
                divImage.style.backgroundImage = `url("${encodedUrl}")`;
                divQuizz.appendChild(divImage);
                //Creation du titre du quizz
                const divTitre = document.createElement("div");
                // divTitre.classList.add(
                //     "absolute",
                //     "inset-0",
                //     "flex",
                //     "items-center",
                //     "justify-center",
                //     "filter"
                // );
                divTitre.classList.add(
                    "px-6",
                    "py-4",
                    "relative",
                    "z-10",
                    "flex",
                    "items-center",
                    "justify-center",
                    "h-full"
                );

                const titreQuizz = document.createElement("h1");
                titreQuizz.classList.add(
                    "px-6",
                    "py-3",
                    "text-1xl",
                    "font-bold",
                    "text-center",
                    "text-white",
                    "shadow-lg"
                );
                titreQuizz.textContent = data.quizz;
                divTitre.appendChild(titreQuizz);
                divQuizz.appendChild(divTitre);
                divQuizz.onclick = () => {
                    fetchQuizId(docId, data.quizz);
                };

                // Ajouter la div quizz au container
                container.appendChild(divQuizz);
            }
        });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des champs text :",
            error
        );
    }
}

async function fetchQuizId(quizzValue, text) {
    console.log(`fetchQuizId appelée avec l'ID : ${quizzValue}`);
    quizzTheme = quizzValue;
    document.getElementById("texteTheme").textContent = text;
    document.getElementById("startQuizz").style.display = "block";
    document.getElementById("theme").style.display = "none";
}
window.fetchQuizId = fetchQuizId;

function loadQuestionAndAnswers() {
    document.getElementById("startQuizz").style.display = "none";
    document.getElementById("quizz").style.display = "block";
    timeLeft = 1000;

    const docRef = doc(db, "quizz", quizzTheme);

    getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists) {
                const data = docSnap.data();
                const questionData = data.questions[currentQuestion];

                // Affiche la question dans le h2
                const questionTextElement =
                    document.getElementById("questionText");
                questionTextElement.textContent = questionData.text;

                // Récupère le conteneur de réponses
                const answersContainer =
                    document.getElementById("answersContainer");

                // Efface les réponses précédentes si nécessaire
                answersContainer.innerHTML = "";

                // Parcourt les réponses et crée un bouton pour chaque réponse
                questionData.options.forEach((option, index) => {
                    const button = document.createElement("button");
                    button.textContent = option.text;
                    button.onclick = () =>
                        handleAnswerClick(option.istrue, index);
                    answersContainer.appendChild(button);
                });
                startTimer();
            } else {
                console.log("Le document n'existe pas !");
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération du document:", error);
        });
}
window.loadQuestionAndAnswers = loadQuestionAndAnswers;

async function startTimer() {
    clearInterval(timerInterval); // Assurez-vous de nettoyer tout intervalle existant
    timerInterval = setInterval(updateTimer, 10);
}

// Fonction pour mettre à jour le timer
async function updateTimer() {
    // Calcul les secondes, dixièmes et centièmes
    const seconds = Math.floor((timeLeft % 6000) / 100);
    const tenths = Math.floor((timeLeft % 100) / 10);
    const hundredths = timeLeft % 10;

    // Formatage pour afficher les secondes et un chiffre pour dixièmes/centièmes
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedTenths = tenths.toString();
    const formattedHundredths = hundredths.toString();

    // Affichage du temps dans l'élément HTML avec l'id "timer"
    document.getElementById(
        "timer"
    ).textContent = `${formattedSeconds}.${formattedTenths}${formattedHundredths}`;

    // Décrémenter le temps restant en centièmes de seconde
    timeLeft--;

    // Vérifier si le temps est écoulé
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // Passer à la question suivante
        currentQuestion++;
        document.querySelectorAll("button").forEach((button) => {
            button.disabled = false;
        });
        loadQuestionAndAnswers();
    }
}

// Fonction pour gérer le clic sur une réponse
async function handleAnswerClick(isTrue, index) {
    const currentTimerValue = document.getElementById("timer").textContent;
    alert(`Timer arrêté : ${currentTimerValue}`); // Afficher la valeur du timer
    document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    if (isTrue) {
        score += Math.round(currentTimerValue * 100);
        document.getElementById("score").textContent = score;
        alert(`Bonne réponse !`);
    } else {
        alert(`Mauvaise réponse`);
    }
}

document.addEventListener("DOMContentLoaded", getAllTextFields);
//getAllTextFields();