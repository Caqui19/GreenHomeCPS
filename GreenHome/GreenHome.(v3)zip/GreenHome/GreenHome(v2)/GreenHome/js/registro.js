document.getElementById("voltar").addEventListener("click", function () {
    window.history.back();
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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
const db = getFirestore(app);


const submit = document.getElementById("submit");

submit.addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordconf = document.getElementById("passwordconf").value;
    if (password == passwordconf) {
        createUserWithEmailAndPassword(auth, email, password, username)
            .then((userCredential) => {
                const user = userCredential.user;
                setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    uid: user.uid,
                    senha: password,
                    displayName: username

                }).then(() => {
                    window.location.href = "entrar.html";

                });
            })

            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
                // ..
            });
    }
    else {
        alert("As senhas devem ser iguais")
    }
})
