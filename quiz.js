import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    doc,
    getDoc,
    getDocs,
    updateDoc,
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

document.addEventListener("DOMContentLoaded", loadQuestionAndAnswers);

const urlParams = new URLSearchParams(window.location.search);
let idsession = urlParams.get("session"); //"329qpYO2dsxCq18PTSh6";
let userid = null;
let currentQuestion = 0;
let timeLeft = 100;
let score = 10;
let timerInterval;
let quizzTheme = urlParams.get("quizz");
let timerPopup;
let scoreFinal = 10;

auth.onAuthStateChanged((user) => {
    if (user) {
        // L'utilisateur est connecté
        userid = user.uid;
    }
});

// async function getAllTextFields() {
//     const quizzCollection = collection(db, "quizz");
//     const container = document.getElementById("buttonContainer");

//     try {
//         const querySnapshot = await getDocs(quizzCollection);

//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
//             const docId = doc.id;

//             if (data.quizz) {
//                 const button = document.createElement("button");
//                 button.innerText = data.quizz;

//                 // Ajouter un événement onclick pour afficher l'ID du document dans la console
//                 button.onclick = () => {
//                     fetchQuizId(docId, data.quizz);
//                 };

//                 // Ajouter le bouton au container
//                 container.appendChild(button);
//             }
//         });
//     } catch (error) {
//         console.error(
//             "Erreur lors de la récupération des champs text :",
//             error
//         );
//     }
// }

async function fetchQuizId(quizzValue, text) {
    console.log(`fetchQuizId appelée avec l'ID : ${quizzValue}`);
    quizzTheme = quizzValue;
    //document.getElementById("texteTheme").textContent = text;
    //document.getElementById("startQuizz").style.display = "block";
    //document.getElementById("theme").style.display = "none";
}
window.fetchQuizId = fetchQuizId;

function loadQuestionAndAnswers() {
    fetchQuizId(quizzTheme, idsession);
    console.log(quizzTheme);
    // document.getElementById("startQuizz").style.display = "none";
    document.getElementById("quizz").style.display = "block";
    timeLeft = 100;

    const docRef = doc(db, "quizz", quizzTheme);

    getDoc(docRef)
        .then((docSnap) => {
            if (docSnap.exists) {
                const data = docSnap.data();
                const questionData = data.questions[currentQuestion];

                if (questionData !== undefined) {
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
                        button.onclick = () => handleAnswerClick(option.istrue);
                        answersContainer.appendChild(button);
                    });
                    startTimer();
                } else {
                    console.log("Aucune question disponible!");
                    scoreFinal = parseFloat(
                        document.getElementById("score").textContent
                    );
                    console.log(userid);

                    const sessionDocRef = doc(db, "session", idsession);

                    getDoc(sessionDocRef)
                        .then((docSnap) => {
                            if (docSnap.exists()) {
                                const data = docSnap.data();
                                let users = data.users;
                                let scores = data.score;
                                console.log(scoreFinal);

                                // Trouver l'indice de l'utilisateur dans le tableau `user`
                                console.log(users.indexOf(userid));
                                const userIndex = users.indexOf(userid);

                                if (userIndex !== -1) {
                                    // Si l'utilisateur existe dans le tableau, on met à jour son score
                                    scores[userIndex] = scoreFinal;

                                    // Mettre à jour seulement le tableau `score` dans Firestore
                                    updateDoc(sessionDocRef, {
                                        score: scores,
                                    })
                                        .then(() => {
                                            window.location.href = `recap.html?session=${idsession}`;
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Erreur lors de la mise à jour du score:",
                                                error
                                            );
                                        });
                                } else {
                                    console.log(
                                        "Utilisateur non trouvé dans le tableau."
                                    );
                                }
                            } else {
                                console.log(
                                    "Le document de session n'existe pas !"
                                );
                            }
                        })
                        .catch((error) => {
                            console.error(
                                "Erreur lors de la mise à jour du score:",
                                error
                            );
                        });
                }
            } else {
                console.log("Le document n'existe pas !");
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération du document:", error);
        });
}
window.loadQuestionAndAnswers = loadQuestionAndAnswers;

async function test() {
    console.log("Aucune question disponible!");
    scoreFinal = parseFloat(document.getElementById("score").textContent);
    console.log(userid);

    const sessionDocRef = doc(db, "session", idsession);

    getDoc(sessionDocRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                let users = data.users;
                let scores = data.score;
                console.log(scoreFinal);

                // Trouver l'indice de l'utilisateur dans le tableau `user`
                console.log(users.indexOf(userid));
                const userIndex = users.indexOf(userid);

                if (userIndex !== -1) {
                    // Si l'utilisateur existe dans le tableau, on met à jour son score
                    scores[userIndex] = scoreFinal;

                    // Mettre à jour seulement le tableau `score` dans Firestore
                    updateDoc(sessionDocRef, {
                        score: scores,
                    })
                        .then(() => {
                            window.location.href = `recap.html?session=${idsession}`;
                        })
                        .catch((error) => {
                            console.error(
                                "Erreur lors de la mise à jour du score:",
                                error
                            );
                        });
                } else {
                    console.log("Utilisateur non trouvé dans le tableau.");
                }
            } else {
                console.log("Le document de session n'existe pas !");
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la mise à jour du score:", error);
        });
}
window.test = test;

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
async function handleAnswerClick(isTrue) {
    const currentTimerValue = document.getElementById("timer").textContent;
    document.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });
    if (isTrue) {
        score += Math.round(currentTimerValue * 100);
        document.getElementById("score").textContent = score;
        Swal.fire({
            icon: "success",
            html: "Vous avez gagné" + score + "points",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerPopup = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerPopup);
            },
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            html: "Mauvaise réponse",
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const timer = Swal.getPopup().querySelector("b");
                timerPopup = setInterval(() => {
                    timer.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            },
            willClose: () => {
                clearInterval(timerPopup);
            },
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
    }
}

//getAllTextFields();
