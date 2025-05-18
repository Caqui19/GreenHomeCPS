import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";


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

const formConsumo = document.getElementById('formConsumo');

formConsumo.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Gera a data atual no formato "MM/YYYY"
  const dataAtual = new Date();
  const mes = `${String(dataAtual.getMonth() + 1).padStart(2, '0')}/${dataAtual.getFullYear()}`;

  const energia = document.getElementById('energia').value;
  const agua = document.getElementById('agua').value;
  const gas = document.getElementById('gas').value;
  const habitantes = document.getElementById('habitantes').value;

  const dadosRelatorio = {
    mes,
    energia,
    agua,
    gas,
    habitantes,
    timestamp: dataAtual
  };

  try {
    await addDoc(collection(db, "relatorios"), dadosRelatorio);
    alert('Dados salvos com sucesso');
    formConsumo.reset();
  } catch (error) {
    console.error("Erro ao salvar os dados", error);
    alert("Erro ao salvar os dados. Veja o console.");
  }
});

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "entrar.html";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("Erro ao sair da conta.");
    });
});
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in – redirect to login page
    window.location.href = "entrar.html"; // Change to your login page
  }
});