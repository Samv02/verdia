let compteur = 0;
let timeLeft = 1000;
let score = 0

// Fonction pour mettre à jour le timer
function updateTimer() {
    // Calcul les secondes, dixièmes et centièmes
    const seconds = Math.floor((timeLeft % 6000) / 100);
    const tenths = Math.floor((timeLeft % 100) / 10);
    const hundredths = timeLeft % 10;

    // Formatage pour afficher les secondes et un chiffre pour dixièmes/centièmes
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedTenths = tenths.toString();
    const formattedHundredths = hundredths.toString();

    // Affichage du temps dans l'élément HTML avec l'id "timer"
    document.getElementById("timer").textContent = `${formattedSeconds}.${formattedTenths}${formattedHundredths}`;

    // Décrémenter le temps restant en centièmes de seconde
    timeLeft--;

    // Vérifier si le temps est écoulé
    if (timeLeft < 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = "Temps écoulé !";
    }
}

function stopTimer(verif) {
    clearInterval(timerInterval); // Arrêter le timer
    const currentTimerValue = document.getElementById("timer").textContent;
    alert(`Timer arrêté : ${currentTimerValue}`); // Afficher la valeur du timer
    if(verif){
        const score = Number(document.getElementById("score").textContent) + Math.round(currentTimerValue * 100);
        document.getElementById("score").textContent = score; 
    }
}

updateTimer();

// Mettre à jour le timer toutes les 10 ms (pour avoir les centièmes de seconde)
const timerInterval = setInterval(updateTimer, 10);
