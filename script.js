
const BACKEND = "http://154.92.14.232:8080";

async function loadConfig() {
  try {
    const res = await fetch(`${BACKEND}/config`);
    const data = await res.json();
    document.getElementById("apiKey").value = data.api_key || "";
    document.getElementById("apiSecret").value = data.api_secret || "";
    document.getElementById("interval").value = data.fetch_interval_seconds || "";
    document.getElementById("dataSource").value = data.data_source || "free";
    renderSymbols(data.symbols || []);
    document.getElementById("status").textContent = "";
  } catch (err) {
    document.getElementById("status").textContent = "⚠️ 无法加载配置，请检查网络或服务器";
  }
}

function renderSymbols(symbols) {
  const tbody = document.querySelector("#symbolTable tbody");
  tbody.innerHTML = "";
  symbols.forEach(symbol => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${symbol}</td><td><button onclick="removeSymbol('${symbol}')">删除</button></td>`;
    tbody.appendChild(row);
  });
}

function addSymbol() {
  const input = document.getElementById("symbolInput");
  const symbol = input.value.trim().toUpperCase();
  if (!symbol) return;
  const rows = document.querySelectorAll("#symbolTable tbody tr");
  for (let row of rows) {
    if (row.children[0].textContent === symbol) return;
  }
  const row = document.createElement("tr");
  row.innerHTML = `<td>${symbol}</td><td><button onclick="removeSymbol('${symbol}')">删除</button></td>`;
  document.querySelector("#symbolTable tbody").appendChild(row);
  input.value = "";
}

function removeSymbol(symbol) {
  const rows = document.querySelectorAll("#symbolTable tbody tr");
  for (let row of rows) {
    if (row.children[0].textContent === symbol) row.remove();
  }
}

async function saveConfig() {
  const symbols = [...document.querySelectorAll("#symbolTable tbody tr")].map(row => row.children[0].textContent);
  const config = {
    api_key: document.getElementById("apiKey").value.trim(),
    api_secret: document.getElementById("apiSecret").value.trim(),
    symbols,
    fetch_interval_seconds: Number(document.getElementById("interval").value.trim()),
    data_source: document.getElementById("dataSource").value
  };
  try {
    await fetch(`${BACKEND}/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    document.getElementById("status").textContent = "✅ 配置已保存";
  } catch (err) {
    document.getElementById("status").textContent = "❌ 保存失败";
  }
}

loadConfig();
