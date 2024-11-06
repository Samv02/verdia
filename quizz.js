import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    where
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

document.getElementById("score").style.display = "none";


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
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedTenths = tenths.toString();
    const formattedHundredths = hundredths.toString();

    // Affichage du temps dans l'élément HTML avec l'id "timer"
    document.getElementById("timer").textContent = `${formattedSeconds}.${formattedTenths}${formattedHundredths}`;

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

async function fetchQuizId(quizzValue) {
    const quizzCollection = collection(db, "quizz");
    const q = query(quizzCollection, where("quizz", "==", quizzValue));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const quizId = doc.id; // ID du document correspondant

        document.getElementById("quizIdDisplay").textContent = `ID du quizz : ${quizId}`;
        loadQuestionAndAnswers(quizId); // Charger la question avec cet ID
    } else {
        console.log("Aucun document trouvé pour cette valeur.");
    }
}
window.fetchQuizId = fetchQuizId;

function loadQuestionAndAnswers() {
    document.getElementById("startQuizButton").style.display = "none";
    document.getElementById("score").style.display = "block";
    timeLeft = 1000;

    const docRef = doc(db, "quizz", "41bUUuvo7avqvFcESbA7");

    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data();
        const questionData = data.questions[currentQuestion];

        // Affiche la question dans le h2
        const questionTextElement = document.getElementById("questionText");
        questionTextElement.textContent = questionData.text;

        // Récupère le conteneur de réponses
        const answersContainer = document.getElementById("answersContainer");

        // Efface les réponses précédentes si nécessaire
        answersContainer.innerHTML = "";

        // Parcourt les réponses et crée un bouton pour chaque réponse
        questionData.options.forEach((option, index) => {
          const button = document.createElement("button");
          button.textContent = option.text;
          button.onclick = () => handleAnswerClick(option.istrue, index);
          answersContainer.appendChild(button);
        });
        startTimer();
      } else {
        console.log("Le document n'existe pas !");
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération du document:", error);
    });
}
window.loadQuestionAndAnswers = loadQuestionAndAnswers;



// Fonction pour gérer le clic sur une réponse
function handleAnswerClick(isTrue, index) {
    const currentTimerValue = document.getElementById("timer").textContent;
    alert(`Timer arrêté : ${currentTimerValue}`); // Afficher la valeur du timer
    document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    if (isTrue) {
        const score = Number(document.getElementById("score").textContent) + Math.round(currentTimerValue * 100);
        document.getElementById("score").textContent = score;
        alert(`Bonne réponse !`);
    } else {
        alert(`Mauvaise réponse`);
    }
}

/*async function getQuizIdByFieldValue(quizzValue) {
    const quizzCollectionRef = collection(db, "quizz"); // Référence à la collection "quizz"
    const q = query(quizzCollectionRef, where("quizz", "==", quizzValue)); // Crée une requête

    try {
        const querySnapshot = await getDocs(q);
        
        // Parcourir les documents qui correspondent à la requête
        querySnapshot.forEach((doc) => {
            console.log("ID du document :", doc.id); // Affiche l'ID du document
        });

        if (querySnapshot.empty) {
            console.log("Aucun document trouvé avec cette valeur de quizz.");
        }

    } catch (error) {
        console.error("Erreur lors de la récupération de l'ID :", error);
    }
}*/
//startTimer();






/*
    const docRef = doc(db, "quizz", "41bUUuvo7avqvFcESbA7");
    getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      // Accéder au premier élément du tableau questions
      const questionData = docSnap.data().questions[0];
  
      // Récupérer la question
      const questionText = questionData.text;
      console.log("Question:", questionText);
  
      // Récupérer les réponses
      const options = questionData.options;
      if (options.length >= 4) {
        const answer1 = options[0].text;
        const answer2 = options[1].text;
        const answer3 = options[2].text;
        const answer4 = options[3].text;
  
        console.log("Réponse 1:", answer1);
        console.log("Réponse 2:", answer2);
        console.log("Réponse 3:", answer3);
        console.log("Réponse 4:", answer4);
      } else {
        console.log("Il n'y a pas assez de réponses dans options");
      }
    } else {
      console.log("Le document n'existe pas !");
    }
  }).catch((error) => {
    console.error("Erreur lors de la récupération du document:", error);
  });*/