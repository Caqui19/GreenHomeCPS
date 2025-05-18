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

const logoutButton2 = document.getElementById("logout2");
const logoutButton = document.getElementById("logout");
const emailElem = document.getElementById("email");
const usernameElem = document.getElementById("username");
const statusElem = document.getElementById("status");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          usernameElem.textContent = userData.displayName;
          emailElem.textContent = userData.email;
        } else {
          alert("No user data found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Falha ao obter os dados do usuário.");
      });

    const relatoriosRef = collection(db, "relatorios");
    const q = query(relatoriosRef, orderBy("timestamp", "desc"), limit(1));

    getDocs(q)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          statusElem.textContent = "Nenhum dado de consumo disponível.";
          statusElem.style.color = "gray";
          return;
        }

        const data = querySnapshot.docs[0].data();

        const limites = {
          energia: 100,
          agua: 40,
          gas: 30
        };

        // Função para determinar status e cores
        function avaliarConsumo(valor, limite) {
          if (valor <= limite) {
            return { status: "normal", cor: "#66bb6a", texto: "Uso Saudável" }; // verde suave
          } else if (valor <= limite * 1.2) {
            return { status: "elevado", cor: "#ffb74d", texto: "Uso Elevado" }; // laranja suave
          } else {
            return { status: "alto", cor: "#ef5350", texto: "Uso Alto" }; // vermelho suave
          }
        }

        const energia = avaliarConsumo(data.energia, limites.energia);
        const agua = avaliarConsumo(data.agua, limites.agua);
        const gas = avaliarConsumo(data.gas, limites.gas);

        const acimaLimite =
          [energia.status, agua.status, gas.status].filter(s => s !== "normal").length;

        // Status geral
        let statusGeral = "";
        let corPrincipal = "";

        if (acimaLimite === 0) {
          statusGeral = "🟢 Uso Saudável";
          corPrincipal = "green";
        } else if (acimaLimite === 1) {
          statusGeral = "🟠 Uso Elevado";
          corPrincipal = "orange";
        } else {
          statusGeral = "🔴 Uso Alto";
          corPrincipal = "red";
        }

        statusElem.innerHTML = `
          <div style="color: ${corPrincipal}; font-weight: bold; margin-bottom: 6px;">${statusGeral}</div>
          <div style="color: ${energia.cor};">Energia: ${energia.texto}</div>
          <div style="color: ${agua.cor};">Água: ${agua.texto}</div>
          <div style="color: ${gas.cor};">Gás: ${gas.texto}</div>
        `;
      })
      .catch((error) => {
        console.error("Erro ao obter relatório:", error);
        statusElem.textContent = "Erro ao obter status";
        statusElem.style.color = "gray";
      });
  } else {
    window.location.href = "entrar.html";
  }
});
 
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
logoutButton2.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "esqueceuSenha.html";
    })
    .catch((error) => {
      console.error("Error logging out:", error);
      alert("Erro ao sair da conta.");
    });
});