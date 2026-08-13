// ===== i18n =====
window._lang = new URLSearchParams(location.search).get('lang')
             || localStorage.getItem('lang')
             || 'pt';

const i18n = {
  apply(lang) {
    // Persist lang in all internal links so it survives page navigation
    document.querySelectorAll('a[data-base-href]').forEach(a => {
      const base = a.dataset.baseHref;
      const sep = base.includes('?') ? '&' : '?';
      a.href = base + sep + 'lang=' + lang;
    });

    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.pt;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    localStorage.setItem('lang', lang);
    window._lang = lang;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Cache original hrefs for all internal links before any modification
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href &&
        !href.startsWith('http') &&
        !href.startsWith('mailto') &&
        !href.startsWith('tel') &&
        !href.startsWith('#')) {
      a.dataset.baseHref = href;
    }
  });

  // Apply saved language on load
  i18n.apply(window._lang);

  // Bind language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => i18n.apply(btn.dataset.lang));
  });

  const projectItems = document.querySelectorAll('.project-item');
  const menuBtn = document.querySelector('.menu-btn');
  const menuOverlay = document.querySelector('.menu-overlay');

  // ===== Menu Toggle =====
  menuBtn.addEventListener('click', () => {
    const isOpen = menuOverlay.classList.toggle('open');
    document.body.classList.toggle('menu-active', isOpen);
    menuBtn.textContent = isOpen ? (window._lang === 'en' ? 'Close' : 'Fechar') : 'Menu';
  });

  // Close menu on link click
  menuOverlay.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOverlay.classList.remove('open');
      document.body.classList.remove('menu-active');
      menuBtn.textContent = 'Menu';
    });
  });

  // Mapeamento: data-project → GIF correspondente
  const gifMap = {
    creativedirection: 'videos/direcaocriativa.gif',
    graphicdesign:     'videos/designgrafico.gif',
    extraprojects:     'videos/uxui.gif',
  };

  // Preload dos GIFs para transição suave
  [...new Set(Object.values(gifMap))].forEach(src => {
    const img = new Image();
    img.src = src;
  });

  function setActiveProject(projectName) {
    projectItems.forEach(item => {
      item.classList.toggle('active', item.dataset.project === projectName);
    });

    document.querySelectorAll('.hero-gif').forEach(gif => {
      gif.classList.remove('active');
    });

    const targetGif = document.querySelector(`.hero-gif[data-project="${projectName}"]`);
    if (targetGif) {
      targetGif.classList.add('active');
    }
  }

  // Hover (desktop)
  projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      setActiveProject(item.dataset.project);
    });
  });

  // Touch (mobile)
  projectItems.forEach(item => {
    item.addEventListener('touchstart', (e) => {
      e.preventDefault();
      setActiveProject(item.dataset.project);
    }, { passive: false });
  });

  // ===== Header hide on scroll =====
  const header = document.querySelector('.header');

  document.body.addEventListener('scroll', () => {
    if (document.body.scrollTop > 50) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
  });

  // ===== Category List Preview =====
  const categoryItems = document.querySelectorAll('.category-list-item');
  const preview = document.getElementById('categoryPreview');
  const previewImg = document.getElementById('categoryPreviewImg');

  if (categoryItems.length && preview && previewImg) {
    categoryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const src = item.dataset.preview;
        if (src) {
          previewImg.src = src;
          preview.classList.add('visible');
        }
      });

      item.addEventListener('mouseleave', () => {
        preview.classList.remove('visible');
      });
    });
  }
});
