// Lớp "presence": ai đang ở sảnh mỗi tầng.
// Hiện là BẢN MÔ PHỎNG (linh hồn do máy giả lập). Muốn có người thật, thay hàm join()
// bằng kết nối Firebase/Supabase nhưng giữ nguyên giao diện: join(n, onUpdate) -> { leave, cheer }.
(() => {
  const NAMES = ["Hồn Mít", "Bé Na", "Tí Nị", "Mây Trắng", "Hạt Tiêu", "Bánh Bao", "Ốc Nhỏ", "Kẹo Dẻo", "Lá Me", "Su Su", "Bí Ngô", "Gạo Nếp"];
  const TINTS = ["#fffaf5", "#e6f2ff", "#fff1d6", "#efe4ff", "#e3fbee", "#ffe6ee"];
  const SAY = ["Cố lên mọi người ơi!", "Tầng này nhẹ hơn mình nghĩ", "Mình còn nợ 2 phần 😅", "Vừa gọi điện cho mẹ xong 🥹",
    "Hít sâu… thở ra…", "Lần sau mình sẽ cẩn thận hơn", "Ai đi cùng mình không?", "Trả xong thấy nhẹ cả người"];
  const SAY19 = ["Từ nay đọc kỹ rồi mới share", "Xoá bình luận cũ rồi nè", "Mạng ảo, nghiệp thật 😔"];
  const THANKS = ["Cảm ơn bạn 💛", "Bạn cũng cố lên nha!", "Ấm lòng ghê 🥹"];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  const count = (n) => 2 + ((n * 7 + new Date().getHours() * 3) % 5);
  const spawn = () => ({
    id: Math.random().toString(36).slice(2, 8), name: pick(NAMES), tint: pick(TINTS),
    x: rnd(10, 90), y: rnd(58, 88), working: Math.random() < 0.3, halo: Math.random() < 0.25
  });

  function join(n, onUpdate) {
    const list = Array.from({ length: count(n) }, spawn);
    const lines = n === 19 ? SAY19.concat(SAY) : SAY;
    onUpdate(list);
    const timer = setInterval(() => {
      const r = Math.random(), p = list.length ? pick(list) : null;
      if (p && r < 0.4) { p.x = rnd(10, 90); p.y = rnd(58, 88); onUpdate(list); }
      else if (p && r < 0.65) onUpdate(list, { id: p.id, text: pick(lines) });
      else if (p && r < 0.8) { p.working = !p.working; if (!p.working && Math.random() < 0.5) p.halo = true; onUpdate(list); }
      else if (r < 0.9 && list.length > 2) { list.splice(list.indexOf(p), 1); onUpdate(list); }
      else if (list.length < 7) { const q = spawn(); list.push(q); onUpdate(list, { id: q.id, text: "Xin chào cả nhà 👋" }); }
    }, 2200);
    return {
      leave: () => clearInterval(timer),
      cheer: (id) => setTimeout(() => onUpdate(list, { id, text: pick(THANKS) }), 600)
    };
  }

  window.Presence = { mode: "sim", join, count };
})();
