import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    Timestamp,
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

//GET
export const getArticles = async () => {
    const articlesRef = collection(db, "articles");
    const querySnapshot = await getDocs(articlesRef);
    const articles = [];
    querySnapshot.forEach((doc) => {
        articles.push(doc.data());
    });
    return articles;
};

export async function getAllThemes() {
    const articlesCollection = collection(db, "articles"); // Remplacez "articles" par le nom de votre collection d'articles
    const snapshot = await getDocs(articlesCollection);

    // Utiliser un Set pour obtenir des thèmes uniques
    const themes = new Set();

    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.theme) {
            themes.add(data.theme); // Ajoute le thème à l'ensemble (Set)
        }
    });

    // Convertir l'ensemble en tableau
    return Array.from(themes);
}

export async function getAllArticleByTheme(theme) {
    const articlesCollection = collection(db, "articles"); // Remplacez "articles" par le nom de votre collection
    const q = query(articlesCollection, where("theme", "==", theme)); // Filtre les articles avec le thème spécifié

    try {
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.log("Aucun article trouvé pour ce thème.");
            return false;
        } else {
            const articles = [];
            snapshot.forEach((doc) => {
                articles.push({ id: doc.id, ...doc.data() });
            });
            return articles;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
    }
}

//INSERT
export async function insertArticle(article) {
    try {
        // Référence vers la collection "articles" dans Firestore
        const docRef = await addDoc(collection(db, "articles"), {
            contenu: article.contenu,
            theme: article.theme,
            titre: article.titre,
            createdAt: new Date(), // Ajoute un timestamp de création
        });

        console.log("Article ajouté avec l'ID :", docRef.id);
        return docRef.id; // Retourne l'ID du document ajouté
    } catch (e) {
        console.error("Erreur lors de l'ajout de l'article :", e);
        return false;
    }
}
