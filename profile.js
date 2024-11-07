import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./script.js";
import { updateUserDocument, getUserDocument } from "./db/user.js";

const auth = getAuth();
export const db = getFirestore(app);
let userid = null;
// function getUserMail() {
//     if (auth.currentUser) {
//         return auth.currentUser.email;
//     } else {
//         return "";
//     }
// }
// console.log(auth.currentUser);
//console.log(firebase.auth().currentUser);

//verifie que l'utilisateur est connecté
auth.onAuthStateChanged((user) => {
    if (user) {
        userid = user.uid;
        fetchDataInput(user);
        console.log(user);
        window.userConnected = user;
        getBadgesForUser(userid).then(badges => {
            console.log("Badges obtenus:", badges);
        }).catch(err => {
            console.error("Erreur lors de la récupération des badges:", err);
        });
    }
});

async function fetchDataInput(user) {
    // L'utilisateur est connecté, récupération des informations en base de données
    const userData = await getUserDocument(user.uid);
    //Affectation des infos aux inputs
    if (userData) {
        console.log(userData);
        document.getElementById("username").value = userData.username;
        document.getElementById("lastname").value = userData.nom;
        document.getElementById("firstname").value = userData.prenom;
    }
    document.getElementById("mail").value = user.email;
}
//Event listener pour update les infos
document
    .getElementById("buttonUpdateInfos")
    .addEventListener("click", updateUserInfos);
//Event listener pour update le mail
// document
//     .getElementById("buttonUpdateMail")
//     .addEventListener("click", updateMail);
//Event listener pour update le pwd
document
    .getElementById("buttonUpdatePassword")
    .addEventListener("click", updatePwd);

function updatePwd() {
    //Check si les deux champs sont pas vides et identiques
    const currentPassword = document.getElementById("currentPassword").value;
    const pwd = document.getElementById("password").value;
    const confirmPwd = document.getElementById("confirmPassword").value;
    const mail = document.getElementById("mail").value;
    if (pwd == "" || confirmPwd == "") {
        Swal.fire({
            title: "Attention, un champ est vide.",
            icon: "error",
        });
        return;
    }

    if (pwd != confirmPwd) {
        Swal.fire({
            title: "Les deux mots de passe sont différents.",
            icon: "error",
        });
        return;
    }
    updateUserPassword(mail, currentPassword, pwd);
}

export function updateUserInfos() {
    const username = document.getElementById("username").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const userId = userid;

    if (username == "" || firstname == "" || lastname == "") {
        Swal.fire({
            title: "Attention, un champ est vide.",
            icon: "error",
        });
        return;
    }
    const updatedFields = {
        username: username,
        prenom: firstname,
        nom: lastname,
    };
    const booleanReturn = updateUserDocument(userId, updatedFields);
    if (booleanReturn) {
        document.getElementById("messageInfosDiv").innerHTML =
            "<p>Informations mises à jour avec succès.</p>";
    }
}

async function reauthenticateUser(email, currentPassword) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        const credential = EmailAuthProvider.credential(email, currentPassword);
        try {
            await reauthenticateWithCredential(user, credential);
            console.log("Utilisateur ré-authentifié avec succès.");
            return true;
        } catch (error) {
            console.error("Erreur lors de la ré-authentification :", error);
            return false;
        }
    } else {
        console.error("Aucun utilisateur connecté.");
        return false;
    }
}

// Fonction pour mettre à jour le mot de passe de l'utilisateur
async function updateUserPassword(email, currentPassword, newPassword) {
    const auth = getAuth();
    const user = auth.currentUser;
    //window.userConnected;

    if (user) {
        const reauthenticated = await reauthenticateUser(
            email,
            currentPassword
        );
        if (!reauthenticated) {
            console.log(
                "Impossible de mettre à jour le mot de passe sans ré-authentification."
            );
            return;
        }
        try {
            //await updatePassword(user, newPassword);
            await updatePassword(user, newPassword).then(() => {
                console.log("Mot de passe mis à jour avec succès !");
                document.getElementById("messagePwdDiv").innerHTML =
                    "<p>Mot de passe mis à jour avec succès.</p>";
                // Déconnecter l'utilisateur pour rafraîchir la session
                signOut(auth);
                alert(
                    "Votre mot de passe a été mis à jour. Veuillez vous reconnecter."
                );
                window.location.href = "auth-page.html";
            });
            // console.log("Mot de passe mis à jour avec succès !");
            // document.getElementById("messagePwdDiv").innerHTML =
            //     "<p>Mot de passe mis à jour avec succès.</p>";
            // // Déconnecter l'utilisateur pour rafraîchir la session
            // await signOut(auth);
            // alert(
            //     "Votre mot de passe a été mis à jour. Veuillez vous reconnecter."
            // );
            // window.location.href = "auth-page.html";
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                console.error(
                    "L'utilisateur doit se reconnecter pour mettre à jour son mot de passe."
                );

                // Déconnecter l'utilisateur
                await signOut(auth);
                // Rediriger vers la page de connexion
                window.location.href = "auth-page.html";
            } else {
                console.error(
                    "Erreur lors de la mise à jour du mot de passe :",
                    error
                );
            }
        }
    } else {
        console.error("Aucun utilisateur connecté.");
    }
}

async function getBadgesForUser(user_uid) {

    // 1. Récupérer les `badge_uid` de l'utilisateur dans la collection 'obtention'
    const obtenusRef = collection(db, "obtention");
    const q = query(obtenusRef, where("user_Uid", "==", user_uid));
    const obtenusSnapshot = await getDocs(q);
    
    // Créer une liste pour stocker les badges obtenus
    const badgeUids = [];
    
    obtenusSnapshot.forEach(doc => {
      const badgeUid = doc.data().badge_Uid;

      // Vérifier que `badge_uid` existe et est un nombre
      if (badgeUid != null && !isNaN(badgeUid)) {
        badgeUids.push(String(badgeUid));  // Convertir `badge_uid` en chaîne de caractères
      } else {
        console.log(`Badge UID invalide pour le document ${doc.id}: ${badgeUid}`);
      }
    });

    console.log(badgeUids);
  
    // 2. Récupérer les informations des badges à partir de la collection 'badge'
    const badges = [];
    for (const badge_uid of badgeUids) {
      const badgeRef = doc(db, "badge", badge_uid);
      const badgeSnapshot = await getDoc(badgeRef);
      
      if (badgeSnapshot.exists()) {
        const badgeData = badgeSnapshot.data();
        badges.push({
          badge_uid: badge_uid,
          nom: badgeData.nom,
          description: badgeData.description,
        });
      }
    }
  
    displayBadges(badges);
}

function displayBadges(badges) {
  const badgesContainer = document.getElementById("badgesContainer"); // Le conteneur HTML où vous voulez afficher les badges

  // Effacer le contenu existant avant d'ajouter les nouveaux badges
  badgesContainer.innerHTML = '';

  badges.forEach(badge => {
    // Conteneur principal pour chaque badge
    const badgeElement = document.createElement('div');
    badgeElement.classList.add('badge-item', 'flex', 'flex-col', 'items-center', 'space-y-4', 'my-4');

    // Conteneur pour l'image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add("w-44", "h-44", "bg-gray-300", "rounded-full", "overflow-hidden", "border-4", "border-white", "shadow-lg");

    // Image du badge
    const badgeImage = document.createElement('img');
    badgeImage.src = `badge.png`;  // Utiliser `badge_uid` pour le `src` de l'image
    badgeImage.alt = `Badge ${badge.nom}`;
    badgeImage.classList.add("w-full", "h-full", "object-cover");

    imageContainer.appendChild(badgeImage);

    // Conteneur pour le nom et la description
    const badgeInfo = document.createElement('div');
    badgeInfo.classList.add("badge-info", "text-center");

    const badgeName = document.createElement('h3');
    badgeName.textContent = badge.nom;
    badgeName.classList.add("text-lg", "font-semibold", "text-gray-800");

    const badgeDescription = document.createElement('p');
    badgeDescription.textContent = badge.description;
    badgeDescription.classList.add("text-sm", "text-gray-600");

    badgeInfo.appendChild(badgeName);
    badgeInfo.appendChild(badgeDescription);

    // Ajouter le conteneur d'image et d'informations dans l'élément principal
    badgeElement.appendChild(imageContainer);
    badgeElement.appendChild(badgeInfo);

    // Ajouter le badge au conteneur principal
    badgesContainer.appendChild(badgeElement);
  });
}

// Utiliser la fonction avec `userid`
getBadgesForUser(userid).then(badges => {
  console.log("Badges obtenus:", badges);
}).catch(err => {
  console.error("Erreur lors de la récupération des badges:", err);
});