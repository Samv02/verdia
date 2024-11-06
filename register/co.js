const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signInContainer = document.getElementById('id="signInContainer"');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


//JS Mobile
const signUpButton_mobile = document.getElementById('signUpMobile');
const signInButton_mobile = document.getElementById('signInMobile');
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

function slideToRegister(){
    signInContainer.classList.add("slideToLeft");
    
    signUpButton_mobile.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
}