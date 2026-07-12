// ==========================================
// STATE MANAGEMENT & DATA TUGAS (HARDCODE)
// ==========================================
let isOwner = false;
let currentFilter = 'semua';
let db;

// MASUKKAN DATA HARDCODE TUGASMU DI SINI
let tugasList = [
  { 
    id: 1, 
    title: 'Tugas 1 Riset Operasi', 
    category: 'tugas', 
    subject: 'Riset Operasi', 
    desc: 'Penyelesaian masalah minimasi biaya pupuk menggunakan uji titik pojok.', 
    date: '2026-05-02', 
    ext: 'GDRIVE', 
    content: 'Tugas',
    // MASUKKAN LINK GOOGLE DRIVE ASLI DI SINI
    fileData: 'https://drive.google.com/file/d/1jt8yj1xnBwscnMEK_bDb93BPUg_cz_e2/view?usp=sharing'
  },
  { 
    id: 2, 
    title: 'Tugas 2 Riset Operasi', 
    category: 'tugas', 
    subject: 'Riset Operasi', 
    desc: 'Proses uji coba kombinasi nilai untuk mencari hasil maksimal fungsi tujuan berdasarkan tiga syarat batasan.', 
    date: '2026-05-02', 
    ext: 'GDRIVE', 
    content: 'Tugas',
    // MASUKKAN LINK GOOGLE DRIVE ASLI DI SINI
    fileData: 'https://docs.google.com/spreadsheets/d/1lxqnG97zCKuuwJmO0GSJVgBvPcv1TV80/edit?usp=sharing&ouid=109101057842769156796&rtpof=true&sd=true' 
  },
  { 
    id: 3, 
    title: 'Tugas 3 Riset Operasi', 
    category: 'tugas', 
    subject: 'Riset Operasi', 
    desc: 'Langkah-langkah penyelesaian dua soal program linear (maksimal) menggunakan tabel literasi simpleks.', 
    date: '2026-05-02', 
    ext: 'GDRIVE', 
    content: 'Tugas',
    // MASUKKAN LINK GOOGLE DRIVE ASLI DI SINI
    fileData: 'https://drive.google.com/file/d/1ExpcmzNqWqw6RUf2acThpJC3kodkRN5L/view?usp=sharing' 
  },
  { 
    id: 4, 
    title: 'Tugas 4 Riset Operasi', 
    category: 'tugas', 
    subject: 'Riset Operasi', 
    desc: 'Perhitungan alokasi biaya distribusi dari pabrik ke gudang menggunakan metode NWC dan MC.', 
    date: '2026-05-02', 
    ext: 'GDRIVE', 
    content: 'Tugas',
    // MASUKKAN LINK GOOGLE DRIVE ASLI DI SINI
    fileData: 'https://drive.google.com/file/d/1Ygd4PRIzcNi6fCKtxJfY8efbVktyO2OY/view?usp=sharing' 
  },
];

const OWNER_USER = 'Abiyyu';
const OWNER_PASS = 'Abiyyu123';

// ==========================================
// DATABASE INDEXED-DB (Untuk simpan input link via web)
// ==========================================
const dbRequest = indexedDB.open("PortfolioDB", 1);

dbRequest.onupgradeneeded = function(e) {
  db = e.target.result;
  if (!db.objectStoreNames.contains('tugasStore')) {
    db.createObjectStore('tugasStore', { keyPath: 'id' });
  }
};

dbRequest.onsuccess = function(e) {
  db = e.target.result;
  loadDataFromDB(); 
};

function loadDataFromDB() {
  const transaction = db.transaction(['tugasStore'], 'readonly');
  const store = transaction.objectStore('tugasStore');
  const request = store.getAll();

  request.onsuccess = function() {
    // Gabungkan data hardcode dengan data dari database lokal
    const dbData = request.result || [];
    // Filter agar tidak ada ID ganda
    const combinedData = [...tugasList];
    dbData.forEach(item => {
      if (!combinedData.find(t => t.id === item.id)) {
        combinedData.push(item);
      }
    });
    
    // Urutkan dari yang terbaru
    tugasList = combinedData.sort((a, b) => b.id - a.id);
    
    renderTugas();
    updateStatTugas();
  };
}

function saveDataToDB(tugasBaru) {
  const transaction = db.transaction(['tugasStore'], 'readwrite');
  const store = transaction.objectStore('tugasStore');
  store.add(tugasBaru);
}

function deleteDataFromDB(id) {
  const transaction = db.transaction(['tugasStore'], 'readwrite');
  const store = transaction.objectStore('tugasStore');
  store.delete(id);
}

// ==========================================
// SISTEM NAVIGASI & LOGIN
// ==========================================
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(a => a.classList.remove('active'));
  const currentNav = document.getElementById('nav-' + pageId);
  if(currentNav) currentNav.classList.add('active');

  pages.forEach(p => {
    if(p.classList.contains('active')) {
      p.style.opacity = '0';
      setTimeout(() => {
        p.classList.remove('active');
        p.style.opacity = ''; 
        const targetPage = document.getElementById(pageId);
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if(pageId === 'tugas') renderTugas();
        if(pageId === 'profil') updateStatTugas();
      }, 300);
    }
  });
}

function updateStatTugas() {
  const statEl = document.getElementById('statTugas');
  if(statEl) statEl.textContent = tugasList.length;
}

function openLogin() { 
  document.getElementById('loginModal').classList.add('open'); 
  document.getElementById('loginError').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

function closeLogin() { document.getElementById('loginModal').classList.remove('open'); }

function doLogin() {
  const u = document.getElementById('loginUser').value;
  const p = document.getElementById('loginPass').value;

  if(u === OWNER_USER && p === OWNER_PASS) {
    isOwner = true;
    closeLogin();
    document.getElementById('ownerBadge').classList.add('visible');
    document.getElementById('logoutBtn').classList.add('visible');
    document.getElementById('uploadToggleBtn').style.display = 'inline-block';
    
    const ownerSection = document.querySelector('.owner-login-section');
    if(ownerSection) ownerSection.style.display = 'none';

    showToast('Login Berhasil!', 'success');
    renderTugas();
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.querySelector('.modal').style.animation = 'shake 0.4s';
    setTimeout(() => document.querySelector('.modal').style.animation = '', 400);
  }
}

function logout() {
  isOwner = false;
  document.getElementById('ownerBadge').classList.remove('visible');
  document.getElementById('logoutBtn').classList.remove('visible');
  document.getElementById('uploadToggleBtn').style.display = 'none';
  
  const ownerSection = document.querySelector('.owner-login-section');
  if(ownerSection) ownerSection.style.display = 'block';

  showToast('Berhasil Logout.', '');
  renderTugas();
}

// ==========================================
// SISTEM INPUT LINK GOOGLE DRIVE
// ==========================================
function toggleUploadPanel() {
  const panel = document.getElementById('uploadPanel');
  panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

function submitUpload() {
  const title = document.getElementById('uploadTitle').value.trim();
  const cat = document.getElementById('uploadCategory').value;
  const subject = document.getElementById('uploadSubject').value.trim();
  const desc = document.getElementById('uploadDesc').value.trim();
  const link = document.getElementById('uploadLink').value.trim();

  // Validasi Input
  if (!title || !cat || !subject || !link) {
    showToast('⚠ Harap isi semua kolom, termasuk Link Google Drive!', 'error');
    return;
  }
  
  // Validasi format link sederhana
  if (!link.includes('http')) {
    showToast('⚠ Link tidak valid. Harus diawali http:// atau https://', 'error');
    return;
  }

  const now = new Date().toISOString().split('T')[0];

  // Siapkan objek data baru
  const tugasBaru = {
    id: Date.now(),
    title: title,
    category: cat,
    subject: subject,
    desc: desc || 'Tidak ada deskripsi tambahan.',
    date: now,
    ext: 'LINK',
    content: desc, // Konten diisi dengan deskripsi saja
    fileData: link // Diisi dengan link Google Drive
  };

  // Simpan ke Array & Database
  tugasList.unshift(tugasBaru);
  saveDataToDB(tugasBaru); 

  // Reset Form
  document.getElementById('uploadTitle').value = '';
  document.getElementById('uploadCategory').value = '';
  document.getElementById('uploadSubject').value = '';
  document.getElementById('uploadDesc').value = '';
  document.getElementById('uploadLink').value = ''; 

  document.getElementById('uploadPanel').style.display = 'none';
  renderTugas();
  updateStatTugas();
  showToast('✓ Tugas via Link berhasil disimpan!', 'success');
}

// ==========================================
// RENDER KARTU TUGAS & FILTER
// ==========================================
function renderTugas() {
  const grid = document.getElementById('tugasGrid');
  const filtered = currentFilter === 'semua' ? tugasList : tugasList.filter(t => t.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--muted); padding: 3rem;">Belum ada data tugas di kategori ini.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(t => `
    <div class="tugas-card">
      <div class="card-meta">
        <span class="cat-tag">${t.category.toUpperCase()}</span>
      </div>
      <h3 class="card-title">${t.title}</h3>
      <p class="card-desc">${t.desc}</p>
      
      <div style="font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem; display: flex; gap: 10px;">
        <span>📚 ${t.subject}</span> • <span>🔗 Eksternal Link</span>
      </div>

      <div class="card-actions">
        <button class="btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;" onclick="viewFile(${t.id})">Lihat Detail</button>
        ${isOwner ? `<button onclick="deleteFile(${t.id})" style="background:transparent; border:1px solid #ff5e5e; color:#ff5e5e; padding: 0.5rem 1rem; border-radius: 6px; cursor:pointer; transition: 0.3s;" onmouseover="this.style.background='rgba(255,94,94,0.1)'" onmouseout="this.style.background='transparent'">Hapus</button>` : ''}
      </div>
    </div>
  `).join('');
}

function filterTugas(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  const grid = document.getElementById('tugasGrid');
  grid.style.opacity = '0';
  setTimeout(() => {
    renderTugas();
    grid.style.opacity = '1';
    grid.style.transition = 'opacity 0.4s ease';
  }, 200);
}

// ==========================================
// VIEWER MODAL & ACTION LINK
// ==========================================
function viewFile(id) {
    const t = tugasList.find(x => x.id === id);
    if(!t) return;
    document.getElementById('viewerTitle').textContent = t.title;
    
    // Tombol untuk membuka link Google Drive
    let actionBtn = '';
    if (t.fileData && t.fileData.includes('http')) {
      actionBtn = `<a href="${t.fileData}" target="_blank" class="btn-primary" style="text-decoration:none; display:inline-block; margin-top: 1rem; padding: 0.6rem 1.2rem;">🔗 Buka File di Google Drive</a>`;
    }

    document.getElementById('viewerBody').innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <strong style="color: white;">Mata Kuliah:</strong> ${t.subject} <br>
      </div>
      <div style="background: rgba(17,17,24,0.5); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(200,169,110,0.1); white-space: pre-wrap; margin-bottom: 1rem;">${t.desc}</div>
      ${actionBtn}
    `;
    document.getElementById('viewerModal').classList.add('open');
}

function closeViewer() { document.getElementById('viewerModal').classList.remove('open'); }

function deleteFile(id) {
  if(confirm("Apakah kamu yakin ingin menghapus tugas ini?")) {
    tugasList = tugasList.filter(t => t.id !== id);
    deleteDataFromDB(id);
    renderTugas();
    updateStatTugas();
    showToast('Tugas berhasil dihapus', 'success');
  }
}

// ==========================================
// UI UTILS & ANIMATED BACKGROUND
// ==========================================
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast'; 
  if(type) t.classList.add(`toast-${type}`);
  void t.offsetWidth; 
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function initBg() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particleCount = window.innerWidth < 768 ? 20 : 40; 
  particles = Array.from({length: particleCount}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3, 
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.5
  }));
}

function drawBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(200, 169, 110, 0.4)'; 
  particles.forEach((p, index) => {
    p.x += p.vx; p.y += p.vy;
    if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(200, 169, 110, ${0.15 - distance / 1000})`; 
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawBg);
}

window.addEventListener('resize', initBg);
initBg();
drawBg();
renderTugas();
updateStatTugas();