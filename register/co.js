// Functions to toggle between forms
function showSignUp() {
    document.getElementById('container').classList.add("right-panel-active");
}

function showSignIn() {
    document.getElementById('container').classList.remove("right-panel-active");
}

// Event listeners for desktop buttons
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', showSignUp);
signInButton.addEventListener('click', showSignIn);