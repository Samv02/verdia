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

import {
    //getAllThemes,
    getAllTheme,
    getAllArticleByTheme,
    insertArticle,
} from "./db/article.js";
import { getUserDocument } from "./db/user.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", initThemesDiv);

async function initThemesDiv() {
    // Appeler la fonction pour récupérer tous les thèmes
    //const themesTableau = await getAllThemes();
    const themeTab = await getAllTheme();
    console.log(themeTab);

    //Construire les div pour chaque thème existant
    themeTab.forEach((theme) => {
        const conteneur = document.getElementById("conteneur");
        const div = document.createElement("div");
        div.classList.add(
            "max-w-xs",
            "overflow-hidden",
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
        const img = document.createElement("img");
        img.classList.add("w-full", "object-cover");
        img.src = theme.image;
        img.alt = theme.nom;
        div.appendChild(img);
        const titre = document.createElement("div");
        titre.classList.add("px-6", "py-4");
        const h1 = document.createElement("h1");
        h1.classList.add("mb-2", "text-xl", "font-bold");
        h1.textContent = theme.nom;
        titre.appendChild(h1);
        div.appendChild(titre);
        conteneur.appendChild(div);

        // const p = document.createElement("p");
        // p.textContent = theme.nom;
        // div.appendChild(p);
        // conteneur.appendChild(div);

        //Ajout du listener sur la div
        div.addEventListener("click", function () {
            clickOnTheme(theme.nom);

            //Met le bg en blanc pour tous les enfants
            const allDiv = conteneur.querySelectorAll("div");
            allDiv.forEach((div) => {
                div.classList.remove("bg-green-200");
            });
            //Met le bg en vert pour le div cliqué
            div.classList.add("bg-green-200");
            conteneur.for;
        });
    });

    //Si l'utilisateur est admin, afficher bouton ajout article
    onAuthStateChanged(auth, async (user) => {
        //console.log(user.uid);
        const infos = await getUserDocument(user.uid);
        if (infos.isadmin) {
            document.getElementById("writeArticle").style.display = "block";
        } else {
            document.getElementById("writeArticle").style.display = "none";
        }
    });
}

async function clickOnTheme(theme) {
    const articles = await getAllArticleByTheme(theme);
    const conteneur = document.getElementById("conteneur-article");
    //Reinitialiser le conteneur d'article
    eraseArticleConteneur();
    //Construire les articles trouvés
    const titreTheme = document.getElementById("titre-theme");
    titreTheme.innerText = "Thème : " + theme;
    //conteneur.appendChild(titreTheme);
    articles.forEach((article) => {
        const articleConteneur = document.createElement("div");
        articleConteneur.classList.add(
            "relative",
            "border",
            "border-black-300",
            "rounded",
            "p-6",
            "m-4"
        );
        articleConteneur.id = article.id;
        const dateCreation = document.createElement("p");
        dateCreation.classList.add(
            "absolute",
            "top-4",
            "right-4",
            "text-sm",
            "font-bold",
            "pb-4"
        );

        // Récupération de la date et de l'heure
        const timestamp = article.createdAt;
        // Conversion en millisecondes
        const date = new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
        // Affiche la date et l'heure sous une forme lisible
        console.log(date.toLocaleString()); // Exemple : "11/6/2024, 12:32:16 PM"

        dateCreation.innerText =
            "Le " +
            date.toLocaleDateString() +
            " à " +
            date.toLocaleTimeString();
        articleConteneur.appendChild(dateCreation);
        const titreArticle = document.createElement("h3");
        titreArticle.classList.add("text-2xl", "font-bold", "pb-4");
        titreArticle.innerText = article.titre;
        articleConteneur.appendChild(titreArticle);
        const divParagraphe = document.createElement("div");
        divParagraphe.classList.add("space-y-4");
        //divParagraphe.classList.add("flex", "items-center");
        const imgArticle = document.createElement("img");
        imgArticle.classList.add(
            "float-right",
            "w-72",
            "h-auto",
            "ml-4",
            "mb-4",
            "rounded-lg",
            "shadow-lg"
        );
        imgArticle.src = article.image;
        imgArticle.alt = article.titre;
        const paragrapheArticle = document.createElement("p");
        paragrapheArticle.classList.add("text-base", "leading-relaxed");
        paragrapheArticle.innerText = article.contenu;
        divParagraphe.appendChild(imgArticle);
        divParagraphe.appendChild(paragrapheArticle);
        articleConteneur.appendChild(divParagraphe);
        //articleConteneur.appendChild(paragrapheArticle);
        const separateur = document.createElement("hr");
        separateur.classList.add(
            "border-t-2",
            "border-gray-300",
            "w-3/4",
            "mx-auto"
        );
        conteneur.appendChild(articleConteneur);
        conteneur.appendChild(separateur);
    });

    //Defiler vers la div de l'article
    const articleConteneur = document.getElementById("conteneur-article");
    articleConteneur.scrollIntoView({ behavior: "smooth" });
}

function eraseArticleConteneur() {
    const conteneur = document.getElementById("conteneur-article");
    while (conteneur.firstChild) {
        conteneur.removeChild(conteneur.firstChild);
    }
}

window.onscroll = function () {
    const button = document.getElementById("backToTopBtn");
    if (window.scrollY > 200) {
        // Si on a scrollé de plus de 200px
        button.classList.remove("hidden");
    } else {
        button.classList.add("hidden");
    }
};

document.getElementById("backToTopBtn").addEventListener("click", scrollToTop);

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("writeArticle").addEventListener("click", function () {
    showInputPopup();
});

// Fonction pour afficher la popup
async function showInputPopup() {
    const allThemes = await getAllTheme();
    console.log(allThemes);
    const optionDataList = allThemes
        .map((theme) => `<option value="${theme.nom}">${theme.nom}</option>`)
        .join("");

    const { value: formValues } = await Swal.fire({
        title: "Ajouter un article",
        width: "50%",
        html:
            // `<input id="swal-input-theme" class="swal2-input w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400" placeholder="Thème" list="data">` +
            // `<datalist id="data">${optionDataList}</datalist>` +
            `<label for="swal-input-theme">Choisir un thème:</label>` +
            `<select id="swal-input-theme" class="w-3/4 p-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out">${optionDataList}</select>` +
            `<input id="swal-input-title" class="swal2-input w-3/4" placeholder="Titre">` +
            `<textarea id="swal-input-content" class="swal2-textarea w-3/4" placeholder="Contenu" rows="4"></textarea>` +
            `<input id="swal-input-image" class="swal2-input w-3/4" placeholder="Lien image">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Valider",
        preConfirm: () => {
            // Récupérer les valeurs des champs
            const theme = document.getElementById("swal-input-theme").value;
            const title = document.getElementById("swal-input-title").value;
            const content = document.getElementById("swal-input-content").value;
            const image = document.getElementById("swal-input-image").value;

            // Validation : Vérifier que tous les champs sont remplis
            if (!theme || !title || !content || !image) {
                Swal.showValidationMessage(
                    `Tous les champs doivent être remplis`
                );
                return false;
            }

            // Retourner les valeurs pour utilisation après la fermeture de la popup
            return { content, theme, title, image };
        },
    });

    // Si l'utilisateur a validé, afficher les données
    if (formValues) {
        const article = {
            contenu: formValues.content,
            theme: formValues.theme,
            titre: formValues.title,
            image: formValues.image,
        };
        console.log(formValues.image);
        if (insertArticle(article)) {
            Swal.fire({
                icon: "success",
                title: "Article ajouté",
                text: `Thème : ${formValues.theme}, Titre : ${formValues.title}`,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Erreur dans l'ajout de l'article",
            });
        }
    }
}

//Afficher bouton en fonction utilisateur admin ou pas
