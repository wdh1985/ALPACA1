
const API_BASE = 'http://154.92.14.232:8080';

async function loadConfig() {
  try {
    const res = await fetch(API_BASE + '/config');
    const config = await res.json();
    document.getElementById('api_key').value = config.api_key || '';
    document.getElementById('api_secret').value = config.api_secret || '';
    document.getElementById('fetch_interval').value = config.fetch_interval_seconds || '';
    document.getElementById('data_source').value = config.data_source || '';
    (config.symbols || []).forEach(sym => addSymbol(sym));
  } catch {
    document.getElementById('status').innerText = '⚠ 无法加载配置，请检查网络或服务器';
  }
}

function addSymbol(symbol) {
  const input = document.getElementById('new_symbol');
  const val = typeof symbol === 'string' ? symbol : input.value.trim();
  if (!val) return;
  const list = document.getElementById('symbol_list');
  const span = document.createElement('span');
  span.className = 'tag';
  span.innerText = val;
  span.onclick = () => list.removeChild(span);
  list.appendChild(span);
  if (!symbol) input.value = '';
}

async function saveConfig() {
  const symbols = Array.from(document.getElementById('symbol_list').children).map(x => x.innerText);
  const data = {
    api_key: document.getElementById('api_key').value.trim(),
    api_secret: document.getElementById('api_secret').value.trim(),
    fetch_interval_seconds: parseInt(document.getElementById('fetch_interval').value.trim()),
    data_source: document.getElementById('data_source').value,
    symbols
  };
  try {
    const res = await fetch(API_BASE + '/config', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const json = await res.json();
    document.getElementById('status').innerText = json.status === 'ok' ? '✅ 配置已保存' : '❌ 保存失败';
  } catch (e) {
    document.getElementById('status').innerText = '❌ 网络错误，保存失败';
  }
}

window.onload = loadConfig;
