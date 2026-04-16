/* exercise-video.js — GYM VITAL */
(function () {
  'use strict';

  /* Extrae el ID de cualquier formato de URL de YouTube */
  function parseYouTubeId(value) {
    if (!value) return null;
    value = value.trim();
    let m = value.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    m = value.match(/(?:v=|\/embed\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
    return null;
  }

  /* ── MODAL ──────────────────────────────────────────────────── */
  let overlay;

  function buildModal() {
    overlay = document.createElement('div');
    overlay.className = 'ex-overlay';
    overlay.innerHTML = `
      <div class="ex-modal">
        <button class="ex-close-btn" aria-label="Cerrar">✕</button>
        <p class="ex-modal-title"></p>

        <!-- Con video: thumbnail + iframe -->
        <div class="ex-video-section" style="display:none">
          <div class="ex-video-wrap">
            <!-- Thumbnail (click-to-play) -->
            <div class="ex-thumbnail">
              <img class="ex-thumb-img" src="" alt="Vista previa">
              <button class="ex-play-btn" aria-label="Reproducir">
                <svg viewBox="0 0 68 48" width="68" height="48">
                  <path fill="#ff2200" fill-opacity=".9"
                    d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13
                    6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95
                    1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13
                    27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95
                    -1.48-16.26z"/>
                  <path fill="#fff" d="M45 24 27 14v20"/>
                </svg>
              </button>
            </div>
            <!-- Iframe (oculto hasta que se presione play) -->
            <iframe class="ex-iframe"
              style="display:none"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy" title="Tutorial">
            </iframe>
          </div>
          <a class="ex-yt-link" href="#" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356
              2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246
              15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549
              -4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            Abrir en YouTube
          </a>
        </div>

        <!-- Sin video: placeholder -->
        <div class="ex-no-video">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#444">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12
                     a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
          <p>Sin video asignado</p>
          <small>En el archivo HTML completá el atributo<br>
            <code>data-video=""</code> con el link de YouTube</small>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    /* Play button: reemplaza thumbnail por iframe */
    overlay.querySelector('.ex-play-btn').addEventListener('click', function () {
      const iframe   = overlay.querySelector('.ex-iframe');
      const thumb    = overlay.querySelector('.ex-thumbnail');
      const videoId  = overlay.dataset.currentVideo;
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      thumb.style.display  = 'none';
      iframe.style.display = 'block';
    });

    overlay.querySelector('.ex-close-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  function openModal(name, rawVideo) {
    if (!overlay) buildModal();

    const videoId     = parseYouTubeId(rawVideo);
    const section     = overlay.querySelector('.ex-video-section');
    const noVideo     = overlay.querySelector('.ex-no-video');
    const thumb       = overlay.querySelector('.ex-thumbnail');
    const thumbImg    = overlay.querySelector('.ex-thumb-img');
    const iframe      = overlay.querySelector('.ex-iframe');
    const ytLink      = overlay.querySelector('.ex-yt-link');

    overlay.querySelector('.ex-modal-title').textContent = name;

    if (videoId) {
      /* Guarda el ID para usarlo cuando se presione play */
      overlay.dataset.currentVideo = videoId;

      /* Muestra thumbnail, oculta iframe (reset) */
      thumbImg.src         = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      thumb.style.display  = 'flex';
      iframe.style.display = 'none';
      iframe.src           = '';

      ytLink.href = `https://www.youtube.com/watch?v=${videoId}`;
      section.style.display  = 'block';
      noVideo.style.display  = 'none';
    } else {
      section.style.display  = 'none';
      noVideo.style.display  = 'flex';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    /* Detiene el video */
    const iframe = overlay.querySelector('.ex-iframe');
    if (iframe) { iframe.src = ''; iframe.style.display = 'none'; }
    const thumb = overlay.querySelector('.ex-thumbnail');
    if (thumb) thumb.style.display = 'flex';
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  function init() {
    document.querySelectorAll('.exercise-item[data-exercise]').forEach(item => {
      const name  = item.dataset.exercise;
      const video = item.dataset.video || '';
      const btn   = item.querySelector('.ex-demo-btn');

      if (btn && !parseYouTubeId(video)) {
        btn.classList.add('ex-demo-btn--empty');
      }

      item.addEventListener('click', () => openModal(name, video));
      if (btn) btn.addEventListener('click', e => { e.stopPropagation(); openModal(name, video); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
