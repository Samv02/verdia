const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});



//JS Mobile
const signUpButton_mobile = document.getElementById('signUp_mobile');
const signInButton_mobile = document.getElementById('signIn_mobile');
const mediaQuery = window.matchMedia('(max-width: 1030px)');

function handleMediaQueryChange(e) {
    if (e.matches) {
        signUpButton_mobile.removeAttribute("hidden");
        signInButton_mobile.removeAttribute("hidden");
    } else {
        signUpButton_mobile.setAttribute("hidden", "");
        signInButton_mobile.setAttribute("hidden", "");
    }
}

handleMediaQueryChange(mediaQuery);
mediaQuery.addEventListener('change', handleMediaQueryChange);