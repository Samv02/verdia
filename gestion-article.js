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
    getAllThemes,
    getAllTheme,
    getAllArticleByTheme,
    insertArticle,
} from "./db/article.js";
import { getUserDocument } from "./db/user.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", initThemesDiv);

async function initThemesDiv() {
    // Appeler la fonction pour récupérer tous les thèmes
    const themesTableau = await getAllThemes();
    const themeTab = await getAllTheme();
    console.log(themeTab);

    //Construire les div pour chaque thème existant
    themeTab.forEach((theme) => {
        const conteneur = document.getElementById("conteneur");
        const div = document.createElement("div");
        div.classList.add(
            // "flex",
            // "flex-col",
            // "border",
            // "border-black-200",
            // "rounded-lg",
            // "p-4",
            // "m-2",
            // "hover:bg-green-300"
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
            "hover:shadow-2xl"
        );
        const img = document.createElement("img");
        img.classList.add("w-full", "object-cover");
        img.src =
            "https://images.partir.com/HlZJJUo6PASOAM-F_CMnsdLFQrE=/750x/filters:sharpen(0.3,0.3,true)/lieux-interet/nouvelle-caledonie/nouvelle-caledonie-lifou.jpg";
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
            clickOnTheme(theme);
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
            "border",
            "border-black-300",
            "rounded",
            "p-6",
            "mb-4"
        );
        articleConteneur.id = article.id;
        const titreArticle = document.createElement("h3");
        titreArticle.classList.add("text-2xl", "font-bold");
        titreArticle.innerText = article.titre;
        articleConteneur.appendChild(titreArticle);
        const paragrapheArticle = document.createElement("p");
        paragrapheArticle.innerText = article.contenu;
        articleConteneur.appendChild(paragrapheArticle);
        conteneur.appendChild(articleConteneur);
    });
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
    const allThemes = await getAllThemes();
    const optionDataList = allThemes
        .map((theme) => `<option value="${theme}"></option>`)
        .join("");

    const { value: formValues } = await Swal.fire({
        title: "Ajouter un article",
        width: "50%",
        html:
            `<input id="swal-input-theme" class="swal2-input w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400" placeholder="Thème" list="data">` +
            `<datalist id="data">${optionDataList}</datalist>` +
            `<input id="swal-input-title" class="swal2-input w-3/4" placeholder="Titre">` +
            `<textarea id="swal-input-content" class="swal2-textarea w-3/4" placeholder="Contenu" rows="4"></textarea>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Valider",
        preConfirm: () => {
            // Récupérer les valeurs des champs
            const theme = document.getElementById("swal-input-theme").value;
            const title = document.getElementById("swal-input-title").value;
            const content = document.getElementById("swal-input-content").value;

            // Validation : Vérifier que tous les champs sont remplis
            if (!theme || !title || !content) {
                Swal.showValidationMessage(
                    `Tous les champs doivent être remplis`
                );
                return false;
            }

            // Retourner les valeurs pour utilisation après la fermeture de la popup
            return { content, theme, title };
        },
    });

    // Si l'utilisateur a validé, afficher les données
    if (formValues) {
        const article = {
            contenu: formValues.content,
            theme: formValues.theme,
            titre: formValues.title,
        };
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
