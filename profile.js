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
    addDoc,
    query,
    orderBy,
    onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./script.js";
import { updateUserDocument, getUserDocument } from "./db/user.js";

const auth = getAuth();
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
        fetchDataInput(user);
        console.log(user);
        window.userConnected = user;
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
    document.getElementById("userId").value = user.uid;
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
    const userId = document.getElementById("userId").value;

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
