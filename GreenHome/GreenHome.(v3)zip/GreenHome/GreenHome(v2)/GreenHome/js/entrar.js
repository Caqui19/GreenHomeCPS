document.getElementById("voltar").addEventListener("click", function () {
    window.history.back();
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfc5XW-aiogrrxHm4PTdbBjMEDpJaRmWI",
    authDomain: "viridis-cd54a.firebaseapp.com",
    projectId: "viridis-cd54a",
    storageBucket: "viridis-cd54a.firebasestorage.app",
    messagingSenderId: "663953044856",
    appId: "1:663953044856:web:e47cc94ee8c4571966048d",
    measurementId: "G-HHQWCEZ8SZ"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const login = document.getElementById("Login");

login.addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));

            window.location.href = "index.html";

        }).catch((error) => {
            const errorMessage = error.message;
            alert('Login falhou:' + errorMessage)
        });

});









document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'visibility_off' : 'visibility';
        });
    });
});