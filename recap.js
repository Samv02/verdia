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

/* 
Faut récupérer les id des mecs en qui ont joué depuis la page du quizz(dans l'url) 
les comparés avec la session depuis ce dernier prendre le quizz et affiché les bonnes
réponses
*/

// Récupère l'URL actuelle
const urlParams = new URLSearchParams(window.location.search);

// Récupère le paramètre 'name'
const idsession = urlParams.get('session');

const sessionDocRef = doc(db, "session", idsession);

getDoc(sessionDocRef).then((docSnap) => {
    if (docSnap.exists()) {
        const quizzTheme = docSnap.data().quizz;
      // Afficher toutes les données du document
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists) {
            const question = doc(db, "quizz", quizzTheme);
            const data = docSnap.data();
            const questionData = data.questions[currentQuestion];
    
            questionData.options.forEach((option, index) => {
                const button = document.createElement("button");
                button.textContent = option.text;
                button.onclick = () => handleAnswerClick(option.istrue, index);
                answersContainer.appendChild(button);
            });
        }
    });

      console.log("Données de la session:", docSnap.data());
    } else {
      console.log("Aucun document trouvé avec cet ID !");
    }
  }).catch((error) => {
    console.error("Erreur lors de la récupération du document :", error);
});