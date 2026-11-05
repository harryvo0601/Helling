// Dữ liệu 19 tầng. Tên tầng lấy cảm hứng từ tín ngưỡng dân gian "Thập Bát Tầng Địa Ngục",
// được diễn giải lại theo hướng nhẹ nhàng: mỗi "hình phạt" là một việc nhỏ giúp mình tự soi lại bản thân.
// task.type: "tap" (chạm N lần) | "hold" (giữ N giây) | "breathe" (thở theo N nhịp)

window.FLOORS = [
  {
    n: 1, name: "Bạt Thiệt", prop: "👅", color: "#ff8a80",
    sin: "Nói xấu, đặt điều sau lưng",
    story: "Lưỡi của bạn đã lỡ thắt vài cái nút vì những lời không hay. Cùng gỡ ra nhé.",
    task: { type: "tap", count: 12, label: "Chạm để gỡ nút thắt" },
    lesson: "Lời nói không mất tiền mua, nhưng cũng không lấy lại được.",
    deed: "Khen thật lòng một người hôm nay."
  },
  {
    n: 2, name: "Tiễn Đao", prop: "✂️", color: "#ffab91",
    sin: "Xúi giục, gây chia rẽ",
    story: "Những sợi chỉ rối do bạn gây ra đang chờ được cắt gọn gàng.",
    task: { type: "tap", count: 10, label: "Chạm để cắt chỉ rối" },
    lesson: "Gắn kết thì khó, chia rẽ thì dễ — chọn việc khó mới đáng.",
    deed: "Làm cầu nối hòa giải cho hai người đang giận nhau."
  },
  {
    n: 3, name: "Thiết Thụ", prop: "🌳", color: "#a5d6a7",
    sin: "Ly gián người thân",
    story: "Cây sắt khô cằn cần được tưới bằng sự kiên nhẫn.",
    task: { type: "hold", seconds: 5, label: "Giữ để tưới cây" },
    lesson: "Gia đình là cái cây — tưới đều tay thì mới nở hoa.",
    deed: "Gọi điện hỏi thăm một người thân lâu rồi chưa liên lạc."
  },
  {
    n: 4, name: "Nghiệt Kính", prop: "🪞", color: "#b39ddb",
    sin: "Che giấu lỗi lầm, đổ lỗi cho người khác",
    story: "Tấm gương này chỉ phản chiếu sự thật. Hít thở và nhìn thẳng vào nó.",
    task: { type: "breathe", cycles: 3, label: "Thở cùng tấm gương" },
    lesson: "Nhận lỗi không làm mình nhỏ đi, mà làm mình lớn lên.",
    deed: "Chủ động nhận một lỗi nhỏ mà bạn từng lảng tránh."
  },
  {
    n: 5, name: "Chưng Lung", prop: "🥟", color: "#ffe082",
    sin: "Ngồi lê đôi mách, buôn chuyện người khác",
    story: "Lồng hấp đầy bánh bao tin đồn. Mở nắp cho hơi bay đi.",
    task: { type: "tap", count: 8, label: "Chạm để mở nắp xửng" },
    lesson: "Chuyện của người, để người tự kể.",
    deed: "Hôm nay, khi nghe chuyện ai đó, hãy dừng lại ở bạn."
  },
  {
    n: 6, name: "Đồng Trụ", prop: "🏮", color: "#ffcc80",
    sin: "Cố ý gây hại, phá hoại công sức người khác",
    story: "Cột đồng đã nguội. Lau sạch nó bằng sự hối lỗi.",
    task: { type: "hold", seconds: 6, label: "Giữ để lau cột đồng" },
    lesson: "Xây mất mười năm, phá chỉ một phút.",
    deed: "Giúp ai đó hoàn thành một việc họ đang làm dở."
  },
  {
    n: 7, name: "Đao Sơn", prop: "⛰️", color: "#90caf9",
    sin: "Sát sinh vô cớ, tàn nhẫn với sinh linh",
    story: "Núi đao đã được bọc bông. Bạn chỉ cần leo lên từng bước.",
    task: { type: "tap", count: 15, label: "Chạm để leo từng bước" },
    lesson: "Mọi sinh linh đều muốn được sống, như mình.",
    deed: "Cho một con vật nhỏ ăn, hoặc thả một con côn trùng ra ngoài."
  },
  {
    n: 8, name: "Băng Sơn", prop: "🧊", color: "#80deea",
    sin: "Lạnh nhạt, vô tâm với cha mẹ",
    story: "Núi băng lạnh lẽo chờ hơi ấm từ đôi tay bạn.",
    task: { type: "hold", seconds: 7, label: "Giữ để sưởi ấm băng" },
    lesson: "Cha mẹ không cần nhiều — chỉ cần mình nhớ đến.",
    deed: "Nhắn cho bố mẹ một câu yêu thương (không cần lý do)."
  },
  {
    n: 9, name: "Du Oa", prop: "🍲", color: "#ffb74d",
    sin: "Trộm cắp, lừa gạt",
    story: "Vạc dầu nay đã thành nồi canh. Khuấy đều để chia cho mọi người.",
    task: { type: "tap", count: 12, label: "Chạm để khuấy nồi" },
    lesson: "Của phi nghĩa có giàu đâu.",
    deed: "Trả lại một món đồ mượn mà bạn đã quên."
  },
  {
    n: 10, name: "Ngưu Khanh", prop: "🐮", color: "#bcaaa4",
    sin: "Ngược đãi động vật",
    story: "Bạn bò ở đây hơi buồn. Vuốt ve cho bạn ấy vui lại nhé.",
    task: { type: "tap", count: 10, label: "Chạm để vuốt ve bạn bò" },
    lesson: "Đối xử với loài vật thế nào, lòng mình thế ấy.",
    deed: "Ủng hộ một trạm cứu hộ động vật, dù chỉ bằng một lượt chia sẻ."
  },
  {
    n: 11, name: "Thạch Áp", prop: "🪨", color: "#b0bec5",
    sin: "Đẩy gánh nặng lên người khác, trốn việc",
    story: "Hòn đá bạn né tránh vẫn ở đây. Lần này, tự đẩy nó đi.",
    task: { type: "hold", seconds: 6, label: "Giữ để đẩy đá" },
    lesson: "Việc mình né, người khác phải gánh.",
    deed: "Nhận làm một việc nhà mà bạn hay để người khác làm."
  },
  {
    n: 12, name: "Thung Cữu", prop: "🍚", color: "#fff59d",
    sin: "Phí phạm đồ ăn, của cải",
    story: "Cối giã gạo đang chờ. Mỗi hạt gạo là một giọt mồ hôi.",
    task: { type: "tap", count: 14, label: "Chạm để giã gạo" },
    lesson: "Hạt gạo một nắng hai sương.",
    deed: "Ăn hết phần cơm hôm nay, không bỏ thừa."
  },
  {
    n: 13, name: "Huyết Trì", prop: "🪷", color: "#f48fb1",
    sin: "Vô lễ, bất kính người khác",
    story: "Ao đỏ nay mọc đầy sen. Cúi chào từng bông một.",
    task: { type: "tap", count: 9, label: "Chạm để cúi chào" },
    lesson: "Tôn trọng người khác là tôn trọng chính mình.",
    deed: "Nói lời cảm ơn với người phục vụ, bảo vệ, lao công hôm nay."
  },
  {
    n: 14, name: "Sa Lậu", prop: "⏳", color: "#ce93d8",
    sin: "Thất hứa, trễ hẹn liên tục",
    story: "Đồng hồ cát của những lời hứa. Lật lại và chờ cát rơi hết.",
    task: { type: "breathe", cycles: 3, label: "Thở chậm theo cát rơi" },
    lesson: "Lời hứa là món nợ không ghi sổ.",
    deed: "Thực hiện một lời hứa nhỏ bạn còn nợ ai đó."
  },
  {
    n: 15, name: "Hỏa Sơn", prop: "🌋", color: "#ff7043",
    sin: "Nóng giận, cáu gắt vô cớ",
    story: "Núi lửa trong lòng đang sôi. Hít sâu để nó nguội dần.",
    task: { type: "breathe", cycles: 4, label: "Thở để hạ hỏa" },
    lesson: "Một phút nóng giận, cả đời phải nhịn.",
    deed: "Xin lỗi người mà bạn đã to tiếng gần đây."
  },
  {
    n: 16, name: "Thạch Ma", prop: "⚙️", color: "#a1887f",
    sin: "Tham lam, vụ lợi",
    story: "Cối đá xay lòng tham thành bột mịn. Quay đều tay nào.",
    task: { type: "hold", seconds: 7, label: "Giữ để quay cối" },
    lesson: "Biết đủ là đủ, đợi đủ bao giờ mới đủ.",
    deed: "Cho đi một món đồ bạn không còn dùng."
  },
  {
    n: 17, name: "Đao Cứ", prop: "🪵", color: "#8d6e63",
    sin: "Gian lận, cân điêu, làm ăn bất chính",
    story: "Khúc gỗ cần được cưa cho thẳng thớm, như cách làm ăn tử tế.",
    task: { type: "tap", count: 16, label: "Chạm để cưa gỗ" },
    lesson: "Buôn có bạn, bán có phường — giữ chữ tín.",
    deed: "Làm một việc đúng quy định dù không ai nhìn thấy."
  },
  {
    n: 18, name: "Vô Gián", prop: "🔗", color: "#7986cb",
    sin: "Phản bội lòng tin",
    story: "Tầng sâu nhất của 18 tầng. Từng mắt xích lòng tin cần được nối lại.",
    task: { type: "tap", count: 18, label: "Chạm để nối mắt xích" },
    lesson: "Lòng tin như tờ giấy — nhàu rồi khó phẳng lại.",
    deed: "Thành thật với một người về điều bạn từng giấu."
  },
  {
    n: 19, name: "Tầng 19 · Mạng Ảo", prop: "📱", color: "#b388ff", special: true,
    sin: "Siêu tội lỗi thời đại số: lừa đảo online, bạo lực mạng, tung tin giả",
    story: "Tầng mới mở cho những tội lan nhanh hơn ánh sáng. Ở đây phải trả đủ ba phần.",
    steps: [
      { type: "tap", count: 25, label: "Chạm để gỡ từng bình luận ác ý" },
      { type: "hold", seconds: 6, label: "Giữ để chặn tin giả lan ra" },
      { type: "breathe", cycles: 3, label: "Thở trước khi bấm 'Đăng'" }
    ],
    lesson: "Màn hình không che được lương tâm. Một cú chạm có thể làm tổn thương thật.",
    deed: "Kiểm chứng một tin trước khi chia sẻ, hoặc để lại một bình luận tử tế."
  }
];

window.WEIGHTS = [
  { v: 1, label: "Nhẹ", hint: "lỡ một lần" },
  { v: 2, label: "Vừa", hint: "hay tái phạm" },
  { v: 3, label: "Nặng", hint: "biết mà vẫn làm" }
];

// Hoạt hoạ trả nghiệp: [dụng cụ nhân vật cầm, hiệu ứng bay ra từ đạo cụ]
window.ACTS = {
  1: ["🪡", "✨"], 2: ["✂️", "🧵"], 3: ["🚿", "💧"], 4: ["🕯️", "✨"], 5: ["🥢", "💨"],
  6: ["🧽", "🫧"], 7: ["🥾", "⭐"], 8: ["🫶", "💗"], 9: ["🥄", "💨"], 10: ["🪮", "💕"],
  11: ["🤲", "💪"], 12: ["🔨", "🍚"], 13: ["🙏", "🪷"], 14: ["🕯️", "✨"], 15: ["🧘", "❄️"],
  16: ["🤲", "🌾"], 17: ["🪚", "🌟"], 18: ["🔧", "🔗"], 19: ["🛡️", "✨"]
};
