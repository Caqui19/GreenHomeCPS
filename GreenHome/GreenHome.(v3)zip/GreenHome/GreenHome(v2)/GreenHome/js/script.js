import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
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
