// Inicializa AOS após o carregamento da página
window.addEventListener('load', function() {
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    disable: 'mobile' // Desativa em dispositivos móveis se necessário
  });
});

window.onload = function() {
  const canvas = document.getElementById('space-bg');
  if (!canvas) {
    console.error('Canvas não encontrado!');
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Contexto 2D não encontrado!');
    return;
  }
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  console.log('Canvas inicializado:', w, h);

  // Estrelas cintilantes
  const STAR_COUNT = 150;
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1)
    });
  }

  // Estrela cadente
  let shootingStar = null;
  let shootingTimer = 0;

  function drawStars() {
    for (let star of stars) {
      ctx.save();
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
      // Cintilação
      star.alpha += star.dAlpha;
      if (star.alpha <= 0.2 || star.alpha >= 1) star.dAlpha *= -1;
    }
  }

  function drawShootingStar() {
    if (!shootingStar) return;
    ctx.save();
    ctx.globalAlpha = shootingStar.alpha;
    ctx.strokeStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(shootingStar.x - shootingStar.len * Math.cos(shootingStar.angle),
               shootingStar.y - shootingStar.len * Math.sin(shootingStar.angle));
    ctx.stroke();
    ctx.restore();
    // Movimento
    shootingStar.x += shootingStar.vx;
    shootingStar.y += shootingStar.vy;
    shootingStar.alpha -= 0.01;
    if (shootingStar.alpha <= 0) shootingStar = null;
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#1a0025'; // Fundo roxo escuro
    ctx.fillRect(0, 0, w, h);
    drawStars();
    drawShootingStar();
    // Estrela cadente aleatória
    shootingTimer--;
    if (shootingTimer <= 0 && !shootingStar) {
      if (Math.random() < 0.01) { // Probabilidade de aparecer
        const startX = Math.random() * w * 0.8 + w * 0.1;
        const startY = Math.random() * h * 0.2;
        const angle = Math.PI / 4 + Math.random() * Math.PI / 8;
        shootingStar = {
          x: startX,
          y: startY,
          vx: Math.cos(angle) * 12,
          vy: Math.sin(angle) * 12,
          len: 120 + Math.random() * 60,
          alpha: 1,
          angle: angle
        };
        shootingTimer = 200 + Math.random() * 200;
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    console.log('Canvas redimensionado:', w, h);
  });

  animate();

  // Rolagem suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Ativar tooltips do Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Botão de voltar ao topo - garantir execução após DOM pronto
// (fora do window.onload)
document.addEventListener('DOMContentLoaded', function () {
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    console.log('ScrollY:', window.scrollY); // Depuração
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Preloader animado
(function() {
  document.body.classList.add('preloader-active');
  window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(function() {
          preloader.remove();
          document.body.classList.remove('preloader-active');
        }, 700); // tempo do transition do CSS
      } else {
        document.body.classList.remove('preloader-active');
      }
    }, 1700); // tempo mínimo do preloader
  });
})();
