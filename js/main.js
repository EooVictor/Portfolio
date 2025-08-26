// ===== Preferência de tema =====
(function initTheme(){
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();
document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== Dados dos projetos =====
const projects = [
  {
    title: 'SuporteBot — Assistente de Suporte',
    year: 2025,
    description: 'Chatbot para suporte técnico construído por mim para acelerar o atendimento e padronizar respostas.',
    highlights: ['Arquitetura de KB + API', 'Busca por erros/integrações', 'Redução do tempo de atendimento'],
    tech: ['PHP', 'JSON'],
    tags: ['IA', 'Backend'],
    repo: 'https://github.com/EooVictor/SuporteBot'
  },
  {
    title: 'Portfólio — Site Pessoal',
    year: new Date().getFullYear(),
    description: 'Meu site pessoal, responsivo e acessível, feito com HTML, CSS e JS.',
    highlights: ['Design limpo e responsivo', 'Scroll suave e acessibilidade', 'Publicação fácil (GitHub Pages)'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    tags: ['Frontend'],
    repo: 'https://github.com/EooVictor/Portfolio'
  }
];

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'IA', label: 'IA' },
  { id: 'Backend', label: 'Back-end' },
  { id: 'Frontend', label: 'Front-end' }
];

// Render filtros
const filtersEl = document.getElementById('filters');
let activeFilter = 'all';
function renderFilters(){
  filtersEl.innerHTML = '';
  filters.forEach(f => {
    const btn = document.createElement('button');
    btn.className = 'filter' + (activeFilter === f.id ? ' active' : '');
    btn.textContent = f.label;
    btn.addEventListener('click', () => { activeFilter = f.id; renderFilters(); renderProjects(); });
    filtersEl.appendChild(btn);
  });
}

// Render cards de projetos
const grid = document.getElementById('projects-grid');
function renderProjects(){
  grid.innerHTML = '';
  projects
    .filter(p => activeFilter === 'all' || p.tags.includes(activeFilter))
    .forEach(p => {
      const card = document.createElement('article');
      card.className = 'card project';
      card.innerHTML = `
        <div class="meta">${p.year} • ${p.tags.map(t=>`<span class="badge-mini">${t}</span>`).join(' ')}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        ${p.highlights ? `<p class="muted" style="margin:8px 0 0;">${p.highlights.join(' • ')}</p>` : ''}
        <div class="badges">${p.tech.map(t=>`<span class="badge-mini">${t}</span>`).join('')}</div>
        <div class="links" style="margin-top:10px;">
          ${p.repo && p.repo !== '#' ? `<a class="btn ghost" href="${p.repo}" target="_blank" rel="noopener">Código</a>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });
}

renderFilters();
renderProjects();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Navegação com offset fixo do header =====
document.querySelectorAll('nav.navlinks a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 0;
      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      try { history.replaceState(null, '', '#' + id); } catch (_) {}
    }
  });
});

// ===== Avatar loader =====
// Tenta carregar assets/avatar.jpg; se falhar, mostra avatar SVG com iniciais VR
(function(){
  const box = document.querySelector('.avatar');
  if (!box) return;

  const img = new Image();
  img.src = 'assets/avatar.jpg?v=' + Date.now(); // evita cache ao trocar foto
  img.alt = 'Foto de Victor Raphael';
  img.className = 'avatar-img';
  img.onload = () => { box.innerHTML = ''; box.appendChild(img); };
  img.onerror = () => {
    box.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;border-radius:18px;">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--primary)"/>
            <stop offset="100%" stop-color="var(--accent)"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#g)"/>
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.30)" stroke-width="0.6"/>
        <text x="50" y="57" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial" font-weight="800" font-size="28" fill="rgba(20,28,45,.92)">VR</text>
      </svg>
    `;
  };
})();
