/* ============ CONFIG ============ */
const API_BASE = '';  // same origin on Vercel

/* ============ STATE ============ */
let state = {
  view: 'home',
  videoUrl: '',
  videoInfo: null,
  itags: null
};

/* ============ STORAGE ============ */
const STORAGE_KEY = 'video_dl_history_web';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function addHistory(item) {
  const arr = getHistory();
  arr.push(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + units[i];
}

/* ============ ICONS ============ */
const ICON_DOWNLOAD = `
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v12M6 10l6 6 6-6M4 20h16"/>
  </svg>
`;

const ICON_EMPTY = `
  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <path fill="#D5D5DC" d="M25 65l35 17 35-17v35L60 117 25 100z"/>
    <path fill="#E8E8EE" d="M60 82l35-17v35L60 117z"/>
    <path fill="#F0F0F5" d="M25 65L10 55l50-20 35 15-35 32z"/>
    <path fill="#E8E8EE" d="M10 55l50-20 35 15-35 15z"/>
  </svg>
`;

const ICON_VIDEO_PLAY = `
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#1E2430" stroke-width="1.8">
    <circle cx="12" cy="12" r="10"/>
    <path fill="#1E2430" d="M10 8l6 4-6 4z"/>
  </svg>
`;

/* ============ VIEWS ============ */
function renderHome() {
  return `
    <div class="view">
      <h1 class="home-title">Video Downloader</h1>
      <p class="home-subtitle">Paste a video link to get started</p>

      <input
        id="urlInput"
        class="url-input"
        type="text"
        placeholder="Paste video URL"
        value="${state.videoUrl || ''}"
      />

      <div class="btn-row">
        <button class="btn btn-dark" id="btnPaste">Paste</button>
        <button class="btn btn-primary" id="btnDownload">Download</button>
      </div>
    </div>
  `;
}

function renderResult() {
  const info = state.videoInfo || {};
  const thumb = info.thumbnail || '';
  const title = info.title || 'Loading...';
  const desc = info.description || '';

  return `
    <div class="view">
      <h2 class="result-title">Video Downloader</h2>
      <p class="result-sub">Download videos without watermark</p>

      <div class="info-card">
        <div class="thumb-wrapper">
          <img id="thumbImg" src="${thumb}" alt="thumbnail"
               onerror="this.style.opacity=0.2" />
          <div class="thumb-spinner" id="thumbSpinner"></div>
        </div>
        <div class="info-text">
          <p class="info-title">${escapeHtml(title)}</p>
          <p class="info-desc">${escapeHtml(desc)}</p>
        </div>
      </div>

      <button class="result-btn" data-type="MP4_360">${ICON_DOWNLOAD} Download MP4 [1] 360p</button>
      <button class="result-btn" data-type="MP4_480">${ICON_DOWNLOAD} Download MP4 [2] 480p</button>
      <button class="result-btn" data-type="MP4_HD">${ICON_DOWNLOAD} Download MP4 HD</button>
      <button class="result-btn" data-type="MP3">${ICON_DOWNLOAD} Download MP3</button>
      <button class="result-btn dark" id="btnMore">Download more videos</button>

      <div class="progress-area" id="progressArea">
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <p class="progress-status" id="progressStatus">0%</p>
      </div>
    </div>
  `;
}

function renderDownloads() {
  const items = getHistory().reverse();

  if (!items.length) {
    return `
      <div class="view">
        <div class="downloads-header">Downloads</div>
        <div class="empty-state">
          ${ICON_EMPTY}
          <span>No downloads yet</span>
        </div>
      </div>
    `;
  }

  const cards = items.map((item, i) => `
    <div class="download-card" data-index="${i}">
      ${ICON_VIDEO_PLAY}
      <div class="download-info">
        <p class="download-name">${escapeHtml(item.title)}</p>
        <p class="download-meta">${item.type} • ${formatSize(item.size || 0)}</p>
      </div>
    </div>
  `).join('');

  return `
    <div class="view" style="padding:0;">
      <div class="downloads-header">Downloads</div>
      <div class="downloads-list">${cards}</div>
    </div>
  `;
}

function renderProfile() {
  return `
    <div class="view" style="padding:0 0 40px;">
      <div class="profile-gradient"></div>
      <div class="section-title">Settings</div>
      <div class="setting-row" id="clearBtn">Clear download history</div>
      <div class="setting-row">Version 1.0.0 (Web)</div>
      <div class="setting-row">Powered by yt-dlp web</div>
    </div>
  `;
}

function renderApps() {
  return `
    <div class="view">
      <h1 class="home-title">More Apps</h1>
      <p class="home-subtitle">Coming soon…</p>
    </div>
  `;
}

/* ============ HELPERS ============ */
function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

/* ============ ROUTER ============ */
function navigate(view) {
  state.view = view;

  // Update navbar
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });

  // Render view
  const content = document.getElementById('content');
  switch (view) {
    case 'home':      content.innerHTML = renderHome();      bindHome();      break;
    case 'result':    content.innerHTML = renderResult();    bindResult();    break;
    case 'downloads': content.innerHTML = renderDownloads(); bindDownloads(); break;
    case 'profile':   content.innerHTML = renderProfile();   bindProfile();   break;
    case 'apps':      content.innerHTML = renderApps();                        break;
  }
  content.scrollTop = 0;
}

/* ============ EVENT BINDINGS ============ */
function bindHome() {
  const input = document.getElementById('urlInput');
  const btnPaste = document.getElementById('btnPaste');
  const btnDownload = document.getElementById('btnDownload');

  input.addEventListener('input', () => { state.videoUrl = input.value; });

  btnPaste.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      state.videoUrl = text;
    } catch {
      showToast('Clipboard access denied');
    }
  });

  btnDownload.addEventListener('click', async () => {
    const url = input.value.trim();
    if (!url) return showToast('Paste link first');

    state.videoUrl = url;
    state.videoInfo = null;
    state.itags = null;
    navigate('result');

    try {
      const res = await fetch(`${API_BASE}/api/info?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Failed to fetch');

      state.videoInfo = {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        duration: data.duration,
        uploader: data.uploader
      };
      state.itags = data.itags;
      updateResultInfo();
    } catch (err) {
      showToast(err.message);
      document.getElementById('progressStatus').textContent = 'Error: ' + err.message;
    }
  });
}

function updateResultInfo() {
  const info = state.videoInfo;
  if (!info) return;
  const titleEl = document.querySelector('.info-title');
  const descEl  = document.querySelector('.info-desc');
  const img     = document.getElementById('thumbImg');
  const spinner = document.getElementById('thumbSpinner');

  if (titleEl) titleEl.textContent = info.title;
  if (descEl)  descEl.textContent = info.description || '';
  if (img && info.thumbnail) {
    img.src = info.thumbnail;
    img.onload = () => spinner?.remove();
    img.onerror = () => spinner?.remove();
  } else {
    spinner?.remove();
  }
}

function bindResult() {
  document.querySelectorAll('.result-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => startDownload(btn.dataset.type));
  });

  document.getElementById('btnMore')?.addEventListener('click', () => {
    state.videoUrl = '';
    state.videoInfo = null;
    navigate('home');
  });
}

async function startDownload(type) {
  if (!state.videoInfo) return showToast('Video info not loaded yet');
  const itag = state.itags?.[type];
  if (!itag) return showToast('Format not available');

  const area = document.getElementById('progressArea');
  const fill = document.getElementById('progressFill');
  const status = document.getElementById('progressStatus');

  area.classList.add('visible');
  fill.style.width = '0%';
  status.textContent = 'Starting…';

  document.querySelectorAll('.result-btn').forEach(b => b.disabled = true);

  const dlUrl = `${API_BASE}/api/download?url=${encodeURIComponent(state.videoUrl)}&itag=${encodeURIComponent(itag)}`;

  try {
    status.textContent = 'Downloading…';

    const response = await fetch(dlUrl);
    if (!response.ok) throw new Error('Download failed');

    const contentLength = +response.headers.get('Content-Length') || 0;
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;

      if (contentLength) {
        const pct = Math.round((received / contentLength) * 100);
        fill.style.width = pct + '%';
        status.textContent = pct + '%';
      } else {
        status.textContent = formatSize(received);
      }
    }

    // Build blob and trigger download
    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ext = type === 'MP3' ? 'mp3' : 'mp4';
    const safeTitle = (state.videoInfo.title || 'video').replace(/[^\w\s.-]/g, '').slice(0, 80);
    a.href = url;
    a.download = `${safeTitle}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    status.textContent = 'Done ✅';
    showToast('Saved!');

    addHistory({
      title: safeTitle + '.' + ext,
      type: type,
      size: blob.size,
      timestamp: Date.now()
    });
  } catch (err) {
    status.textContent = 'Error ❌ ' + err.message;
    showToast('Download failed: ' + err.message);
  } finally {
    document.querySelectorAll('.result-btn').forEach(b => b.disabled = false);
  }
}

function bindDownloads() {
  document.querySelectorAll('.download-card').forEach(card => {
    card.addEventListener('click', () => {
      showToast('File already downloaded on device');
    });
  });
}

function bindProfile() {
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    clearHistory();
    showToast('History cleared');
    navigate('downloads');
  });
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.view));
  });
  navigate('home');
});
