// Rejestracja Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker zarejestrowany', reg))
      .catch(err => console.error('Błąd rejestracji SW', err));
  });
}

// ── Logika SPA ────────────────────────────────────────

const pageUrls = {
  about:   '#about',
  contact: '#contact',
  gallery: '#gallery'
};

function renderFromHash() {
  const hash = window.location.hash || '#about';

  if      (hash === pageUrls.contact) renderContact();
  else if (hash === pageUrls.gallery) renderGallery();
  else                                renderAbout();
}

function renderAbout() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">O mnie</h1>
    <p>To jest prosta aplikacja PWA stworzona na laboratorium 3.</p>
    <p>Działa offline dzięki Service Worker i może być zainstalowana na telefonie.</p>
  `;
}

function renderContact() {
  document.querySelector('main').innerHTML = `
    <h1 class="title">Kontakt</h1>
    <form id="contact-form">
      <label for="name">Imię i nazwisko</label>
      <input type="text" id="name" required>
      <div class="error" id="name-error"></div>

      <label for="email">Email</label>
      <input type="email" id="email" required>
      <div class="error" id="email-error"></div>

      <label for="message">Wiadomość</label>
      <textarea id="message" required rows="5"></textarea>
      <div class="error" id="message-error"></div>

      <button type="submit">Wyślij</button>
    </form>
  `;

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm()) {
        alert('Wiadomość wysłana (test – bez backendu)');
        form.reset();
      }
    });
  }
}

function validateForm() {
  let valid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();

  document.querySelectorAll('.error').forEach(el => el.textContent = '');

  if (name.length < 2) { document.getElementById('name-error').textContent = 'Min. 2 znaki'; valid = false; }
  if (!email.includes('@')) { document.getElementById('email-error').textContent = 'Nieprawidłowy email'; valid = false; }
  if (msg.length < 10) { document.getElementById('message-error').textContent = 'Min. 10 znaków'; valid = false; }

  return valid;
}

function renderGallery() {
  // Stałe zdjęcia z seedami – zawsze te same, różne dla każdego indeksu
  const images = Array.from({length: 9}, (_, i) => {
    const seed = 100 + i; // Stały seed dla powtarzalności
    return {
      thumb: `https://picsum.photos/seed/${seed}/400/300`,
      full:  `https://picsum.photos/seed/${seed}/1200/800`
    };
  });

  document.querySelector('main').innerHTML = `
    <h1 class="title">Galeria</h1>
    <div class="gallery">
      ${images.map((img, i) => `
        <img 
          src="${img.thumb}" 
          alt="Zdjęcie ${i+1}" 
          loading="lazy"
          onclick="openModal('${img.full}')"
        >
      `).join('')}
    </div>
    <div id="modal" class="modal" onclick="closeModal(event)">
      <span class="close" onclick="closeModal(event)">×</span>
      <img id="modal-img" src="" alt="Powiększone zdjęcie">
    </div>
  `;
}

function openModal(src) {
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-img').src = src;
}

function closeModal(e) {
  if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
    document.getElementById('modal').style.display = 'none';
  }
}

// Nawigacja hash
document.querySelectorAll('.header-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target.id.replace('-link', '');
    window.location.hash = target;
    document.title = target.charAt(0).toUpperCase() + target.slice(1);
  });
});

window.addEventListener('hashchange', renderFromHash);
window.addEventListener('load', renderFromHash);

// Theme toggle
document.addEventListener('click', e => {
  if (e.target.id === 'theme-toggle') {
    document.body.classList.toggle('dark-mode');
  }
});