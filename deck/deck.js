(() => {
  // Collage: agrega aquí las imágenes o videos que vayan en assets/collage/
  // ej. "assets/collage/01.jpg", "assets/collage/02.mp4"
  const COLLAGE_MEDIA = [
    ...Array.from({ length: 27 }, (_, i) => `assets/collage/${String(i + 1).padStart(2, "0")}.jpg`),
    "assets/collage/28.webp",
  ];

  const PARODY = [
    "Descubre el poder de lo extraordinario",
    "En un mundo donde todo cambia…",
    "Eleva tu experiencia",
    "Desbloquea tu máximo potencial",
    "El futuro ya está aquí",
    "Redefiniendo la innovación",
    "Más que un producto, un estilo de vida",
    "Sumérgete en la magia",
    "Diseñado para ti. Impulsado por IA.",
    "Vive el momento",
    "Transforma tu día a día",
    "Experiencias que inspiran",
    "Siente la diferencia",
    "Donde la tecnología se encuentra con la emoción",
  ];
  const BRANDS = ["NOVA", "LUMÉ", "AURA", "VYRA", "ZENTH", "ELEVA", "ORBIA"];
  const GRADS = [
    ["linear-gradient(135deg,#7b2ff7,#f107a3)", "linear-gradient(135deg,#ffd1f5,#c86bff)"],
    ["linear-gradient(135deg,#00c6ff,#7a00ff)", "linear-gradient(135deg,#bff6ff,#5d7bff)"],
    ["linear-gradient(160deg,#ff6a00,#ee0979)", "linear-gradient(135deg,#ffe0b8,#ff5f8f)"],
    ["radial-gradient(circle at 70% 20%,#5b2bd1,#0b0420 70%)", "linear-gradient(135deg,#e2d4ff,#7f5cff)"],
    ["linear-gradient(135deg,#1fd1f9,#b621fe)", "linear-gradient(135deg,#d9fbff,#9a6bff)"],
    ["linear-gradient(135deg,#f9d423,#ff4e50)", "linear-gradient(135deg,#fff6c9,#ff8a6b)"],
    ["linear-gradient(200deg,#0f2027,#2c5364)", "linear-gradient(135deg,#d6fff6,#3ee6c1)"],
  ];
  const SPANS = ["h2", "", "", "h2", "", "", "h2", "", "w2", "", "h2", "", "", "", "h2", "", "", "h2", "", "", "", "h2", "", "", "", "", ""];

  const FLOW_EDGES = [
    ["foto", "escena1"], ["foto", "escena2"], ["foto", "postig"], ["foto", "cat"],
    ["escena1", "clip"], ["escena2", "post"],
    ["clip", "anuncio"],
    ["guion", "voz"],
    ["voz", "anuncio", "up", 60], ["musica", "anuncio", "up", 160],
    ["ambiente", "anuncio", "up", 260], ["campanas", "anuncio", "up", 360],
  ];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const stage = $("#stage");
  const viewport = $(".viewport");
  const slides = $$(".slide");
  const isPresenter = new URLSearchParams(location.search).has("presenter");
  const channel = "BroadcastChannel" in window ? new BroadcastChannel("wcgt26-deck") : null;

  const state = { cur: 0, step: 0, backup: false };

  const maxStep = (s) => Math.max(0, ...$$("[data-step]", s).map((e) => +e.dataset.step));

  // ---------- Scale ----------
  function fit() {
    const r = viewport.getBoundingClientRect();
    const s = Math.min(r.width / 1920, r.height / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  addEventListener("resize", fit);

  // ---------- Collage ----------
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function buildCollage() {
    const grid = $("#collage-grid");
    const rand = rng(2026);
    const media = COLLAGE_MEDIA;
    const total = Math.max(40, media.length);
    for (let i = 0; i < total; i++) {
      const tile = document.createElement("div");
      tile.className = `tile ${SPANS[i % SPANS.length]}`;
      tile.style.setProperty("--r", `${(rand() * 5 - 2.5).toFixed(2)}deg`);
      tile.style.setProperty("--d", `${(rand() * 2.6).toFixed(2)}s`);
      if (media.length) {
        // recorre todas las imágenes en un orden mezclado antes de repetir
        const src = media[(i * 11 + Math.floor(i / media.length)) % media.length];
        const el = document.createElement(/\.(mp4|webm|mov)$/i.test(src) ? "video" : "img");
        Object.assign(el, { src, muted: true, loop: true, playsInline: true, alt: "" });
        if (el.tagName === "VIDEO") el.dataset.collageVideo = "";
        tile.append(el);
      } else {
        const [g, g2] = GRADS[Math.floor(rand() * GRADS.length)];
        tile.classList.add("parody");
        tile.style.setProperty("--g", g);
        tile.style.setProperty("--g2", g2);
        tile.innerHTML = `<span class="brand">✦ ${BRANDS[Math.floor(rand() * BRANDS.length)]}</span><div class="blob"></div>
          <span class="spark" style="left:${18 + rand() * 50}%;top:${30 + rand() * 30}%">✦</span>
          <p>${PARODY[i % PARODY.length]}</p>`;
      }
      grid.append(tile);
    }
  }

  // ---------- Flow ----------
  const flow = $("#flow");
  const node = (id) => $(`.node[data-id="${id}"]`, flow);
  function buildFlow() {
    const svg = $(".edges", flow);
    const groupDelay = { 1: 0.1, 2: 0.3, 3: 0.5, 4: 0.3, 5: 0.7, 6: 0.9 };
    $$(".node", flow).forEach((n) => n.style.setProperty("--d", `${groupDelay[n.dataset.group]}s`));
    svg.innerHTML = FLOW_EDGES.map(([a, b, mode, offset]) => {
      const A = node(a), B = node(b);
      let d;
      if (mode === "up") {
        const x1 = A.offsetLeft + A.offsetWidth / 2, y1 = A.offsetTop;
        const x2 = B.offsetLeft + offset, y2 = B.offsetTop + B.offsetHeight;
        d = `M${x1} ${y1} C${x1} ${y1 - 60} ${x2} ${y2 + 60} ${x2} ${y2}`;
      } else {
        const x1 = A.offsetLeft + A.offsetWidth, y1 = A.offsetTop + A.offsetHeight / 2;
        const x2 = B.offsetLeft, y2 = B.offsetTop + B.offsetHeight / 2;
        const c = (x2 - x1) / 2;
        d = `M${x1} ${y1} C${x1 + c} ${y1} ${x2 - c} ${y2} ${x2} ${y2}`;
      }
      const delay = groupDelay[B.dataset.group] + 0.2;
      return `<path d="${d}" pathLength="1" data-to="${b}" data-from="${a}" style="--d:${delay}s"/>`;
    }).join("");
  }
  function updateFlow(step) {
    flow.classList.toggle("staged", step > 0);
    $$(".node", flow).forEach((n) => {
      const g = +n.dataset.group;
      n.classList.toggle("idle", step > 0 && g > step);
      n.classList.toggle("running", step > 0 && g === step);
      n.classList.toggle("done", step > 0 && g < step);
    });
    $$(".edges path", flow).forEach((p) => {
      const g = +node(p.dataset.to).dataset.group;
      const from = +node(p.dataset.from).dataset.group;
      p.classList.toggle("flowing", step > 0 && g === step && from <= step);
      p.classList.toggle("done", step > 0 && g < step);
    });
    $$(".caption", flow.parentElement).forEach((c) => c.classList.toggle("show", +c.dataset.for === step));
    $(".caption-step", flow.parentElement).textContent = step ? `Paso ${step} de 6` : "";
  }

  // ---------- Media ----------
  const collageAudio = $("#collage-audio");
  const overlay = $("#backup-overlay");
  const overlayVideo = $("video", overlay);
  const play = (m) => m && m.play().catch(() => {});
  $$(".media-frame img, .media-frame video").forEach((m) => {
    const miss = () => m.parentElement.classList.add("missing");
    m.addEventListener("error", miss);
    if (m.tagName === "IMG" && m.complete && !m.naturalWidth) miss();
  });
  if (isPresenter) $$("audio, video").forEach((m) => (m.muted = true));

  function syncMedia(prevCur) {
    const s = slides[state.cur];
    const collage = s.id === "s-collage";
    $(".collage-wrap").classList.toggle("frozen", collage && state.step >= 1);
    $$("[data-collage-video]").forEach((v) => (collage && state.step === 0 ? play(v) : v.pause()));
    if (collage && state.step === 0) play(collageAudio); else collageAudio.pause();
    if (prevCur !== state.cur && collage) collageAudio.currentTime = 0;

    overlay.hidden = !state.backup;
    if (state.backup) { overlayVideo.currentTime = 0; play(overlayVideo); } else overlayVideo.pause();
  }

  // ---------- Render ----------
  function render(prevCur = -1) {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === state.cur));
    const s = slides[state.cur];
    $$("[data-step]", s).forEach((e) => e.classList.toggle("on", +e.dataset.step <= state.step));
    if (s.id === "s-flow") updateFlow(state.step);
    syncMedia(prevCur);
    if (!isPresenter) history.replaceState(null, "", `#${state.cur + 1}.${state.step}`);
    renderPresenter();
  }
  function go(cur, step, { remote = false } = {}) {
    const prev = state.cur;
    state.cur = Math.max(0, Math.min(slides.length - 1, cur));
    state.step = Math.max(0, Math.min(maxStep(slides[state.cur]), step));
    render(prev);
    if (!remote) broadcast();
  }
  const next = () => (state.step < maxStep(slides[state.cur]) ? go(state.cur, state.step + 1) : go(state.cur + 1, 0));
  const prev = () => (state.step > 0 ? go(state.cur, state.step - 1) : go(state.cur - 1, maxStep(slides[state.cur - 1] || slides[0])));

  function broadcast() {
    channel?.postMessage({ cur: state.cur, step: state.step, backup: state.backup });
  }
  channel?.addEventListener("message", ({ data }) => {
    state.backup = data.backup;
    go(data.cur, data.step, { remote: true });
  });

  // ---------- Presenter ----------
  const t0Key = "wcgt26-t0";
  const fmt = (ms) => {
    const sec = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  };
  function renderPresenter() {
    if (!isPresenter) return;
    const s = slides[state.cur];
    const n = slides[state.cur + 1];
    const max = maxStep(s);
    $("#pp-where").textContent = `${state.cur + 1}/${slides.length} · ${s.dataset.title}${max ? ` · paso ${state.step}/${max}` : ""}`;
    $("#pp-notes").innerHTML = $(".notes", s)?.innerHTML || "";
    $("#pp-next").textContent = n ? `Sigue: ${n.dataset.title}` : "Última slide";
    $("#pp-plan").textContent = `plan: ${s.dataset.time}`;
  }
  if (isPresenter) {
    document.body.classList.add("presenter");
    $("#presenter").hidden = false;
    if (!localStorage.getItem(t0Key)) localStorage.setItem(t0Key, Date.now());
    $("#pp-reset").addEventListener("click", () => localStorage.setItem(t0Key, Date.now()));
    setInterval(() => ($("#pp-timer").textContent = fmt(Date.now() - +localStorage.getItem(t0Key))), 500);
  }

  // ---------- Keys ----------
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); next(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); prev(); }
    else if (k === "Home") go(0, 0);
    else if (k === "End") go(slides.length - 1, 0);
    else if (k === "f" || k === "F") document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    else if (k === "p" || k === "P") open(`${location.pathname}?presenter#${state.cur + 1}.${state.step}`, "wcgt26-presenter", "width=1400,height=820");
    else if (k === "b" || k === "B") { state.backup = !state.backup; render(state.cur); broadcast(); }
    else if (k === "Escape" && state.backup) { state.backup = false; render(state.cur); broadcast(); }
  });

  // ---------- Boot ----------
  buildCollage();
  const [hs, hstep] = location.hash.slice(1).split(".").map(Number);
  document.fonts.ready.then(() => {
    fit();
    buildFlow();
    go((hs || 1) - 1, hstep || 0, { remote: true });
  });
  fit();
})();
