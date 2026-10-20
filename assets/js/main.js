/* La Bottega della Stufa — interazioni */
(function () {
  'use strict';

  /* ---------- anno corrente ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- header sticky ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  var closeMenu = function () {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Apri il menu');
    document.body.classList.remove('is-locked');
  };

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    document.body.classList.toggle('is-locked', open);
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && nav.classList.contains('is-open')) closeMenu();
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- link attivo nella nav ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav__cta)'));

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- lightbox galleria ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lbImg');
  var boxCap = document.getElementById('lbCap');
  var current = 0;
  var lastFocus = null;

  var show = function (i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    boxImg.src = item.dataset.full;
    boxImg.alt = item.querySelector('img').alt;
    boxCap.textContent = item.dataset.caption || '';
  };

  var open = function (i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.body.classList.add('is-locked');
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    document.getElementById('lbClose').focus();
  };

  var close = function () {
    box.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(function () {
      box.hidden = true;
      boxImg.src = '';
      if (lastFocus) lastFocus.focus();
    }, 280);
  };

  items.forEach(function (item, i) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('click', function () { open(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* ---------- modulo contatti ----------
     Invio tramite Web3Forms: le richieste arrivano all'email associata alla
     access key (la chiave è pubblica per design). Lasciando FORM_ENDPOINT
     vuoto si torna al client di posta, senza backend. */
  var FORM_ENDPOINT = 'https://api.web3forms.com/submit';
  var WEB3FORMS_KEY = '5645b84a-f15d-4571-9d93-c972edb40a3e';
  var DESTINATARIO = 'labottegadellastufa@gmail.com';

  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var submit = form.querySelector('.form__submit');

    var setStatus = function (msg, kind) {
      status.textContent = msg;
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
    };

    var markInvalid = function () {
      var first = null;
      form.querySelectorAll('input, select, textarea').forEach(function (el) {
        var wrap = el.closest('.field') || el.closest('.check');
        if (!wrap) return;
        var bad = !el.checkValidity();
        wrap.classList.toggle('is-invalid', bad);
        if (bad && !first) first = el;
      });
      return first;
    };

    form.addEventListener('input', function (e) {
      var wrap = e.target.closest('.field') || e.target.closest('.check');
      if (wrap && e.target.checkValidity()) wrap.classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstBad = markInvalid();
      if (firstBad) {
        setStatus('Controlla i campi evidenziati prima di inviare.', 'err');
        firstBad.focus();
        return;
      }

      var data = new FormData(form);
      var nome = data.get('nome');
      var tel = data.get('telefono');
      var email = data.get('email') || '—';
      var tipo = data.get('richiesta');
      var msg = data.get('messaggio');

      submit.disabled = true;

      if (!FORM_ENDPOINT) {
        var corpo =
          'Nome: ' + nome + '\n' +
          'Telefono: ' + tel + '\n' +
          'Email: ' + email + '\n' +
          'Richiesta: ' + tipo + '\n\n' +
          msg;
        window.location.href = 'mailto:' + DESTINATARIO +
          '?subject=' + encodeURIComponent('Richiesta dal sito — ' + tipo) +
          '&body=' + encodeURIComponent(corpo);
        setStatus('Abbiamo aperto il tuo programma di posta con il messaggio già pronto: premi invia per farcelo arrivare.', 'ok');
        submit.disabled = false;
        return;
      }

      data.append('access_key', WEB3FORMS_KEY);
      data.append('subject', 'Richiesta dal sito — ' + tipo + ' — ' + nome);
      data.append('from_name', 'Sito La Bottega della Stufa');

      setStatus('Invio in corso…');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data
      }).then(function (res) {
        return res.json().then(function (json) {
          if (!res.ok || !json.success) throw new Error(json.message || res.status);
        });
      }).then(function () {
        form.reset();
        setStatus('Richiesta inviata. Ti ricontattiamo al più presto, grazie!', 'ok');
      }).catch(function () {
        setStatus('Invio non riuscito. Chiamaci al 349 596 2457 (Bryan) o al 335 825 0278 (Lorenzo), oppure scrivi a ' + DESTINATARIO + '.', 'err');
      }).then(function () {
        submit.disabled = false;
      });
    });
  }
})();
