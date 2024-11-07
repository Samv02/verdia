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
    onSnapshot,
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

        startPeriodicCheck2(userid, intervalMs);
        startPeriodicCheck3(userid, intervalMs);
    }
});

function startPeriodicCheck2(userId, intervalMs) {
    const intervalId = setInterval(() => {
        GetBadge2(userId, intervalId);
    }, intervalMs);
    return intervalId;  // Retourne l'ID de l'intervalle pour un contrôle supplémentaire si nécessaire
}

function startPeriodicCheck3(userId, intervalMs) {
    const intervalId = setInterval(() => {
        GetBadge3(userId, intervalId);
    }, intervalMs);
    return intervalId;  // Retourne l'ID de l'intervalle pour un contrôle supplémentaire si nécessaire
}

async function GetBadge2(userid, intervalId){
    const badgeId = 2;
    const sessionRef = collection(db, "session");
    let userFound = false;

    // Récupère tous les documents de la collection "session"
    const querySnapshot = await getDocs(sessionRef);

    // Filtrer pour trouver un document qui contient `userid` dans le mappage `users`

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data !== undefined) {
            userFound = true;
        }
    });

    if (userFound) {
        const added = await ObtentionBadge(userid, badgeId);
        
        // Si le badge est déjà attribué, arrête la boucle
        if (!added) {
            clearInterval(intervalId);  // Arrête l'intervalle si le badge est déjà attribué
        }
        return true;
    } else {
        return false;
    }
}

async function GetBadge3(userid, intervalId){
    const badgeId = 3;
    const sessionRef = collection(db, "session");
    let userFound = false;

    // Crée une requête pour chercher les documents où "gagnant" est égal à `userId`
    const q = query(sessionRef, where("gagnant", "==", userid));

    // Exécute la requête
    const querySnapshot = await getDocs(q);

    // Vérifie si au moins un document correspond
    if (!querySnapshot.empty) {
        userFound = true;
    } 
    if (userFound) {
        const added = await ObtentionBadge(userid, badgeId);
        
        // Si le badge est déjà attribué, arrête la boucle
        if (!added) {
            clearInterval(intervalId);  // Arrête l'intervalle si le badge est déjà attribué
        }
        return true;
    } else {
        return false;
    }
}

async function ObtentionBadge(userId, badgeId) {
    const obtentionRef = collection(db, "obtention");
    const badgeRef = collection(db, "badge");  // Référence à la collection "badge"
  
    // Crée une requête pour vérifier si un document existe avec le même userId et badgeId
    const qObtention = query(obtentionRef, where("user_Uid", "==", userId), where("badge_Uid", "==", badgeId));
    const queryObtention = await getDocs(qObtention);

    const qBadge = query(badgeRef, where("badgeId", "==", badgeId));  // Cherche un badge avec cet ID
    const queryBadge = await getDocs(qBadge);

    let badgeData = null;  // Déclare badgeData ici

    if (!queryBadge.empty) {
        // Si un badge est trouvé, on prend le premier (supposons qu'il y a un seul document pour chaque badge)
        const badgeDoc = querySnapshot.docs[0];
        badgeData = badgeDoc.data();
    }
  
    // Vérifie si le document existe déjà
    if (!queryObtention.empty) {
        return false;  // Indique que l'ajout n'a pas été fait car le document existe déjà
    }
  
    // Si aucun document correspondant n'est trouvé, on peut ajouter un nouveau document
    const newDocData = {
      badge_Uid: badgeId,
      date_obtention: Timestamp.now(),
      user_Uid: userId
    };
  
    // Ajoute le nouveau document dans la collection "obtention"
    await addDoc(obtentionRef, newDocData);
    console.log(badgeData)
        Swal.fire({
            position: "top-end",
            title: "You have earned a badge!",
            html: "badgeData.nom",  // Affiche le nom du badge dans la popup
            showConfirmButton: false,
            timer: 1500
        });
    return true;  // Indique que l'ajout a été fait avec succès
}

//J'ai pas reussi a le faire fonctionner 
/*async function GetBadge2(userid){
    const badgeId = 2;
    const sessionRef = collection(db, "session");

    // Crée une requête pour rechercher les documents qui contiennent le userId dans le tableau "users"
    const q = query(sessionRef, where("users", "array-contains","ghibefvufjekvhunjbfvduikhfvbifv"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Vérifie si au moins un document correspond
        if (!querySnapshot.empty) {
            console.log(`L'utilisateur ${userid} existe dans au moins une session.`);
            ObtentionBadge(userid, badgeId);
        } else {
            console.log("L'utilisateur n'existe dans aucune session.");
        }
    });
}*/