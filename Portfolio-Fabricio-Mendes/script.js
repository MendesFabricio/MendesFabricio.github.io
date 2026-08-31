const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Header mais sólido conforme a página é rolada.
const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 24);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Adiciona animação de entrada aos elementos importantes sem poluir o HTML.
const revealGroups = [
  '.section-label',
  '.section-heading',
  '.info-card',
  '.project-card',
  '.experience-card',
  '.tags',
  '.contact-box'
];

const revealElements = document.querySelectorAll(revealGroups.join(','));

revealElements.forEach((element, index) => {
  element.classList.add('reveal');

  // Pequeno escalonamento somente entre elementos vizinhos.
  if (element.matches('.info-card, .project-card')) {
    const siblings = [...element.parentElement.children];
    const position = siblings.indexOf(element);
    element.style.setProperty('--reveal-delay', `${Math.max(position, 0) * 80}ms`);
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.10,
      rootMargin: '0px 0px -7% 0px'
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

// Destaca no menu a seção que está predominante na tela.
const navLinksBySection = new Map();
document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  if (id) navLinksBySection.set(id, link);
});

const sections = [...document.querySelectorAll('main section[id]')];

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const activeId = visible[0].target.id;
      navLinksBySection.forEach((link, id) => {
        link.classList.toggle('active', id === activeId);
      });
    },
    {
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: '-22% 0px -48% 0px'
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}
