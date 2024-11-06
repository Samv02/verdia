import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    doc,
    addDoc,
    Timestamp,
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

const intervalMs = 1000;  // 1 seconde
let userid = null;

auth.onAuthStateChanged((user) => {
    if (user) {
        // L'utilisateur est connecté
        userid = user.uid;
        console.log("Utilisateur connecté :", user);
        console.log("UID:", user.uid);
        console.log("Nom:", user.displayName);
        console.log("Email:", user.email);
        userid = user.uid;
        console.log(userid);

        GetBadge2();
    }
});

async function GetBadge2(){
    const badgeId = 2;
    const sessionRef = collection(db, "session");

  // Crée une requête pour rechercher les documents qui contiennent le userId dans le tableau "users"
  const q = query(sessionRef, where("users", "array-contains", userid));

  // Exécute la requête
  const querySnapshot = await getDocs(q);

  // Vérifie si au moins un document correspond
  if (!querySnapshot.empty) {
    console.log(`L'utilisateur ${userid} existe dans au moins une session.`);
    addUserToObtentionCollection(userid, badgeId);
    return true;
  } else {
    console.log("L'utilisateur n'existe dans aucune session.");
    return false;
  }
}

async function addUserToObtentionCollection(userId, badgeId) {
    const obtentionRef = collection(db, "obtention");
  
    const newDocData = {
      badge_Uid: badgeId,  // Utiliser l'ID du document de session comme badge_Uid
      date_obtention: Timestamp.now(),  // Timestamp actuel
      user_Uid: userId
    };
  
    try {
      await addDoc(obtentionRef, newDocData);
      console.log(`Document ajouté`);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document dans 'obtention' :", error);
    }
  }

/*function startPeriodicCheck(userId, intervalMs) {
    return setInterval(() => {
        GetBadge2(userId);
    }, intervalMs);
}

startPeriodicCheck(userId, intervalMs);*/
