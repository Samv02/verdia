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


let nomTheme = document.getElementById("nomTheme");
let zoneQuestionsReponses = document.getElementsByClassName("questionEtReponse")[0];

var quizzId = "";

// Récupère l'URL actuelle
const urlParams = new URLSearchParams(window.location.search);

// Récupère le paramètre 'session'
const idsession = urlParams.get('session');

if (idsession) {
  const sessionDocRef = doc(db, "session", idsession);

  getDoc(sessionDocRef).then((docSnap) => {
    if (docSnap.exists()) {
      const quizzTheme = docSnap.data().quizz;// Récupère le champs quizz dans la session

      // Vérifie que `quizzTheme` est défini
      if (quizzTheme) {
        const quizzCollectionRef = collection(db, "quizz"); // Crée une requête pour obtenir tous les documents dans "quizz"
        const quizzQuery = query(quizzCollectionRef, where("quizz", "==", quizzTheme)); // Recherche dans la collection quizz un champ `quizz` qui est égal à `quizzTheme` dans les documents

        getDocs(quizzQuery).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              quizzId = doc.id; // Ici, on peut accéder à l'ID du quizz
            });
            console.log("ID du quiz:", quizzId);

            const docRef = doc(db, "quizz", quizzId);

            getDoc(docRef).then((docSnap) => {
              if (docSnap.exists) {
                const data = docSnap.data();

                // Affiche l'ID du quizz
                console.log("Theme du quiz:", quizzTheme);  // Affiche le Theme du quizz
                // const listQuestion = doc.data();
                nomTheme.textContent = quizzTheme;

                data.questions.forEach((questions, index) => {
                  // Crée un élément pour la question
                  let pQuestion = document.createElement("h3");
                  pQuestion.setAttribute("id", "question_" + index);
                  pQuestion.textContent = questions.text;
                  zoneQuestionsReponses.appendChild(pQuestion); // Ajoute la question à la zone des questions
                
                  // Traite et affiche les réponses associées à la question
                  questions.options.forEach((option, optionIndex) => {
                    let pReponse = document.createElement("p");
                    pReponse.setAttribute("id", "reponse_" + index + "_" + optionIndex);  // ID unique pour chaque réponse
                    pReponse.textContent = option.text+" ";
                    zoneQuestionsReponses.appendChild(pReponse); // Ajoute les réponses juste après la question

                    if(option.istrue == true) {// Vérifie quelle est la bonne réponse
                      pReponse.style.color = "green";
                      
                      let infoReponse = document.createElement("a");
                      pReponse.appendChild(infoReponse);
                      let imgInfo = document.createElement("img");
                      imgInfo.setAttribute("src", "question_mark.png");
                      imgInfo.style.width = "1.7%"
                      infoReponse.appendChild(imgInfo);

                    } else {
                      pReponse.style.color = "red";
                    }

                  });
                  let separateur = document.createElement("hr"); // Ajoute un séparateur après chaque réponses d'une question
                  zoneQuestionsReponses.appendChild(separateur);
                });
                

              } else {
                console.log("Le document n'existe pas !");
              }
            })
          } else {
            console.log("Aucun document de quiz trouvé pour ce thème !");
          }
        }).catch((error) => {
          console.error("Erreur lors de la récupération des documents de quiz :", error);
        });
      } else {
        console.log("Aucun thème de quiz trouvé dans la session !");
      }
    } else {
      console.log("Aucun document de session trouvé avec cet ID !");
    }
  }).catch((error) => {
    console.error("Erreur lors de la récupération du document de session :", error);
  });
} else {
  console.log("Paramètre de session manquant dans l'URL !");
}