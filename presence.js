// Lớp "presence": ai đang ở sảnh mỗi tầng + tin nhắn trong sảnh.
// Luôn có linh hồn MÔ PHỎNG cho sảnh đỡ trống. Nếu config.js có cấu hình Firebase,
// người THẬT cũng xuất hiện (đánh dấu chấm xanh) và tin nhắn được gửi cho nhau.
//
// Giao diện: Presence.join(n, me, onUpdate) -> { leave, move(x,y), cheer(soul), say(text) }
//   onUpdate(list, ev?)  list: [{id,name,tint,x,y,working,halo,real}]  ev: {id, name, text}
(() => {
  const NAMES = ["Hồn Mít", "Bé Na", "Tí Nị", "Mây Trắng", "Hạt Tiêu", "Bánh Bao", "Ốc Nhỏ", "Kẹo Dẻo", "Lá Me", "Su Su", "Bí Ngô", "Gạo Nếp"];
  const TINTS = ["#fffaf5", "#e6f2ff", "#fff1d6", "#efe4ff", "#e3fbee", "#ffe6ee"];
  const SAY = ["Cố lên mọi người ơi!", "Tầng này nhẹ hơn mình nghĩ", "Mình còn nợ 2 phần 😅", "Vừa gọi điện cho mẹ xong 🥹",
    "Hít sâu… thở ra…", "Lần sau mình sẽ cẩn thận hơn", "Ai đi cùng mình không?", "Trả xong thấy nhẹ cả người"];
  const SAY19 = ["Từ nay đọc kỹ rồi mới share", "Xoá bình luận cũ rồi nè", "Mạng ảo, nghiệp thật 😔"];
  const THANKS = ["Cảm ơn bạn 💛", "Bạn cũng cố lên nha!", "Ấm lòng ghê 🥹"];
  const REPLY = ["Đúng rồi đó 😊", "Mình cũng nghĩ vậy", "Cùng cố gắng nha!", "💛"];
  const CHEERS = ["Cố lên mọi người! 💪", "Mình vừa trả xong 🪷", "Hít thở sâu nha 🌬️", "Cảm ơn cả nhà 💛"];

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const uid = (() => {
    try { let u = localStorage.getItem("helling.uid"); if (!u) { u = "u" + Math.random().toString(36).slice(2, 10); localStorage.setItem("helling.uid", u); } return u; }
    catch { return "u" + Math.random().toString(36).slice(2, 10); }
  })();

  // ---------- Lọc tin nhắn (phía máy người dùng) ----------
  const BAD = ["địt", "đụ", "đéo", "lồn", "buồi", "cặc", "đĩ", "đm", "dm", "đcm", "dcm", "đmm", "dmm", "cmm", "vcl", "vkl", "vl", "cc", "clm",
    "óc chó", "thằng chó", "con chó", "mặt lồn", "ngu như", "chết đi", "fuck", "shit", "bitch", "dick"];
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const BAD_RE = new RegExp(`(^|[^\\p{L}])(${BAD.map(escRe).join("|")})(?=$|[^\\p{L}])`, "giu");
  const LINK_RE = /(https?:\/\/|www\.|\b[\w-]+\.(com|net|vn|io|me|xyz|top|link|ly)\b)/i;
  const PHONE_RE = /(\d[\s.-]?){8,}/;
  // Lọc nội dung (dùng cho cả tin gửi đi và tin nhận về)
  function clean(raw) {
    const text = String(raw || "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (!text) return { ok: false, why: "Tin nhắn trống" };
    if (LINK_RE.test(text) || PHONE_RE.test(text)) return { ok: false, why: "Không gửi đường link hay số điện thoại trong sảnh nhé" };
    const out = text.replace(BAD_RE, (m, pre) => pre + "🌸");
    return { ok: true, text: out, softened: out !== text };
  }
  // Giới hạn tốc độ gửi: 3 giây/tin, tối đa 6 tin/phút
  let sent = [];
  function moderate(raw) {
    const now = Date.now();
    sent = sent.filter((t) => now - t < 60000);
    if (sent.length && now - sent[sent.length - 1] < 3000) return { ok: false, why: "Chậm lại chút, 3 giây một tin nha" };
    if (sent.length >= 6) return { ok: false, why: "Nghỉ một phút rồi nhắn tiếp nhé" };
    const r = clean(raw);
    if (r.ok) sent.push(now);
    return r;
  }

  // ---------- Mô phỏng ----------
  const count = (n) => 2 + ((n * 7 + new Date().getHours() * 3) % 5);
  const spawn = () => ({
    id: "s" + Math.random().toString(36).slice(2, 8), name: pick(NAMES), tint: pick(TINTS),
    x: rnd(16, 84), y: rnd(58, 88), working: Math.random() < 0.3, halo: Math.random() < 0.25, real: false
  });

  // ---------- Firebase (tuỳ chọn) ----------
  const CFG = window.HELLING_FIREBASE;
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  let dbPromise = null;
  const loadScript = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  function db() {
    if (!CFG) return Promise.resolve(null);
    if (!dbPromise) dbPromise = loadScript(SDK + "firebase-app-compat.js")
      .then(() => loadScript(SDK + "firebase-database-compat.js"))
      .then(() => { if (!firebase.apps.length) firebase.initializeApp(CFG); return firebase.database(); })
      .catch((e) => { console.warn("Firebase không tải được, dùng mô phỏng", e); return null; });
    return dbPromise;
  }

  function join(n, me, onUpdate) {
    const sims = Array.from({ length: count(n) }, spawn);
    let reals = [];
    const lines = n === 19 ? SAY19.concat(SAY) : SAY;
    const all = () => sims.concat(reals);
    const emit = (ev) => onUpdate(all(), ev);
    emit();

    const timer = setInterval(() => {
      const r = Math.random(), p = sims.length ? pick(sims) : null;
      if (p && r < 0.4) { p.x = rnd(16, 84); p.y = rnd(58, 88); emit(); }
      else if (p && r < 0.62) emit({ id: p.id, name: p.name, text: pick(lines) });
      else if (p && r < 0.78) { p.working = !p.working; if (!p.working && Math.random() < 0.5) p.halo = true; emit(); }
      else if (r < 0.88 && sims.length > 2) { sims.splice(sims.indexOf(p), 1); emit(); }
      else if (sims.length < 6) { const q = spawn(); sims.push(q); emit({ id: q.id, name: q.name, text: "Xin chào cả nhà 👋" }); }
    }, 2400);

    // người thật
    let ref = null, soulsRef = null, msgsRef = null, alive = true;
    const self = { name: me.name, tint: me.tint || "#fffaf5", x: me.x || 50, y: me.y || 80, halo: !!me.halo, t: Date.now() };
    db().then((d) => {
      if (!d || !alive) return;
      const room = d.ref(`rooms/f${n}`);
      ref = room.child(`souls/${uid}`);
      ref.onDisconnect().remove();
      ref.set(self);
      soulsRef = room.child("souls");
      soulsRef.on("value", (snap) => {
        const v = snap.val() || {}, now = Date.now();
        reals = Object.entries(v)
          .filter(([id, s]) => id !== uid && s && now - (s.t || 0) < 10 * 60000)
          .map(([id, s]) => ({ id, name: String(s.name || "Linh hồn").slice(0, 24), tint: s.tint || "#fffaf5", x: +s.x || 50, y: +s.y || 80, halo: !!s.halo, working: false, real: true }));
        emit();
      });
      const since = Date.now();
      msgsRef = room.child("msgs");
      msgsRef.orderByChild("t").startAt(since).limitToLast(30).on("child_added", (snap) => {
        const m = snap.val();
        if (!m || m.from === uid) return;
        const r = clean(m.text); // lọc lại phía người nhận
        if (!r.ok) return;
        emit({ id: m.from, name: String(m.name || "").slice(0, 24), text: r.text, toMe: m.to === uid });
      });
    });

    const send = (text, to) => msgsRef && msgsRef.push({ from: uid, name: self.name, text, to: to || null, t: firebase.database.ServerValue.TIMESTAMP });

    return {
      cheers: CHEERS,
      online: () => !!ref,
      leave() { alive = false; clearInterval(timer); if (soulsRef) soulsRef.off(); if (msgsRef) msgsRef.off(); if (ref) ref.remove(); },
      move(x, y) { self.x = x; self.y = y; self.t = Date.now(); if (ref) ref.update({ x, y, t: self.t }); },
      cheer(p) {
        const text = `Cố lên ${p.name}!`;
        if (p.real) send(text, p.id);
        else setTimeout(() => emit({ id: p.id, name: p.name, text: pick(THANKS) }), 700);
        return text;
      },
      say(raw) {
        const r = moderate(raw);
        if (!r.ok) return r;
        send(r.text);
        if (sims.length && Math.random() < 0.6) { const p = pick(sims); setTimeout(() => emit({ id: p.id, name: p.name, text: pick(REPLY) }), 1200); }
        return r;
      }
    };
  }

  window.Presence = { join, count, clean, isReal: () => !!CFG };
})();
