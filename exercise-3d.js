/* exercise-video.js — GYM VITAL */
(function () {
  'use strict';

  /* Extrae el ID de cualquier formato de URL de YouTube */
  function parseYouTubeId(value) {
    if (!value) return null;
    value = value.trim();
    // youtu.be/ID
    let m = value.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // /shorts/ID
    m = value.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // ?v=ID  o  /embed/ID
    m = value.match(/(?:[?&]v=|\/embed\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    // ID solo (11 caracteres exactos)
    if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
    return null;
  }

  /* ── MODAL ──────────────────────────────────────────────── */
  let overlay = null;

  function buildModal() {
    overlay = document.createElement('div');
    overlay.className = 'ex-overlay';
    overlay.innerHTML = `
      <div class="ex-modal">
        <button class="ex-close-btn" aria-label="Cerrar">✕</button>
        <p class="ex-modal-title"></p>

        <div class="ex-video-section">
          <a class="ex-thumb-link" href="#" target="_blank" rel="noopener noreferrer">
            <img class="ex-thumb-img" src="" alt="Ver tutorial en YouTube">
            <div class="ex-play-overlay">
              <svg viewBox="0 0 68 48" width="68" height="48">
                <path fill="#ff2200" fill-opacity=".9"
                  d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34
                  0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0
                  24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87
                  34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94
                  34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>
                <path fill="#fff" d="M45 24 27 14v20"/>
              </svg>
              <span>Reproducir en YouTube</span>
            </div>
          </a>
          <p class="ex-hint">Toca la imagen para abrir el video</p>
        </div>

        <div class="ex-no-video">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="#3a3a3a">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1
            1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <p>Sin video asignado</p>
          <small>
            En el archivo HTML del día, buscá el ejercicio<br>
            y completá el atributo:<br>
            <code>data-video="link de YouTube"</code>
          </small>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('.ex-close-btn')
      .addEventListener('click', closeModal);
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(name, rawVideo) {
    if (!overlay) buildModal();

    const videoId      = parseYouTubeId(rawVideo);
    const videoSection = overlay.querySelector('.ex-video-section');
    const noVideo      = overlay.querySelector('.ex-no-video');
    const thumbLink    = overlay.querySelector('.ex-thumb-link');
    const thumbImg     = overlay.querySelector('.ex-thumb-img');

    overlay.querySelector('.ex-modal-title').textContent = name;

    if (videoId) {
      thumbImg.src       = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      thumbLink.href     = `https://www.youtube.com/watch?v=${videoId}`;
      videoSection.style.display = 'block';
      noVideo.style.display      = 'none';
    } else {
      videoSection.style.display = 'none';
      noVideo.style.display      = 'flex';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── INIT ───────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll('.exercise-item[data-exercise]').forEach(item => {
      const name  = item.dataset.exercise;
      const video = item.dataset.video || '';
      const btn   = item.querySelector('.ex-demo-btn');

      if (btn && !parseYouTubeId(video)) {
        btn.classList.add('ex-demo-btn--empty');
      }

      item.addEventListener('click', () => openModal(name, video));
      if (btn) {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          openModal(name, video);
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
