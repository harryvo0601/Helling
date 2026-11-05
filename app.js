(() => {
  "use strict";

  const FLOORS = window.FLOORS;
  const WEIGHTS = window.WEIGHTS;
  const KEY = "helling.v1";
  const $ = (s, el = document) => el.querySelector(s);
  const view = $("#view");

  // ---------------- State ----------------
  const fresh = () => ({ name: "", debt: {}, merit: 0, paid: 0, log: [], cleared: {}, days: [] });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} updatePills(); };
  const totalDebt = () => Object.values(S.debt).reduce((a, b) => a + b, 0);
  const today = () => new Date().toISOString().slice(0, 10);
  const markDay = () => { if (!S.days.includes(today())) S.days.push(today()); };
  const streak = () => {
    let n = 0; const d = new Date();
    while (S.days.includes(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const floorOf = (n) => FLOORS.find((f) => f.n === n);

  function updatePills() {
    $("#stat-debt").textContent = totalDebt();
    $("#stat-merit").textContent = S.merit;
  }

  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function vibrate(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch {} }

  // ---------------- Characters (SVG gốc) ----------------
  // "Bé Đậu": tiểu quỷ dẫn đường, tròn như hạt đậu, có hai sừng nhỏ.
  const guideSVG = (cls = "guide") => `
    <svg class="${cls}" viewBox="0 0 100 100" aria-label="Bé Đậu dẫn đường">
      <path d="M30 26 L24 8 L40 20 Z" fill="#ffd27a"/><path d="M70 26 L76 8 L60 20 Z" fill="#ffd27a"/>
      <ellipse cx="50" cy="56" rx="38" ry="36" fill="#ff7b8f"/>
      <ellipse cx="50" cy="62" rx="24" ry="20" fill="#ffa3b1"/>
      <circle cx="37" cy="50" r="5" fill="#3b1630"/><circle cx="63" cy="50" r="5" fill="#3b1630"/>
      <circle cx="39" cy="48" r="1.6" fill="#fff"/><circle cx="65" cy="48" r="1.6" fill="#fff"/>
      <ellipse cx="28" cy="60" rx="6" ry="3.5" fill="#ff4f6d" opacity=".55"/><ellipse cx="72" cy="60" rx="6" ry="3.5" fill="#ff4f6d" opacity=".55"/>
      <path d="M43 62 Q50 69 57 62" stroke="#3b1630" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M86 70 Q98 66 94 54" stroke="#ff7b8f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M94 54 l-6 2 l5 -8 z" fill="#ffd27a"/>
    </svg>`;

  // Linh hồn nhỏ: người chơi
  const soulSVG = (mood = "sad", cls = "soul", tint = "#fffaf5", halo = mood === "happy") => {
    if (mood === "calm") return `
    <svg class="${cls}" viewBox="0 0 100 110"><path d="M14 56 Q14 12 50 12 Q86 12 86 56 L86 92 Q79 102 72 92 Q65 102 57 92 Q50 102 43 92 Q35 102 28 92 Q21 102 14 92 Z" fill="${tint}"/>
      <path d="M33 48 q5 5 10 0" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 48 q5 5 10 0" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="28" cy="58" rx="6" ry="3.5" fill="#ffb3c6"/><ellipse cx="72" cy="58" rx="6" ry="3.5" fill="#ffb3c6"/>
      <circle cx="50" cy="63" r="3" fill="#3b2550"/></svg>`;
    const mouth = mood === "happy"
      ? `<path d="M40 60 Q50 70 60 60" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<path d="M42 64 Q50 58 58 64" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const eyes = mood === "happy"
      ? `<path d="M33 48 q5 -6 10 0" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 48 q5 -6 10 0" stroke="#3b2550" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<circle cx="38" cy="48" r="4.5" fill="#3b2550"/><circle cx="62" cy="48" r="4.5" fill="#3b2550"/><circle cx="39.5" cy="46.5" r="1.4" fill="#fff"/><circle cx="63.5" cy="46.5" r="1.4" fill="#fff"/>`;
    return `
    <svg class="${cls}" viewBox="0 0 100 110" aria-label="Linh hồn nhỏ">
      <path d="M14 56 Q14 12 50 12 Q86 12 86 56 L86 92 Q79 102 72 92 Q65 102 57 92 Q50 102 43 92 Q35 102 28 92 Q21 102 14 92 Z" fill="${tint}"/>
      <path d="M14 56 Q14 12 50 12 Q86 12 86 56 L86 66 Q50 74 14 66 Z" fill="#fff" opacity=".5"/>
      ${eyes}
      <ellipse cx="28" cy="58" rx="6" ry="3.5" fill="#ffb3c6"/><ellipse cx="72" cy="58" rx="6" ry="3.5" fill="#ffb3c6"/>
      ${mouth}
      ${halo ? `<ellipse cx="50" cy="6" rx="16" ry="4" fill="none" stroke="#ffe08a" stroke-width="3"/>` : ""}
    </svg>`;
  };

  const stars = (n = 14) => `<div class="stars">${Array.from({ length: n }, () =>
    `<span style="left:${Math.random() * 100}%;top:${Math.random() * 55}%;animation-delay:${(Math.random() * 3).toFixed(2)}s"></span>`).join("")}</div>`;

  // ---------------- Router ----------------
  let current = "map";
  let cleanup = null;
  function go(tab, arg) {
    if (cleanup) { cleanup(); cleanup = null; }
    current = tab;
    document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab || ((tab === "floor" || tab === "lobby") && b.dataset.tab === "map")));
    view.innerHTML = "";
    view.className = "fade-in";
    void view.offsetWidth;
    ({ map: renderMap, reflect: renderReflect, book: renderBook, floor: renderFloor, lobby: renderLobby, onboard: renderOnboard })[tab](arg);
    window.scrollTo(0, 0);
  }
  document.querySelectorAll(".tabbar button").forEach((b) => b.addEventListener("click", () => S.name ? go(b.dataset.tab) : null));

  // ---------------- Onboarding ----------------
  function renderOnboard() {
    view.innerHTML = `
      <div class="center">
        ${guideSVG("big-guide")}
        <h2>Chào mừng xuống Helling!</h2>
        <p class="sub">Mình là <b>Bé Đậu</b>, tiểu quỷ trực ban. Ở đây không đáng sợ đâu —
          18 tầng (và một tầng 19 mới mở) chỉ để bạn <b>trả nghiệp</b> bằng những việc nhỏ và
          <b>tự soi lại mình</b>.</p>
        <input class="name" id="nm" maxlength="24" placeholder="Bạn tên gì nhỉ?" autocomplete="off">
        <button class="btn" id="start">Xuống tầng 1 ⬇️</button>
        <p class="note">Ứng dụng mang tính giải trí và gợi suy ngẫm, không thay thế niềm tin hay nghi lễ tôn giáo nào.
          Không bán nghiệp, không mua công đức — công đức thật nằm ở việc tốt bạn làm ngoài đời.</p>
      </div>`;
    const go1 = () => {
      const v = $("#nm").value.trim();
      if (!v) { $("#nm").focus(); toast("Cho Bé Đậu biết tên bạn nhé"); return; }
      S.name = v; save(); go("map");
      toast(`Chào ${v}! Bắt đầu hành trình nào.`);
    };
    $("#start").onclick = go1;
    $("#nm").onkeydown = (e) => { if (e.key === "Enter") go1(); };
  }

  // ---------------- Map ----------------
  function renderMap() {
    const d = totalDebt();
    const greet = d === 0
      ? `Chào <b>${esc(S.name)}</b>! Sổ nghiệp đang sạch. Vào <b>Tự soi</b> nếu có điều gì cần trả, hoặc dạo một tầng để tu dưỡng.`
      : `<b>${esc(S.name)}</b> ơi, bạn còn <b>${d}</b> phần nghiệp. Các tầng có dấu 🔥 đang chờ bạn đó.`;
    const item = (f) => {
      const owe = S.debt[f.n] || 0;
      const right = owe ? `<span class="debt">🔥 ${owe}</span>` : (S.cleared[f.n] ? `<span class="done">🪷</span>` : "");
      return `
        <button class="floor ${f.special ? "special" : ""}" data-n="${f.n}" style="--c:${f.color}">
          <span class="num">${f.prop}<small>${f.n}</small></span>
          <span class="info"><b>${f.special ? esc(f.name) : `Tầng ${f.n} · ${esc(f.name)}`}</b><span>${esc(f.sin)}</span><span class="crowd">👻 ${Presence.count(f.n)} linh hồn trong sảnh</span></span>
          ${right}
        </button>`;
    };
    view.innerHTML = `
      <div class="hero">${guideSVG()}<div class="bubble">${greet}</div></div>
      <div class="tower">
        ${FLOORS.filter((f) => !f.special).map(item).join("")}
      </div>
      <p class="gate-label">✦ ✦ ✦ CỔNG TẦNG 19 ✦ ✦ ✦</p>
      <div class="tower" style="margin-top:10px">${FLOORS.filter((f) => f.special).map(item).join("")}</div>
      <p class="note">Tên các tầng lấy cảm hứng từ tín ngưỡng dân gian “Thập Bát Tầng Địa Ngục”, được diễn giải lại nhẹ nhàng.</p>`;
    view.querySelectorAll(".floor").forEach((b) => b.onclick = () => go("lobby", +b.dataset.n));
  }

  // ---------------- Lobby (sảnh mỗi tầng) ----------------
  function renderLobby(n) {
    const f = floorOf(n);
    const owe = S.debt[f.n] || 0;
    const title = f.special ? f.name : `Tầng ${f.n} · ${f.name}`;
    view.innerHTML = `
      <button class="back" id="back">← Về bản đồ</button>
      <div class="lobby scene ${f.special ? "special" : ""}" style="--c:${f.color}" id="lobby">
        ${stars(12)}
        <span class="tag">Sảnh ${esc(title)}</span>
        <div class="gate"><span>${f.prop}</span></div>
        <div class="ground" id="ground"></div>
      </div>
      <div class="lobby-meta"><span id="who"></span><span class="demo" id="mode">${Presence.isReal() ? "🟢 Người thật + 👻 mô phỏng" : "👻 Linh hồn mô phỏng"}</span></div>
      <div class="chat card">
        <ul class="feed" id="feed"><li class="sys">Lời nói ở sảnh cũng là nghiệp — nói lời tử tế nhé 🌸</li></ul>
        <div class="quick" id="quick"></div>
        <form class="say" id="sayf"><input id="sayi" maxlength="80" placeholder="Nhắn cho cả sảnh…" autocomplete="off" enterkeyhint="send"><button class="btn" type="submit">Gửi</button></form>
      </div>
      <div style="height:14px"></div>
      <div class="card">
        <h3>${esc(f.sin)}</h3>
        <p class="sub">${esc(f.story)}</p>
        <p class="sub">${owe ? `Bạn đang nợ <b>${owe}</b> phần nghiệp ở tầng này.` : "Bạn không nợ gì ở tầng này — vào tu dưỡng để tích công đức."}</p>
      </div>
      <div style="height:14px"></div>
      <button class="btn" id="enter">🚪 Vào phòng trả nghiệp</button>
      <p class="note">Chạm vào sàn để di chuyển · chạm vào linh hồn khác để gửi lời động viên 💛<br>
        Tin nhắn được lọc từ ngữ thô tục, chặn link và số điện thoại. Bấm 🔇 để ẩn một người.</p>`;
    $("#back").onclick = () => go("map");
    $("#enter").onclick = () => go("floor", f.n);

    const lobby = $("#lobby");
    const els = {};
    const place = (el, x, y) => {
      el.style.left = `${x}%`; el.style.top = `${y}%`;
      el.style.zIndex = Math.round(y);
      el.style.setProperty("--s", (0.7 + (y - 55) / 100).toFixed(2));
    };
    const makeAv = (p, me) => {
      const el = document.createElement("div");
      el.className = `av${me ? " me" : ""}`;
      el.innerHTML = `<span class="bb"></span><span class="tl">${(ACTS[f.n] || ["✨"])[0]}</span>
        <div class="body">${soulSVG(me ? (owe ? "sad" : "happy") : p.halo ? "happy" : "sad", "", p.tint)}</div><span class="nm">${esc(p.name)}</span>`;
      lobby.appendChild(el);
      return el;
    };
    const say = (el, text) => {
      const b = el.querySelector(".bb"); b.textContent = text; b.classList.add("show");
      clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove("show"), 2600);
    };

    // mình
    const me = { id: "me", name: S.name, tint: "#fffaf5" };
    const meEl = makeAv(me, true);
    place(meEl, 50, 80);
    setTimeout(() => say(meEl, owe ? "Mình đến trả nghiệp đây…" : "Ghé chơi chút!"), 500);
    $("#ground").onpointerdown = (e) => {
      const r = lobby.getBoundingClientRect();
      const x = Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(58, Math.min(90, ((e.clientY - r.top) / r.height) * 100));
      meEl.classList.toggle("flip", x < parseFloat(meEl.style.left));
      meEl.classList.add("walk"); clearTimeout(meEl._w); meEl._w = setTimeout(() => meEl.classList.remove("walk"), 1500);
      place(meEl, x, y);
      room.move(Math.round(x), Math.round(y));
    };

    // --- trò chuyện ---
    const muted = new Set(JSON.parse(localStorage.getItem("helling.muted") || "[]"));
    const feed = $("#feed");
    const addLine = (name, text, opts = {}) => {
      const li = document.createElement("li");
      if (opts.me) li.className = "me";
      if (opts.toMe) li.className = "tome";
      li.innerHTML = `<b>${esc(name)}${opts.real ? " 🟢" : ""}</b> ${esc(text)}${opts.id ? `<button class="mute" title="Ẩn người này">🔇</button>` : ""}`;
      if (opts.id) li.querySelector(".mute").onclick = () => {
        muted.add(opts.id);
        try { localStorage.setItem("helling.muted", JSON.stringify([...muted])); } catch {}
        [...feed.children].forEach((x) => { if (x.dataset.id === opts.id) x.remove(); });
        if (els[opts.id]) els[opts.id].classList.add("muted");
        toast(`Đã ẩn ${name}`);
      };
      if (opts.id) li.dataset.id = opts.id;
      feed.appendChild(li);
      while (feed.children.length > 6) feed.firstChild.remove();
    };
    const sendText = (text) => {
      const r = room.say(text);
      if (!r.ok) { toast(r.why); return false; }
      say(meEl, r.text); addLine(S.name, r.text, { me: true });
      if (r.softened) toast("Bé Đậu đã làm mềm vài từ cho bạn 🌸");
      return true;
    };
    $("#sayf").onsubmit = (e) => {
      e.preventDefault();
      const i = $("#sayi");
      if (sendText(i.value)) { i.value = ""; i.blur(); }
    };

    const room = Presence.join(f.n, { name: S.name, x: 50, y: 80, halo: !owe }, (list, ev) => {
      const ids = new Set(list.map((p) => p.id));
      Object.keys(els).forEach((id) => { if (!ids.has(id)) { els[id].classList.add("gone"); const el = els[id]; setTimeout(() => el.remove(), 600); delete els[id]; } });
      list.forEach((p) => {
        let el = els[p.id];
        if (!el) {
          el = els[p.id] = makeAv(p, false);
          place(el, p.x, p.y);
          if (p.real) el.classList.add("real");
          if (muted.has(p.id)) el.classList.add("muted");
          el.onpointerdown = (e) => {
            e.stopPropagation(); vibrate(10);
            const t = room.cheer(p); say(meEl, t); addLine(S.name, t, { me: true });
          };
        } else if (parseFloat(el.style.left) !== p.x) {
          el.classList.toggle("flip", p.x < parseFloat(el.style.left));
          el.classList.add("walk"); setTimeout(() => el.classList.remove("walk"), 1500);
          place(el, p.x, p.y);
        }
        el.classList.toggle("working", p.working);
        if (p.halo && !el._halo) { el._halo = true; el.querySelector(".body").innerHTML = soulSVG("happy", "", p.tint); }
      });
      if (ev && !muted.has(ev.id)) {
        const p = list.find((x) => x.id === ev.id);
        if (els[ev.id]) say(els[ev.id], ev.text);
        addLine(ev.name || (p && p.name) || "Linh hồn", ev.text, { id: ev.id, real: p && p.real, toMe: ev.toMe });
      }
      const nReal = list.filter((p) => p.real).length;
      $("#who").textContent = `👻 ${list.length + 1} linh hồn ở sảnh${nReal ? ` · ${nReal} người thật` : ""}`;
    });
    $("#quick").innerHTML = room.cheers.map((c) => `<button type="button">${esc(c)}</button>`).join("");
    $("#quick").querySelectorAll("button").forEach((b) => b.onclick = () => sendText(b.textContent));
    cleanup = () => room.leave();
  }

  // ---------------- Floor ----------------
  function renderFloor(n) {
    const f = floorOf(n);
    const steps = f.steps || [f.task];
    const owe = S.debt[f.n] || 0;
    const act = ACTS[f.n] || ["✨", "✨"];
    let stepIdx = 0;

    view.innerHTML = `
      <button class="back" id="back">← Về sảnh</button>
      <div class="scene ${f.special ? "special" : ""}" style="--c:${f.color}" id="scene">
        ${stars()}
        <span class="lantern" style="left:10%">🏮</span><span class="lantern" style="right:10%;animation-delay:-1.5s">🏮</span>
        <span class="tag">${f.special ? esc(f.name) : `Tầng ${f.n} · ${esc(f.name)}`}</span>
        <div class="prop" id="prop">${f.prop}</div>
        <div class="actor" id="actor"><div class="body">${soulSVG("sad", "")}</div><span class="tool">${act[0]}</span></div>
        ${guideSVG("guide-s")}
        <div class="tapzone" id="tapzone" hidden></div>
      </div>
      <div id="panel"></div>`;
    $("#back").onclick = () => go("lobby", f.n);

    const panel = $("#panel");
    const scene = $("#scene");
    const actor = $("#actor");

    // --- hoạt hoạ nhân vật làm việc ---
    const setBody = (mood) => { actor.querySelector(".body").innerHTML = soulSVG(mood, ""); };
    const work = (mode) => { scene.classList.add("working"); actor.className = `actor ${mode}`; };
    const strike = () => { actor.classList.remove("strike"); void actor.offsetWidth; actor.classList.add("strike"); };
    const fx = (n = 1) => {
      const r = $("#prop").getBoundingClientRect(), s = scene.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const e = document.createElement("span");
        e.className = "fx"; e.textContent = act[1];
        e.style.left = `${r.left - s.left + r.width / 2 + (Math.random() - .5) * r.width}px`;
        e.style.top = `${r.top - s.top + r.height / 2 + (Math.random() - .5) * r.height * .6}px`;
        e.style.setProperty("--dx", `${(Math.random() - .5) * 80}px`);
        scene.appendChild(e); setTimeout(() => e.remove(), 1100);
      }
    };
    // đạo cụ từ xám xịt -> tươi sáng theo tiến độ tổng
    const glow = (p) => {
      const total = (stepIdx + p) / steps.length;
      $("#prop").style.filter = `grayscale(${(0.85 * (1 - total)).toFixed(2)}) brightness(${(0.7 + 0.3 * total).toFixed(2)})`;
    };
    glow(0);

    // Intro
    panel.innerHTML = `
      <div class="card">
        <h3>${esc(f.sin)}</h3>
        <p class="sub">${esc(f.story)}</p>
        <p class="sub">${owe ? `Bạn đang nợ <b>${owe}</b> phần nghiệp ở tầng này. Mỗi lượt hoàn thành trả được ${f.special ? "3 phần" : "1 phần"}.`
          : "Bạn không nợ gì ở tầng này. Hoàn thành để tích <b>công đức tu dưỡng</b>."}</p>
      </div>
      <div style="height:14px"></div>
      <button class="btn" id="begin">${f.special ? "Mở cổng tầng 19" : "Bắt đầu trả nghiệp"}</button>`;
    $("#begin").onclick = () => runStep();

    function stepsBar() {
      if (steps.length < 2) return "";
      return `<div class="steps">${steps.map((_, i) => `<i class="${i < stepIdx ? "ok" : i === stepIdx ? "on" : ""}"></i>`).join("")}</div>`;
    }

    function runStep() {
      const t = steps[stepIdx];
      const next = () => { stepIdx++; stepIdx < steps.length ? runStep() : finish(); };
      ({ tap: doTap, hold: doHold, breathe: doBreathe })[t.type](t, next);
    }

    function setProgress(p, right) {
      glow(Math.min(1, p));
      $("#bar").style.width = `${Math.min(100, p * 100)}%`;
      $("#cnt").textContent = right;
    }

    function taskPanel(t, extra = "") {
      panel.innerHTML = `
        ${stepsBar()}
        <div class="task-label"><span>${esc(t.label)}</span><span id="cnt"></span></div>
        <div class="progress"><i id="bar"></i></div>
        ${extra}`;
    }

    function doTap(t, done) {
      taskPanel(t, `<p class="sub center">Chạm vào khung hình phía trên 👆</p>`);
      const zone = $("#tapzone"); zone.hidden = false;
      const prop = $("#prop");
      work("tapper");
      let c = 0; setProgress(0, `0/${t.count}`);
      const onTap = (e) => {
        e.preventDefault();
        if (c >= t.count) return;
        c++; vibrate(10); strike(); fx(1);
        prop.classList.add("hit"); setTimeout(() => prop.classList.remove("hit"), 110);
        const r = scene.getBoundingClientRect();
        const pt = e.touches ? e.touches[0] : e;
        const s = document.createElement("span");
        s.className = "float-txt"; s.textContent = "-1 🔥";
        s.style.left = `${(pt.clientX || r.left + r.width / 2) - r.left - 16}px`;
        s.style.top = `${(pt.clientY || r.top + r.height / 2) - r.top - 16}px`;
        scene.appendChild(s); setTimeout(() => s.remove(), 900);
        setProgress(c / t.count, `${c}/${t.count}`);
        if (c >= t.count) { zone.hidden = true; zone.onpointerdown = null; setTimeout(done, 350); }
      };
      zone.onpointerdown = onTap;
    }

    function doHold(t, done) {
      taskPanel(t, `<div style="height:12px"></div>
        <button class="btn holdbtn" id="hold"><i class="fill" id="hfill"></i><span>Giữ ngón tay ở đây ✋</span></button>
        <p class="sub center">Buông tay thì tạm dừng, không mất tiến độ đâu.</p>`);
      const btn = $("#hold"), prop = $("#prop");
      const total = t.seconds * 1000;
      let acc = 0, last = 0, raf = 0, holding = false, lastFx = 0;
      work("holder");
      setProgress(0, `0/${t.seconds}s`);
      const tick = (ts) => {
        if (!holding) return;
        if (last) acc += ts - last;
        last = ts;
        if (ts - lastFx > 280) { lastFx = ts; fx(1); }
        const p = acc / total;
        setProgress(p, `${Math.min(t.seconds, Math.floor(acc / 1000))}/${t.seconds}s`);
        $("#hfill").style.width = `${Math.min(100, p * 100)}%`;
        prop.style.transform = `translate(-50%,-50%) rotate(${Math.sin(ts / 60) * 5}deg) scale(${1 + p * 0.1})`;
        if (acc >= total) { holding = false; vibrate([20, 40, 20]); prop.style.transform = ""; setTimeout(done, 300); return; }
        raf = requestAnimationFrame(tick);
      };
      const start = (e) => { e.preventDefault(); if (acc >= total) return; holding = true; last = 0; vibrate(15); actor.classList.add("busy"); raf = requestAnimationFrame(tick); };
      const stop = () => { holding = false; actor.classList.remove("busy"); cancelAnimationFrame(raf); };
      btn.addEventListener("pointerdown", start);
      ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => btn.addEventListener(ev, stop));
      btn.addEventListener("contextmenu", (e) => e.preventDefault());
      cleanup = stop;
    }

    function doBreathe(t, done) {
      taskPanel(t, `<div style="height:12px"></div><button class="btn ghost" id="bstart">Bắt đầu thở 🌬️</button>
        <p class="sub center">Hít vào 4 giây, thở ra 4 giây.</p>`);
      setProgress(0, `0/${t.cycles} nhịp`);
      $("#prop").style.opacity = ".25";
      const ring = document.createElement("div"); ring.className = "breath"; ring.textContent = "Sẵn sàng";
      scene.appendChild(ring);
      let timers = [];
      cleanup = () => timers.forEach(clearTimeout);
      work("sitter");
      $("#bstart").onclick = (e) => {
        e.currentTarget.disabled = true;
        setBody("calm"); actor.classList.add("busy");
        let i = 0;
        const cycle = () => {
          ring.textContent = "Hít vào…"; ring.classList.add("in");
          timers.push(setTimeout(() => {
            ring.textContent = "Thở ra…"; ring.classList.remove("in"); fx(3);
            timers.push(setTimeout(() => {
              i++; setProgress(i / t.cycles, `${i}/${t.cycles} nhịp`); vibrate(10);
              if (i < t.cycles) cycle();
              else { ring.textContent = "Nhẹ lòng 🌸"; timers.push(setTimeout(() => { ring.remove(); $("#prop").style.opacity = ""; setBody("sad"); done(); }, 900)); }
            }, 4000));
          }, 4000));
        };
        cycle();
      };
    }

    function finish() {
      const pay = Math.min(owe, f.special ? 3 : 1);
      if (pay) { S.debt[f.n] = owe - pay; if (!S.debt[f.n]) delete S.debt[f.n]; S.paid += pay; }
      else S.merit += 1;
      if (!S.debt[f.n]) S.cleared[f.n] = true;
      markDay();
      S.log.unshift({ t: Date.now(), type: "pay", floor: f.n, amt: pay });
      S.log = S.log.slice(0, 80);
      save();

      // nhân vật vui lên, cất dụng cụ, đạo cụ nở thành sen
      scene.classList.remove("working"); actor.className = "actor cheer";
      setBody("happy");
      $("#prop").style.filter = "";
      $("#prop").classList.add("bloom"); $("#prop").textContent = "🪷";
      fx(6);
      petals(14);

      const left = S.debt[f.n] || 0;
      panel.innerHTML = `
        <div class="card center">
          <span class="lotus-burst">🌸</span>
          <h3>${pay ? `Đã trả ${pay} phần nghiệp` : "Tu dưỡng thêm +1 công đức"}</h3>
          <p class="sub">${left ? `Còn ${left} phần ở tầng này — quay lại lúc khác nhé.` : "Tầng này đã nhẹ nhõm rồi."}</p>
          <div style="height:12px"></div>
          <p class="lesson">“${esc(f.lesson)}”</p>
        </div>
        <div style="height:12px"></div>
        <div class="card">
          <b>Việc thiện ngoài đời 🌱</b>
          <button class="deed" id="deed"><span class="box"></span>
            <p>${esc(f.deed)}<br><small>Đánh dấu khi bạn đã làm thật — được +2 công đức.</small></p></button>
        </div>
        <div style="height:14px"></div>
        <div class="row">
          <button class="btn ghost" id="again">${left ? "Trả tiếp" : "Làm lại"}</button>
          <button class="btn" id="home">Về sảnh</button>
        </div>`;
      $("#again").onclick = () => go("floor", f.n);
      $("#home").onclick = () => go("lobby", f.n);
      $("#deed").onclick = (e) => {
        const el = e.currentTarget;
        if (el.classList.contains("checked")) return;
        el.classList.add("checked"); el.querySelector(".box").textContent = "✓";
        S.merit += 2; S.log.unshift({ t: Date.now(), type: "deed", floor: f.n }); save();
        toast("+2 công đức 🪷 Việc tốt nhỏ, ý nghĩa lớn!");
        petals(8, "🪷");
      };
      if (totalDebt() === 0 && pay) setTimeout(() => toast("Sổ nghiệp đã sạch! Siêu thoát nhẹ nhàng 🌈"), 800);
    }
  }

  function petals(n, ch = "🌸") {
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "petal"; p.textContent = ch;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.animationDuration = `${2 + Math.random() * 2}s`;
      p.style.animationDelay = `${Math.random() * .6}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }
  }

  // ---------------- Reflect ----------------
  function renderReflect() {
    let sel = null, w = 1;
    view.innerHTML = `
      <div class="hero">${guideSVG()}<div class="bubble">Ngồi xuống, thở một hơi. Gần đây bạn có điều gì thấy chưa ổn không? Không ai phán xét ở đây đâu.</div></div>
      <h2>Tự soi</h2>
      <label class="lbl">1. Điều đó giống với…</label>
      <div class="chips">${FLOORS.map((f) => `<button class="chip ${f.special ? "special" : ""}" data-n="${f.n}"><span>${f.prop}</span>${esc(f.special ? "Tầng 19: " + f.sin.split(":")[1].trim() : f.sin)}</button>`).join("")}</div>
      <label class="lbl">2. Mức độ</label>
      <div class="weights">${WEIGHTS.map((x) => `<button data-w="${x.v}" class="${x.v === 1 ? "sel" : ""}"><b>${x.label}</b><small>${x.hint}</small></button>`).join("")}</div>
      <label class="lbl">3. Ghi chú riêng <small style="color:var(--muted);font-weight:600">(chỉ lưu trên máy bạn)</small></label>
      <textarea id="note" maxlength="280" placeholder="Ví dụ: Hôm qua mình lỡ nói nặng lời với em…"></textarea>
      <div style="height:16px"></div>
      <button class="btn" id="submit" disabled>Ghi vào sổ nghiệp</button>
      <p class="note">Nếu điều bạn đang mang thật sự nặng lòng, hãy chia sẻ với người thân, bạn bè hoặc chuyên gia tâm lý. Bạn không phải gánh một mình. 💛</p>`;

    view.querySelectorAll(".chip").forEach((c) => c.onclick = () => {
      view.querySelectorAll(".chip").forEach((x) => x.classList.remove("sel"));
      c.classList.add("sel"); sel = +c.dataset.n; $("#submit").disabled = false;
    });
    view.querySelectorAll(".weights button").forEach((b) => b.onclick = () => {
      view.querySelectorAll(".weights button").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel"); w = +b.dataset.w;
    });
    $("#submit").onclick = () => {
      const f = floorOf(sel);
      const amt = f.special ? w * 3 : w;
      S.debt[f.n] = (S.debt[f.n] || 0) + amt;
      delete S.cleared[f.n];
      S.log.unshift({ t: Date.now(), type: "add", floor: f.n, amt, note: $("#note").value.trim().slice(0, 280) });
      S.log = S.log.slice(0, 80);
      markDay(); save();
      toast(`Đã ghi ${amt} phần nghiệp vào ${f.special ? "tầng 19" : "tầng " + f.n}. Dũng cảm lắm!`);
      go("floor", f.n);
    };
  }

  // ---------------- Book ----------------
  function renderBook() {
    const d = totalDebt();
    const ratio = S.paid + d ? S.paid / (S.paid + d) : 1;
    const fmt = (t) => new Date(t).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    const row = (e) => {
      const f = floorOf(e.floor);
      const where = f.special ? "Tầng 19" : `Tầng ${f.n}`;
      if (e.type === "add") return `<li><span class="e">📝</span><div>Ghi ${e.amt} phần nghiệp · ${where}${e.note ? `<small>“${esc(e.note)}”</small>` : ""}<small>${fmt(e.t)}</small></div></li>`;
      if (e.type === "deed") return `<li><span class="e">🌱</span><div>Làm việc thiện · ${where}<small>${esc(f.deed)}</small><small>${fmt(e.t)}</small></div></li>`;
      return `<li><span class="e">${e.amt ? "🔥" : "🪷"}</span><div>${e.amt ? `Trả ${e.amt} phần nghiệp` : "Tu dưỡng +1 công đức"} · ${where}<small>${fmt(e.t)}</small></div></li>`;
    };
    view.innerHTML = `
      <div class="hero">${soulSVG(d ? "sad" : "happy", "guide")}<div class="bubble">${d
        ? `Còn <b>${d}</b> phần nghiệp. Từ từ thôi, mỗi ngày một chút.`
        : `Nhẹ tênh! Linh hồn bạn đang có vầng hào quang ✨`}</div></div>
      <h2>Sổ nghiệp của ${esc(S.name)}</h2>
      <div class="stats">
        <div class="stat"><b>${S.paid}</b><small>Đã trả</small></div>
        <div class="stat"><b>${S.merit}</b><small>Công đức</small></div>
        <div class="stat"><b>${streak()}🔥</b><small>Ngày liên tiếp</small></div>
      </div>
      <div class="task-label"><span>Độ nhẹ lòng</span><span>${Math.round(ratio * 100)}%</span></div>
      <div class="meter" style="margin-top:6px"><i style="width:${ratio * 100}%"></i></div>
      <label class="lbl">Nhật ký</label>
      ${S.log.length ? `<ul class="log">${S.log.map(row).join("")}</ul>` : `<p class="empty">Chưa có gì. Bắt đầu từ mục Tự soi nhé.</p>`}
      <div style="height:20px"></div>
      <button class="btn ghost" id="reset">Làm lại từ đầu (đầu thai) 🔄</button>
      <p class="note">Mọi dữ liệu chỉ lưu trên thiết bị của bạn.</p>`;
    $("#reset").onclick = () => {
      if (!confirm("Xóa toàn bộ sổ nghiệp và bắt đầu lại?")) return;
      S = fresh(); save(); go("onboard");
    };
  }

  // ---------------- Boot ----------------
  updatePills();
  go(S.name ? "map" : "onboard");

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
