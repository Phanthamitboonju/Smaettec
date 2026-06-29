const chat = document.getElementById("chat");
const typing = document.getElementById("typing");
const menu = document.getElementById("menu");

const page1 = ["เข้างาน","ออกงาน","งานวันนี้","ลูกค้า","เพิ่มงาน","รายงาน","หน้า2"];
const page2 = ["ประวัติ","แจ้งเตือน","KPI","เอกสาร","ตั้งค่า","อื่นๆ","กลับ"];

function renderMenu() {
  menu.innerHTML = "";

  const p1 = document.createElement("div");
  p1.className = "page";
  page1.forEach(t => p1.appendChild(createBtn(t)));

  const p2 = document.createElement("div");
  p2.className = "page";
  page2.forEach(t => p2.appendChild(createBtn(t)));

  menu.appendChild(p1);
  menu.appendChild(p2);
}

function createBtn(text) {
  const btn = document.createElement("div");
  btn.className = "btn";
  btn.innerText = text;
  btn.onclick = () => handle(text);
  return btn;
}

function send(text, type="user") {
  const msg = document.createElement("div");
  msg.className = "msg " + type;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  msg.appendChild(bubble);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function handle(text) {
  send(text);

  typing.style.display = "block";

  setTimeout(() => {
    typing.style.display = "none";
    send("ระบบทำงาน: " + text, "bot");
  }, 800);
}

renderMenu();