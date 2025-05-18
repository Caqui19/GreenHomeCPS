document.getElementById("voltar").addEventListener("click", function () {
    window.history.back();
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();

  if (!email) {
    alert("Por favor, insira seu e-mail.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Um e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada.");
    window.location.href = "entrar.html";
  } catch (error) {
    console.error(error);
    alert("Erro ao enviar e-mail de redefinição. Verifique o endereço de e-mail e tente novamente.");
  }
});
