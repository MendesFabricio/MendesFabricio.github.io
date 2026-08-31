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

const updateHeader = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 24);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealSelectors = [
  '.section-label',
  '.section-title',
  '.section-lead',
  '.about-copy',
  '.stack-card',
  '.project-card',
  '.experience-intro',
  '.process-item',
  '.contact-card'
];

const revealElements = document.querySelectorAll(revealSelectors.join(','));
revealElements.forEach((element) => element.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const linksBySection = new Map();
document.querySelectorAll('.nav-links a[href^="#"]').forEach((link) => {
  const id = link.getAttribute('href').slice(1);
  if (id) linksBySection.set(id, link);
});

const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;

    const activeId = visible[0].target.id;
    linksBySection.forEach((link, id) => link.classList.toggle('active', id === activeId));
  }, { threshold: [0.25, 0.45, 0.65], rootMargin: '-20% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}
