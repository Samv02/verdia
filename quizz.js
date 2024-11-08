import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
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
let timerPopup;

// Ajouter un tableau pour stocker l'historique des réponses
let answerHistory = [];

async function getAllTextFields() {
    const quizzCollection = collection(db, "quizz");
    const container = document.getElementById("buttonContainer");

    try {
        const querySnapshot = await getDocs(quizzCollection);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;

            if (data.quizz) {
                // Conteneur gris pour le quiz
                const quizContainer = document.createElement("div");
                quizContainer.classList.add(
                    "bg-gray-100", "p-4", "rounded-lg", "shadow-md", "mb-4"
                );

                // Div principale pour le quiz avec image de fond
                const divQuizz = document.createElement("div");
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

                const divTitre = document.createElement("div");
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
                    const param = "quizz";
                    const value = data.quizz;
                    const url = `matchmaking.html?${param}=${encodeURIComponent(
                        value
                    )}`;
                    fetchQuizId(docId, data.quizz);
                };

                quizContainer.appendChild(divQuizz);
                container.appendChild(quizContainer);
            }
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des champs text :", error);
    }
}

async function fetchQuizId(quizzValue, text) {
    quizzTheme = quizzValue;
    
    // Affichage du thème
    const themeTitle = document.getElementById("texteTheme");
    themeTitle.textContent = text;
    themeTitle.classList.add(
        "text-2xl", "font-semibold", "text-gray-800", "mb-4", "bg-gray-100", "p-4", "rounded"
    );

    document.getElementById("startQuizz").style.display = "block";
    document.getElementById("theme").style.display = "none";
}
window.fetchQuizId = fetchQuizId;

function loadQuestionAndAnswers() {
    document.getElementById("startQuizz").style.display = "none";
    document.getElementById("quizz").style.display = "flex";
    document.getElementById("quizz").classList.add(
        "flex",
        "flex-col",
        "items-center",
        // "justify-center",
        // "min-h-screen" // Centrer verticalement et horizontalement dans la page
    );
    timeLeft = 1000;

    const docRef = doc(db, "quizz", quizzTheme);

    getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const questionData = data.questions[currentQuestion];

                const questionTextElement = document.getElementById("questionText");
                questionTextElement.textContent = questionData.text;

                // Centre la question et ajoute de l'espace en haut et en bas
                questionTextElement.classList.add(
                    "text-center",
                    "my-8",
                    "text-2xl",
                    "font-semibold",
                    "text-gray-800"
                );

                const answersContainer = document.getElementById("answersContainer");

                // Configure `answersContainer` pour être centré
                answersContainer.innerHTML = "";
                answersContainer.classList.add(
                    "inline-grid",
                    "grid-cols-2",
                    "gap-4",
                    "justify-center"
                );

                // Créez les boutons de réponse avec une taille agrandie
                questionData.options.forEach((option, index) => {
                    const button = document.createElement("button");
                    button.textContent = option.text;

                    // Classes de style pour les boutons
                    button.classList.add(
                        "text-white",
                        "rounded-lg",
                        "flex",
                        "items-center",
                        "justify-center"
                    );

                    // Taille agrandie pour chaque bouton carré
                    button.style.width = "150px";
                    button.style.height = "150px";
                    button.style.margin = "4px";

                    // Couleurs différentes pour chaque bouton
                    const colors = ["bg-yellow-500", "bg-red-500", "bg-blue-500", "bg-green-500"];
                    button.classList.add(colors[index % colors.length]);

                    // Effet de survol
                    button.classList.add("hover:opacity-75");

                    button.onclick = () => handleAnswerClick(option.istrue, option.text);
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

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 10);
}

function updateTimer() {
    const seconds = Math.floor((timeLeft % 6000) / 100);
    const tenths = Math.floor((timeLeft % 100) / 10);
    const hundredths = timeLeft % 10;

    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedTenths = tenths.toString();
    const formattedHundredths = hundredths.toString();

    document.getElementById("timer").textContent = `${formattedSeconds}.${formattedTenths}${formattedHundredths}`;

    timeLeft--;

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        currentQuestion++;
        document.querySelectorAll("button").forEach((button) => {
            button.disabled = false;
        });
        loadQuestionAndAnswers();
    }
}

async function handleAnswerClick(isTrue, answerText) {
    const currentTimerValue = document.getElementById("timer").textContent;
    document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });

    if (isTrue) {
        const pointsEarned = Math.round(currentTimerValue * 100);
        score += pointsEarned;
        document.getElementById("score").textContent = score;
        
        Swal.fire({
            icon: "success",
            html: `Correct! Vous avez gagné ${pointsEarned} points.`,
            timer: 3000,
            timerProgressBar: true,
        });
    } else {
        Swal.fire({
            icon: "error",
            html: "Mauvaise réponse",
            timer: 3000,
            timerProgressBar: true,
        });
    }

    answerHistory.push({
        question: document.getElementById("questionText").textContent,
        answer: answerText,
        correct: isTrue,
    });

    displayAnswerHistory();

    currentQuestion++;
    loadQuestionAndAnswers();
}

function displayAnswerHistory() {
    const historyContainer = document.getElementById("historyContainer");
    historyContainer.innerHTML = "";
    answerHistory.forEach((entry, index) => {
        const entryDiv = document.createElement("div");
        entryDiv.classList.add(
            "p-3",
            "mb-2",
            "rounded",
            entry.correct ? "bg-green-200" : "bg-red-200"
        );
        entryDiv.innerHTML = `<strong>Question ${index + 1}:</strong> ${
            entry.question
        }<br><strong>Votre réponse:</strong> ${entry.answer}`;
        historyContainer.appendChild(entryDiv);
    });
}
window.handleAnswerClick = handleAnswerClick;

// Stylisation du bouton "Commencer le quiz"
const startButton = document.getElementById("startQuizz");
startButton.classList.add(
    "bg-grey-500",
    "text-white",
    "py-3",
    "px-6",
    "rounded-lg",
    //"hover:bg-green-600",
    "text-xl",
    "font-semibold",
    "mt-4",
    "shadow-md"
);

//getAllTextFields();
document.addEventListener("DOMContentLoaded", getAllTextFields);
