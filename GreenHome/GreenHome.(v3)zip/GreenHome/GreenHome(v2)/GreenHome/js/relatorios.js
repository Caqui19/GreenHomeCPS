import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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

function gerarAnalise(dados) {
  return `
    <p><strong>Consumo de Energia:</strong> ${dados.energia} kWh. A energia consumida está dentro da média recomendada para uma residência econômica.</p><br>
    <p><strong>Consumo de Água:</strong> ${dados.agua} m³. O consumo de água pode ser melhorado com práticas de economia, como reduzir o tempo no banho.</p><br>
    <p><strong>Consumo de Gás:</strong> ${dados.gas} m³. O uso do gás está adequado, mas sempre vale revisar vazamentos e aparelhos eficientes.</p>
  `;
}

function criarGraficoPizza(ctx, dados) {
  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Energia (kWh)', 'Água (m³)', 'Gás (m³)'],
      datasets: [{
        data: [dados.energia, dados.agua, dados.gas],
        backgroundColor: ['#4caf50', '#2196f3', '#ffc107'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}

async function carregarDados() {
  const resultadosDiv = document.querySelector('.analise');
  const recomendacoesDiv = document.querySelector('.recomendacoes');
  const buttons = document.querySelectorAll('.buttons button');
  const ctx = document.getElementById('graficoPizza').getContext('2d');

  // Consulta para pegar o último documento salvo (mais recente pelo timestamp)
  const relatoriosRef = collection(db, "relatorios");
  const q = query(relatoriosRef, orderBy("timestamp", "desc"), limit(1));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    resultadosDiv.innerHTML = '<p>Nenhum dado de relatório encontrado. Preencha os formulários na página Home.</p>';
    recomendacoesDiv.innerHTML = `<p>Nenhum dado encontrado para gerar recomendações.</p>`;
    return;
  }

  // Pega o dado do documento mais recente
  const docData = querySnapshot.docs[0].data();

  // Monta dados históricos (pode ajustar conforme seus dados)
  const dadosHistoricos = {
    meses: ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'],
    energia: [100, 110, 120, 115, 125, Number(docData.energia)],
    agua: [40, 42, 45, 43, 44, Number(docData.agua)],
    gas: [30, 32, 34, 33, 35, Number(docData.gas)]
  };

  let chart = criarGraficoPizza(ctx, docData);

  resultadosDiv.innerHTML = `
    <h2>Análise do consumo de ${docData.mes || 'mês atual'}</h2>
    <p><strong>Energia:</strong> ${docData.energia} kWh</p>
    <p><strong>Água:</strong> ${docData.agua} litros</p>
    <p><strong>Gás:</strong> ${docData.gas} kg/m³</p>
    <p><strong>Número de moradores:</strong> ${docData.habitantes}</p>
    <hr>
    <p>A média de consumo por morador é:</p>
    <ul>
      <li>Energia: ${(docData.energia / docData.habitantes).toFixed(2)} kWh</li>
      <li>Água: ${(docData.agua / docData.habitantes).toFixed(2)} litros</li>
      <li>Gás: ${(docData.gas / docData.habitantes).toFixed(2)} kg/m³</li>
    </ul>
  `;

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      chart.destroy();
      if (i === 0) {
        chart = criarGraficoPizza(ctx, docData);
        resultadosDiv.innerHTML = `
          <h2>Análise do consumo para ${docData.mes || 'mês atual'}</h2>
          <p><strong>Energia:</strong> ${docData.energia} kWh</p>
          <p><strong>Água:</strong> ${docData.agua} litros</p>
          <p><strong>Gás:</strong> ${docData.gas} kg/m³</p>
          <p><strong>Número de moradores:</strong> ${docData.habitantes}</p>
          <hr>
          <p>A média de consumo por morador é:</p>
          <ul>
            <li>Energia: ${(docData.energia / docData.habitantes).toFixed(2)} kWh</li>
            <li>Água: ${(docData.agua / docData.habitantes).toFixed(2)} litros</li>
            <li>Gás: ${(docData.gas / docData.habitantes).toFixed(2)} kg/m³</li>
          </ul>
        `;
      } else {
        chart = criarGraficoLinha(ctx, dadosHistoricos);
      }
    });
  });

  // Regras para recomendações
  const limites = {
    energia: 100,
    agua: 40,
    gas: 30
  };

  const recomendacoes = [];

  if (docData.energia > limites.energia) {
    recomendacoes.push(`O consumo de energia está acima do ideal (${docData.energia} kWh). Considere desligar aparelhos quando não estiverem em uso e investir em aparelhos mais eficientes.`);
  } else {
    recomendacoes.push(`O consumo de energia está dentro do esperado. Continue mantendo bons hábitos.`);
  }

  if (docData.agua > limites.agua) {
    recomendacoes.push(`<br>O consumo de água está alto (${docData.agua} litros). Tente reduzir o tempo do banho e evite desperdício durante a lavagem de louça.`);
  } else {
    recomendacoes.push(`<br>O consumo de água está dentro do esperado. Continue mantendo bons hábitos.`);
  }

  if (docData.gas > limites.gas) {
    recomendacoes.push(`<br>O consumo de gás está elevado (${docData.gas} kg/m³). Verifique possíveis vazamentos e a eficiência dos seus aparelhos.`);
  } else {
    recomendacoes.push(`<br>O consumo de gás está dentro do esperado. Continue mantendo bons hábitos.`);
  }

  if (docData.energia > limites.energia || docData.agua > limites.agua || docData.gas > limites.gas) {
    recomendacoes.push(`<br><strong>Para mais dicas e ideias de economia, visite a aba <a href="../html/ideias.html">Ideias</a>.</strong>`);
  }

  recomendacoesDiv.innerHTML = recomendacoes.map(r => `<p>${r}</p>`).join('');
}

// Chama a função quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  carregarDados().catch(err => {
    console.error("Erro ao carregar dados", err);
    const resultadosDiv = document.querySelector('.analise');
    const recomendacoesDiv = document.querySelector('.recomendacoes');
    resultadosDiv.innerHTML = `<p>Erro ao carregar dados. Veja o console.</p>`;
    recomendacoesDiv.innerHTML = `<p>Erro ao carregar dados. Veja o console.</p>`;
  });
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