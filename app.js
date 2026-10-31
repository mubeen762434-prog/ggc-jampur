/* ============================================================
   APP: pages, dashboards, actions, router
   ============================================================ */
const app = $("#app");
let session = null;
try { session = LS.get("session", null); } catch (e) { session = null; }
let dtab = "home", newsCat = "All", attSel = "", markSel = "", markSubj = SUBJ[0];

/* ---------- small helpers ---------- */
const setRoot = (a, v) => { const r = document.documentElement; if (r && r.setAttribute) r.setAttribute(a, v); };
const toast = m => { const e = document.createElement("div"); e.className = "toast"; e.textContent = m; document.body.appendChild(e); setTimeout(() => e.remove(), 2600); };
const sec = (title, sub, inner) => `<section class="section"><h2>${title}</h2>${sub ? `<p class="sub">${sub}</p>` : ""}${inner}</section>`;
const tbl = (h, rows, id) => `<div class="tablewrap"><table${id ? ` id="${id}"` : ""}><thead><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const tag = (x, c = "") => `<span class="tag ${c}">${x}</span>`;
const bar = (p, c = "") => `<div class="bar ${c}"><i style="width:${Math.max(0, Math.min(100, p))}%"></i></div>`;
const empty = m => `<div class="card empty">${m}</div>`;
const val = (f, n) => { try { return (f.elements[n].value || "").toString().trim(); } catch (e) { return ""; } };
const classes = () => [...new Set(db.get("students").map(s => s.cls))];
const deptName = id => (DEPTS.find(d => d.id === id) || { name: id }).name;
const catTag = c => tag(esc(c), c === "Exams" ? "warn" : c === "Admissions" ? "gold" : "");
const lines = (rows) => rows.map(r => `<p style="padding:8px 0;border-bottom:1px solid var(--line)">${r}</p>`).join("");

/* ---------- chrome: nav, ticker, footer ---------- */
function renderNav() {
  const more = [["downloads", "downloads"], ["results", "results"], ["library", "library"], ["societies", "societies"], ["gallery", "gallery"], ["facilities", "facilities"], ["events", "events"], ["faq", "faq"]];
  $("#nav").innerHTML = ["", "about", "departments", "admissions", "faculty", "news"].map(p => `<a href="#/${p}">${t(p || "home")}</a>`).join("") +
    `<div class="dd"><a tabindex="0">${t("more")} ▾</a><div class="ddm">${more.map(m => `<a href="#/${m[0]}">${t(m[1])}</a>`).join("")}</div></div>` +
    `<a href="#/contact">${t("contact")}</a>` +
    `<a href="${session ? "#/dashboard" : "#/login"}" class="btn small" id="loginLink">${session ? t("dashboard") : t("login")}</a>`;
  $("#sq").placeholder = t("search");
  $("#tlabel").textContent = t("latest");
  $("#langBtn").textContent = lang === "en" ? "اردو" : "EN";
  $("#themeBtn").textContent = LS.get("theme", "light") === "dark" ? "☀️" : "🌙";
}
function renderTicker() { $("#ticker").textContent = db.get("notices").map(n => n.t).join("   •   "); }
function renderFoot() {
  $("#foot").innerHTML = `<div class="cols">
    <div><h4>${COLLEGE}</h4><p>Template website. Apna address yahan likhein.</p><p style="margin-top:8px">📞 0000-0000000<br>✉️ info@example.com</p></div>
    <div><h4>${t("quick")}</h4><a href="#/admissions">${t("admissions")}</a><a href="#/results">${t("results")}</a><a href="#/downloads">${t("downloads")}</a><a href="#/faq">${t("faq")}</a><a href="#/contact">${t("contact")}</a></div>
    <div><h4>Portals</h4><a href="#/login">Student Login</a><a href="#/login">Teacher Login</a><a href="#/login">Principal Login</a></div>
    <div><h4>Timings</h4><p>Mon - Sat<br>8:00 AM - 2:00 PM</p></div></div>
  <p class="copy">&copy; 2026 ${COLLEGE} (Demo Template). All rights reserved.</p>`;
}
function applyPrefs() {
  setRoot("data-theme", LS.get("theme", "light"));
  setRoot("lang", lang); setRoot("dir", lang === "ur" ? "rtl" : "ltr");
}

/* ---------- PUBLIC PAGES ---------- */
const pages = {};
const quickLinks = [["📝", "admissions", "#/admissions"], ["📊", "results", "#/results"], ["📥", "downloads", "#/downloads"], ["👥", "faculty", "#/faculty"], ["📚", "library", "#/library"], ["🎉", "events", "#/events"]];

pages["/"] = () => {
  const ns = db.get("notices").slice(0, 5);
  const evs = EVENTS.filter(e => e.d >= today()).slice(0, 4);
  return `<section class="hero"><h1>${COLLEGE}</h1><p>${t("heroSub")}</p>
    <a class="btn gold" href="#/admissions">${t("apply")}</a><a class="btn ghost" href="#/login">${t("portal")}</a>
    <form onsubmit="return act.heroSearch(this)"><input name="q" placeholder="${t("search")}" aria-label="Search"><button class="btn gold">🔍</button></form></section>
  <section class="section"><div class="grid sm">${quickLinks.map(q => `<a class="card link" href="${q[2]}" style="text-align:center"><div style="font-size:32px">${q[0]}</div><b>${t(q[1])}</b></a>`).join("")}</div></section>
  <section class="section stats"><div class="grid">
    <div><b data-count="2500" data-suf="+">2500+</b>Students</div><div><b data-count="90" data-suf="+">90+</b>Teachers</div><div><b data-count="4">4</b>Departments</div><div><b data-count="25" data-suf="+">25+</b>Years</div></div></section>
  ${sec(t("departments"), t("deptsSub"), `<div class="grid">${DEPTS.map(d => `<a class="card link" href="#/dept/${d.id}"><div style="font-size:34px">${d.icon}</div><h3>${d.name}</h3><p>${d.desc}</p></a>`).join("")}</div>`)}
  <section class="section two">
    <div><h2>${t("principalMsg")}</h2><p class="sub">Principal ki taraf se paigham</p><div class="card"><div class="avatar">👤</div><p>Humara maqsad talba ko aisi taleem dena hai jo unhein imtihan ke saath saath zindagi mein bhi kamyab banaye. Aap sab ka humare idare mein khair maqdam hai.</p><p style="margin-top:8px"><b>- Principal Name</b></p></div></div>
    <div><h2>${t("notices")}</h2><p class="sub"><a href="#/news" style="color:var(--primary);font-weight:700">${t("readMore")} →</a></p><div class="card" id="nb">${lines(ns.map(n => `📌 ${esc(n.t)}`))}</div></div></section>
  ${sec(t("upcoming"), "", `<div class="grid">${evs.map(e => `<div class="card"><span class="dbadge">${fmtDate(e.d)}</span><h3>${esc(e.t)}</h3><p>📍 ${esc(e.p)}</p></div>`).join("") || empty("Koi event nahi.")}</div>`)}
  ${sec(t("words"), "", `<div class="grid">${TESTI.map(x => `<div class="card testi"><p>“${esc(x[2])}”</p><p style="margin-top:10px;font-style:normal"><b>${esc(x[0])}</b><br><small>${esc(x[1])}</small></p></div>`).join("")}</div>`)}
  <section class="section"><div class="cta"><h2>Aaj hi apna safar shuru karein</h2><p style="margin:8px 0 18px">Admissions 2026 open hain.</p><a class="btn gold" href="#/admissions">${t("apply")}</a></div></section>`;
};

pages["/about"] = () => sec(t("about"), "Humare baare mein", `
  <div class="grid"><div class="card"><h3>Our Mission</h3><p>Muayari taleem faraham karna aur talba ki sirf ilmi nahi balke akhlaqi tarbiyat bhi karna.</p></div>
  <div class="card"><h3>Our Vision</h3><p>Ilaqe ka behtareen taleemi idara banna jahan har talib-e-ilm apni salahiyaton ko nikhaar sake.</p></div>
  <div class="card"><h3>Core Values</h3><p>Imandari, mehnat, ehtram, nazm-o-zabt aur khidmat-e-khalq.</p></div></div>
  <h3 style="margin:26px 0 12px;color:var(--primary)">History</h3>
  <div class="timeline">${[["19XX", "Idare ki buniyad rakhi gayi (asli saal likhein)."], ["20XX", "Intermediate classes ka aaghaz."], ["20XX", "ADP programs shuru hue."], ["2020+", "BS programs aur computer lab ka izafa."]].map(x => `<div><b>${x[0]}</b><br>${x[1]}</div>`).join("")}</div>`);

pages["/departments"] = () => sec(t("departments"), "11th se BS tak", `<div class="grid">${DEPTS.map(d => `<a class="card link" href="#/dept/${d.id}"><div style="font-size:34px">${d.icon}</div><h3>${d.name}</h3><p>${d.desc}</p><p style="margin-top:8px">${d.groups.map(g => tag(g)).join("")}</p></a>`).join("")}</div>`);

pages["/dept"] = id => {
  const d = DEPTS.find(x => x.id === id) || DEPTS[0];
  const fac = db.get("teachers").filter(x => x.dept === d.id);
  const sc = db.get("students").filter(x => x.dept === d.id).length;
  return sec(`${d.icon} ${d.name}`, d.desc, `
  <div class="tabs">${DEPTS.map(x => `<button class="${x.id === d.id ? "on" : ""}" onclick="location.hash='#/dept/${x.id}'">${x.name}</button>`).join("")}</div>
  <div class="grid sm" style="margin-bottom:20px"><div class="card"><b>${esc(d.hod)}</b><br><small>Head of Department</small></div><div class="card"><b>${fac.length}</b><br><small>Faculty</small></div><div class="card"><b>${sc}</b><br><small>Students (demo list)</small></div><div class="card"><button class="btn small" onclick="act.toastDemo()">📥 Syllabus</button></div></div>
  <h3 style="margin-bottom:8px">Groups / Programs</h3><div class="grid">${d.groups.map(g => `<div class="card"><h3>${g}</h3><p>Subjects, syllabus aur timetable yahan add karein.</p></div>`).join("")}</div>
  <h3 style="margin:24px 0 8px">Subjects</h3><p>${d.subjects.map(s => tag(esc(s))).join("")}</p>
  <h3 style="margin:24px 0 8px">Faculty</h3><div class="grid">${fac.map(x => `<div class="card"><div class="avatar">🧑‍🏫</div><h3>${esc(x.n)}</h3><p>${esc(x.d)}</p><small>${esc(x.q || "")}</small></div>`).join("") || empty("Faculty list jald.")}</div>
  <h3 style="margin:24px 0 8px">Sample Timetable</h3>${tbl(["Time", "Mon", "Tue", "Wed", "Thu", "Fri"], TT)}`);
};

function facList(q, d) {
  q = (q || "").toLowerCase();
  const l = db.get("teachers").filter(x => (!d || x.dept === d) && (!q || (x.n + " " + x.d).toLowerCase().includes(q)));
  return l.map(x => `<div class="card"><div class="avatar">🧑‍🏫</div><h3>${esc(x.n)}</h3><p><b>${esc(x.d)}</b> · ${esc(deptName(x.dept))}</p><small>${esc(x.q || "")}<br>${esc(x.e || "")}</small></div>`).join("") || empty("Koi teacher nahi mila.");
}
pages["/faculty"] = () => sec(t("faculty"), "Hamare asatiza", `<div class="filters"><input id="fq" placeholder="Name ya subject se talash karein" oninput="act.facFilter()" aria-label="Search faculty"><select id="fd" onchange="act.facFilter()" aria-label="Department"><option value="">All departments</option>${DEPTS.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}</select></div><div class="grid" id="fl">${facList("", "")}</div>`);

pages["/news"] = () => {
  const l = db.get("notices").filter(n => newsCat === "All" || n.c === newsCat);
  return sec(`${t("news")} & Notices`, "Taaza ittilaat", `<div class="chips">${["All", ...NEWS_CATS].map(c => `<button class="${c === newsCat ? "on" : ""}" onclick="act.newsCat('${c}')">${c}</button>`).join("")}</div>
  <div class="grid">${l.map(n => `<div class="card">${catTag(n.c)} <small>${fmtDate(n.d)}</small><p style="margin-top:8px">${esc(n.t)}</p></div>`).join("") || empty("Is category mein koi notice nahi.")}</div>`);
};

pages["/events"] = () => sec(t("events"), "College calendar", `<div class="grid">${EVENTS.map(e => `<div class="card"><span class="dbadge">${fmtDate(e.d)}</span> ${e.d < today() ? tag("Past") : tag("Upcoming", "ok")}<h3 style="margin-top:6px">${esc(e.t)}</h3><p>${esc(e.x)}</p><p><small>📍 ${esc(e.p)}</small></p></div>`).join("")}</div>`);

pages["/downloads"] = () => sec(t("downloads"), "Forms, syllabus aur date sheets", tbl(["Title", "Category", "Size", ""], DOWNLOADS.map(d => [esc(d.t), tag(esc(d.c)), esc(d.s), `<button class="btn small" onclick="act.toastDemo()">Download</button>`])));

pages["/results"] = () => sec(t("results"), "Roll number se result dekhein (demo)", `
  <form class="box" onsubmit="return act.checkResult(this)"><label>Roll Number</label><input name="roll" placeholder="e.g. BS-2026-001" required><br><br><button class="btn" style="width:100%">Check Result</button>
  <div class="hint">Demo rolls: BS-2026-001, BS-2026-002, 12-2026-010</div></form><div id="rbox" style="margin-top:24px"></div>`);

function bookList(q) {
  q = (q || "").toLowerCase();
  return tbl(["Book", "Author", "Category", "Status"], BOOKS.filter(b => !q || (b.t + b.a + b.c).toLowerCase().includes(q)).map(b => [esc(b.t), esc(b.a), esc(b.c), b.ok ? tag("Available", "ok") : tag("Issued", "warn")]));
}
pages["/library"] = () => sec(t("library"), "Kitabein talash karein", `<div class="filters"><input id="bq" placeholder="Kitab, musannif ya subject" oninput="act.libFilter()" aria-label="Search books"></div><div id="bl">${bookList("")}</div>`);

pages["/societies"] = () => sec(t("societies"), "Co-curricular activities", `<div class="grid">${SOCIETIES.map(s => `<div class="card"><div style="font-size:34px">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p></div>`).join("")}</div>`);

const GAL = [["Campus", "#0b5d3b"], ["Sports Day", "#b3261e"], ["Science Fair", "#1a5fb4"], ["Library", "#7a4e0f"], ["Convocation", "#5a2d82"], ["Annual Function", "#0f7a7a"], ["Labs", "#c26a00"], ["Seminar", "#333"]];
pages["/gallery"] = () => sec(t("gallery"), "Yahan apni asli tasveerein lagayein (click karke bara dekhein)", `<div class="gal">${GAL.map((g, i) => `<div style="background:${g[1]}" tabindex="0" onclick="act.lightbox(${i})" onkeydown="if(event.key==='Enter')act.lightbox(${i})">${g[0]}</div>`).join("")}</div>`);

pages["/facilities"] = () => sec(t("facilities"), "", `<div class="grid">${[["📚", "Library", "Hazaron kitabein aur reading hall."], ["🔬", "Science Labs", "Physics, Chemistry, Biology labs."], ["💻", "Computer Lab", "Internet ke saath jadeed computers."], ["⚽", "Sports", "Cricket, football, volleyball grounds."], ["🚌", "Transport", "Ilaqe se pick & drop."], ["🕌", "Mosque", "Campus mein masjid."], ["🍽️", "Canteen", "Saaf suthra khana."], ["🌐", "Wi-Fi", "Campus-wide internet."]].map(f => `<div class="card"><div style="font-size:34px">${f[0]}</div><h3>${f[1]}</h3><p>${f[2]}</p></div>`).join("")}</div>`);

const faqHtml = () => FAQS.map(f => `<details class="faq"><summary>${esc(f[0])}</summary><p style="margin-top:8px">${esc(f[1])}</p></details>`).join("");
pages["/faq"] = () => sec(t("faq"), "Aksar pooche jane wale sawalat", faqHtml());

pages["/admissions"] = () => sec(t("admissions"), "Online admission form (demo)", `
  <div class="steps"><div>Form bharein</div><div>Documents jama karwayen</div><div>Merit list check karein</div><div>Fee jama karwa kar dakhila lein</div></div>
  <div class="two"><div><form class="box wide full" onsubmit="return act.apply(this)">
    <div class="row2"><div><label>Full Name</label><input name="name" required></div><div><label>Father's Name</label><input name="father" required></div></div>
    <label>Program</label><select name="program">${DEPTS.map(d => d.groups.map(g => `<option>${d.name} - ${g}</option>`).join("")).join("")}</select>
    <div class="row2"><div><label>Previous Marks (%)</label><input name="marks" type="number" min="0" max="100" required></div><div><label>Phone</label><input name="phone" type="tel" required></div></div>
    <label>Address</label><textarea name="address" rows="3"></textarea><br><br><button class="btn">Submit Application</button></form></div>
    <div><form class="box full" onsubmit="return act.merit(this)"><h3 style="color:var(--primary)">Merit Calculator</h3>
      <label>Marks Obtained</label><input name="o" type="number" min="0" required><label>Total Marks</label><input name="tt" type="number" min="1" required><br><br><button class="btn ghost" style="width:100%">Calculate</button><p id="mres" style="margin-top:10px"></p></form>
    <div class="card"><h3>Required Documents</h3><p>CNIC/B-Form, pichli degree ki copy, 4 photos, character certificate.</p></div></div></div>
  <h3 style="margin:26px 0 10px;color:var(--primary)">FAQ</h3>${faqHtml()}`);

pages["/contact"] = () => `<section class="section two"><div><h2>${t("contact")}</h2><p class="sub">Rabta karein</p>
  <form class="box wide full" onsubmit="return act.sendMsg(this)"><label>Name</label><input name="name" required><label>Email</label><input name="email" type="email" required><label>Message</label><textarea name="text" rows="5" required></textarea><br><br><button class="btn">Send</button></form></div>
  <div><div class="card"><h3>Address</h3><p>Apna asli address yahan likhein</p><h3 style="margin-top:12px">Phone</h3><p>0000-0000000</p><h3 style="margin-top:12px">Email</h3><p>info@example.com</p><h3 style="margin-top:12px">Office Hours</h3><p>Mon - Sat, 8:00 AM - 2:00 PM</p></div>
  <div class="card" style="margin-top:16px;text-align:center;color:var(--muted);padding:50px 10px">🗺️ Google Map yahan embed karein</div></div></section>`;

pages["/search"] = q => {
  q = (q || "").trim(); const ql = q.toLowerCase(); const hits = [];
  if (ql) {
    STATIC_PAGES.forEach(p => { if (p[0].toLowerCase().includes(ql)) hits.push([p[0], "Page", p[1], ""]); });
    DEPTS.forEach(d => { if ((d.name + d.desc + d.groups.join(" ") + d.subjects.join(" ")).toLowerCase().includes(ql)) hits.push([d.name, "Department", "#/dept/" + d.id, d.desc]); });
    db.get("teachers").forEach(x => { if ((x.n + x.d).toLowerCase().includes(ql)) hits.push([x.n, "Faculty", "#/faculty", x.d]); });
    db.get("notices").forEach(n => { if (n.t.toLowerCase().includes(ql)) hits.push([n.t, "Notice", "#/news", fmtDate(n.d)]); });
    EVENTS.forEach(e => { if ((e.t + e.x).toLowerCase().includes(ql)) hits.push([e.t, "Event", "#/events", fmtDate(e.d)]); });
    DOWNLOADS.forEach(d => { if (d.t.toLowerCase().includes(ql)) hits.push([d.t, "Download", "#/downloads", d.c]); });
    BOOKS.forEach(b => { if ((b.t + b.a + b.c).toLowerCase().includes(ql)) hits.push([b.t, "Book", "#/library", b.a]); });
    FAQS.forEach(f => { if ((f[0] + f[1]).toLowerCase().includes(ql)) hits.push([f[0], "FAQ", "#/faq", ""]); });
  }
  const hl = s => esc(s).replace(new RegExp("(" + ql.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
  return sec("Search", ql ? `${hits.length} natayej: “${esc(q)}”` : "Kuch likh kar talash karein",
    hits.length ? `<div class="grid">${hits.slice(0, 40).map(h => `<a class="card link" href="${h[2]}">${tag(h[1])}<h3 style="margin-top:6px">${hl(h[0])}</h3><p>${esc(h[3])}</p></a>`).join("")}</div>` : empty(ql ? "Kuch nahi mila." : "Upar search box istemal karein."));
};

pages["/login"] = () => sec(t("login"), "Role chunein aur login karein", `
  <form class="box" id="lf"><div class="roles"><button type="button" data-r="student" class="on">Student</button><button type="button" data-r="teacher">Teacher</button><button type="button" data-r="principal">Principal</button></div>
  <label>User ID</label><input id="uid" required autocomplete="username"><label>Password</label><input id="pw" type="password" required autocomplete="current-password">
  <label style="font-weight:400"><input type="checkbox" onchange="$('#pw').type=this.checked?'text':'password'"> Password dikhayen</label><br><button class="btn" style="width:100%">${t("login")}</button>
  <div class="hint"><b>Demo logins:</b><br>Student: student1 / 1234<br>Teacher: teacher1 / 1234<br>Principal: principal / admin<br><i>Yeh sirf demo hai. Asli login ke liye server/database lagana zaroori hai.</i></div></form>`);

pages["/404"] = () => `<section class="section" style="text-align:center"><div style="font-size:70px">🧭</div><h2>Page nahi mila</h2><p class="sub">Yeh page maujood nahi.</p><a class="btn" href="#/">${t("home")}</a></section>`;

/* ---------- PRINTABLES ---------- */
const wm = `<div class="wm">DEMO</div>`;
function printHTML(html) { $("#printbox").innerHTML = html; window.print(); }
function idCardHTML(s) {
  return `<div class="idcard">${wm}<div class="h">${COLLEGE}<br><small>STUDENT ID CARD (DEMO)</small></div><div class="b"><div class="ph">👤</div><div><b>${esc(s.name)}</b><br>Roll: ${esc(s.roll)}<br>Class: ${esc(s.cls)}<br>Valid: Dec ${new Date().getFullYear() + 1}</div></div></div>`;
}
function voucherHTML(s, m) {
  const no = "V-" + (s.roll + m).replace(/[^A-Z0-9]/gi, "").slice(-10).toUpperCase();
  return `<div class="voucher">${wm}<h3 style="text-align:center">${COLLEGE} - FEE VOUCHER (DEMO)</h3><p style="text-align:center"><small>Yeh sirf demo voucher hai, bank mein valid nahi.</small></p>
  <table><tr><th>Voucher No</th><td>${no}</td><th>Month</th><td>${esc(m)}</td></tr><tr><th>Name</th><td>${esc(s.name)}</td><th>Roll</th><td>${esc(s.roll)}</td></tr><tr><th>Class</th><td>${esc(s.cls)}</td><th>Due Date</th><td>${fmtDate(dayOffset(10))}</td></tr><tr><th colspan="3">Tuition Fee</th><td>Rs ${FEE}</td></tr></table>
  <p style="margin-top:10px">Bank / Account: <b>(yahan apna account likhein)</b></p></div>`;
}
function resultCardHTML(s) {
  const r = resultsFor(s.roll);
  return `<div class="voucher" style="max-width:700px">${wm}<h3 style="text-align:center">${COLLEGE} - RESULT CARD (DEMO)</h3><p style="text-align:center"><small>Unofficial demo document</small></p>
  <p>Name: <b>${esc(s.name)}</b> &nbsp; Roll: <b>${esc(s.roll)}</b> &nbsp; Class: <b>${esc(s.cls)}</b></p>
  ${tbl(["Subject", "Total", "Obtained", "Grade"], r.rows.map(x => [esc(x.s), x.total, x.o, x.g]))}
  <p style="margin-top:10px">Total: <b>${r.total}/${r.rows.length * 100}</b> &nbsp; GPA: <b>${r.gpa}</b></p></div>`;
}
const resultBox = s => { const r = resultsFor(s.roll); return `<div class="card" style="max-width:720px;margin:auto"><div class="profile"><div class="avatar">🎓</div><div><h3>${esc(s.name)}</h3><p>Roll: ${esc(s.roll)} · ${esc(s.cls)}</p></div></div><br>${tbl(["Subject", "Total", "Obtained", "Grade"], r.rows.map(x => [esc(x.s), x.total, x.o, tag(x.g, x.g === "F" ? "warn" : "ok")]))}<p style="margin:12px 0">Total <b>${r.total}/${r.rows.length * 100}</b> · GPA <b>${r.gpa}</b></p><button class="btn small" onclick="act.printResult('${esc(s.roll)}')">🖨️ Print</button></div>`; };

/* ---------- DASHBOARDS ---------- */
const me = () => { const u = USERS.student; return db.get("students").find(s => s.roll === u.roll) || { roll: u.roll, name: u.name, cls: u.cls, dept: "bs", att: 88 }; };
const SUBJ_ATT = [["Programming", 92], ["Calculus", 85], ["English", 71], ["Physics", 64]];
const noticeCard = n => `<div class="card" style="margin-bottom:8px">${catTag(n.c)} <small>${fmtDate(n.d)}</small><p>${esc(n.t)}</p></div>`;
const pend = () => ({ apps: db.get("apps").filter(a => a.status === "Pending").length, leaves: db.get("leaves").filter(l => l.status === "Pending").length, msgs: db.get("msgs").length });

const DASH = {
  student: {
    items: () => [["home", "🏠 Overview"], ["att", "🗓️ Attendance"], ["tt", "⏰ Timetable"], ["assign", "📚 Assignments"], ["res", "📝 Results"], ["notes", "📂 Notes"], ["fee", "💰 Fee"], ["leave", "✉️ Leave"], ["id", "🪪 ID Card"]],
    render: {
      home: u => { const s = me(), r = resultsFor(s.roll), as = db.get("assign").filter(a => a.cls === s.cls || a.cls === "All"), due = MONTHS.filter(m => !isPaid(s.roll, m)).length;
        return `<h2>Welcome, ${esc(s.name)}</h2><div class="kpi"><div class="card"><b>${esc(s.roll)}</b>Roll No</div><div class="card"><b>${esc(s.cls)}</b>Class</div><div class="card"><b>${s.att}%</b>Attendance</div><div class="card"><b>${r.gpa}</b>GPA</div><div class="card"><b>${as.length}</b>Assignments</div><div class="card"><b>${due}</b>Fee months due</div></div>
        <h3 class="h">Notices</h3>${db.get("notices").slice(0, 3).map(noticeCard).join("")}`; },
      att: () => `<h2>Attendance</h2>${tbl(["Subject", "Percent", "Status"], SUBJ_ATT.map(s => [esc(s[0]), `<div style="min-width:120px">${bar(s[1], s[1] < 75 ? "warn" : "")}</div> ${s[1]}%`, tag(s[1] < 75 ? "Short" : "Good", s[1] < 75 ? "warn" : "ok")]))}<p class="hint">75% se kam attendance par imtihan mein baithne ki ijazat nahi hoti (apni policy likhein).</p>`,
      tt: () => `<h2>Class Timetable</h2>${tbl(["Time", "Mon", "Tue", "Wed", "Thu", "Fri"], TT)}`,
      assign: () => { const s = me(); const l = db.get("assign").filter(a => a.cls === s.cls || a.cls === "All"); return `<h2>Assignments</h2>${l.map(a => { const dl = Math.ceil((new Date(a.due) - new Date(today())) / 864e5); return `<div class="card" style="margin-bottom:10px"><h3>${esc(a.t)}</h3><p>${esc(a.s)} · by ${esc(a.by)}</p><p>Due: <b>${fmtDate(a.due)}</b> ${dl < 0 ? tag("Overdue", "warn") : tag(dl + " din baqi", dl <= 2 ? "warn" : "ok")}</p></div>`; }).join("") || empty("Koi assignment nahi.")}`; },
      res: () => { const s = me(), r = resultsFor(s.roll); return `<h2>Results</h2>${tbl(["Subject", "Total", "Obtained", "Grade"], r.rows.map(x => [esc(x.s), x.total, x.o, tag(x.g, x.g === "F" ? "warn" : "ok")]))}<p style="margin:12px 0">Total <b>${r.total}/${r.rows.length * 100}</b> · GPA <b>${r.gpa}</b></p><button class="btn small" onclick="act.printResult('${esc(s.roll)}')">🖨️ Print Result Card</button>`; },
      notes: () => `<h2>Notes & Materials</h2>${db.get("notes").map(n => `<div class="card" style="margin-bottom:10px"><h3>${esc(n.t)}</h3><p>${esc(n.s)} · ${fmtDate(n.d)} <button class="btn small" onclick="act.toastDemo()">Download</button></p></div>`).join("") || empty("Abhi koi notes upload nahi hue. Teacher login se upload karke dekhein.")}`,
      fee: () => { const s = me(); return `<h2>Fee Status</h2>${tbl(["Month", "Amount", "Status", ""], MONTHS.map(m => { const p = isPaid(s.roll, m); return [m, "Rs " + FEE, tag(p ? "Paid" : "Due", p ? "ok" : "warn"), p ? "" : `<button class="btn small" onclick="act.voucher('${m}')">🖨️ Voucher</button>`]; }))}`; },
      leave: () => { const s = me(); const l = db.get("leaves").filter(x => x.roll === s.roll); return `<h2>Leave Application</h2><form class="box wide full" onsubmit="return act.leave(this)"><div class="row2"><div><label>From</label><input name="from" type="date" value="${today()}" required></div><div><label>To</label><input name="to" type="date" value="${today()}" required></div></div><label>Reason</label><textarea name="reason" rows="3" required></textarea><br><br><button class="btn">Submit</button></form><h3 class="h">My Requests</h3>${tbl(["From", "To", "Reason", "Status"], l.map(x => [fmtDate(x.from), fmtDate(x.to), esc(x.reason), tag(esc(x.status), x.status === "Approved" ? "ok" : x.status === "Rejected" ? "warn" : "gold")]))}`; },
      id: () => { const s = me(); return `<h2>Student ID Card</h2>${idCardHTML(s)}<br><button class="btn small" onclick="act.printID()">🖨️ Print</button>`; }
    }
  },
  teacher: {
    items: () => [["home", "🏠 Overview"], ["att", "✅ Attendance"], ["marks", "🧮 Enter Marks"], ["assign", "📚 Assignments"], ["notes", "⬆️ Notes"], ["students", "🎓 Students"]],
    render: {
      home: u => `<h2>Welcome, ${esc(u.name)}</h2><div class="kpi"><div class="card"><b>${esc(u.sub)}</b>Subject</div><div class="card"><b>${classes().length}</b>Classes</div><div class="card"><b>${db.get("students").length}</b>Students</div><div class="card"><b>${db.get("assign").filter(a => a.by === u.name).length}</b>My assignments</div></div><h3 class="h">Aaj ke classes (demo)</h3>${tbl(["Time", "Class", "Subject"], [["8:00", "BS CS 3", esc(u.sub)], ["10:30", "ADP CS 1", esc(u.sub)]])}<h3 class="h">Notices</h3>${db.get("notices").slice(0, 3).map(noticeCard).join("")}`,
      att: () => { const cl = classes(); if (!attSel || !cl.includes(attSel)) attSel = cl[0] || ""; const st = db.get("students").filter(s => s.cls === attSel);
        return `<h2>Mark Attendance</h2><div class="filters"><select onchange="act.attClass(this.value)" aria-label="Class">${cl.map(c => `<option ${c === attSel ? "selected" : ""}>${esc(c)}</option>`).join("")}</select><input id="attDate" type="date" value="${today()}" aria-label="Date"></div>${tbl(["Roll", "Name", "Present"], st.map((s, i) => [esc(s.roll), esc(s.name), `<input type="checkbox" id="ap_${i}" checked>`]))}<br><button class="btn" onclick="act.saveAtt()">Save Attendance</button>`; },
      marks: () => { const cl = classes(); if (!markSel || !cl.includes(markSel)) markSel = cl[0] || ""; const st = db.get("students").filter(s => s.cls === markSel), m = db.get("marks");
        return `<h2>Enter Marks</h2><div class="filters"><select onchange="act.markClass(this.value)" aria-label="Class">${cl.map(c => `<option ${c === markSel ? "selected" : ""}>${esc(c)}</option>`).join("")}</select><select onchange="act.markSubj(this.value)" aria-label="Subject">${SUBJ.map(s => `<option ${s === markSubj ? "selected" : ""}>${s}</option>`).join("")}</select></div>${tbl(["Roll", "Name", "Marks /100"], st.map((s, i) => [esc(s.roll), esc(s.name), `<input type="number" min="0" max="100" id="mk_${i}" style="width:100px" value="${esc((m[s.roll] || {})[markSubj] !== undefined ? m[s.roll][markSubj] : "")}">`]))}<br><button class="btn" onclick="act.saveMarks()">Save Marks</button>`; },
      assign: u => { const l = db.get("assign"); return `<h2>Assignments</h2><form class="box wide full" onsubmit="return act.addAssign(this)"><div class="row2"><div><label>Title</label><input name="t" required></div><div><label>Due Date</label><input name="due" type="date" value="${dayOffset(7)}" required></div></div><label>Class</label><select name="cls"><option>All</option>${classes().map(c => `<option>${esc(c)}</option>`).join("")}</select><br><br><button class="btn">Post Assignment</button></form>${tbl(["Title", "Class", "Due", "By", ""], l.map((a, i) => [esc(a.t), esc(a.cls), fmtDate(a.due), esc(a.by), `<button class="btn red small" onclick="act.del('assign',${i})">Delete</button>`]))}`; },
      notes: u => { const l = db.get("notes"); return `<h2>Upload Notes</h2><form class="box wide full" onsubmit="return act.addNote(this)"><label>Title</label><input name="t" required><label>File</label><input type="file"><br><br><button class="btn">Upload</button></form>${tbl(["Title", "Subject", "Date", ""], l.map((n, i) => [esc(n.t), esc(n.s), fmtDate(n.d), `<button class="btn red small" onclick="act.del('notes',${i})">Delete</button>`]))}`; },
      students: () => `<h2>Students</h2><div class="filters"><input placeholder="Search..." oninput="act.rowFilter(this,'stt')" aria-label="Search"></div>${tbl(["Roll", "Name", "Class", "Attendance"], db.get("students").map(s => [esc(s.roll), esc(s.name), esc(s.cls), tag(s.att + "%", s.att < 75 ? "warn" : "ok")]), "stt")}`
    }
  },
  principal: {
    items: () => { const p = pend(); return [["home", "🏠 Overview"], ["students", "🎓 Students"], ["staff", "🧑‍🏫 Staff"], ["apps", `📥 Applications ${p.apps ? `<span class="cnt">${p.apps}</span>` : ""}`], ["leaves", `✉️ Leaves ${p.leaves ? `<span class="cnt">${p.leaves}</span>` : ""}`], ["msgs", `💬 Messages ${p.msgs ? `<span class="cnt">${p.msgs}</span>` : ""}`], ["notices", "📢 Notices"], ["fees", "💰 Fees"], ["attlog", "🗓️ Attendance Log"], ["reports", "📊 Reports"], ["settings", "⚙️ Settings"]]; },
    render: {
      home: u => { const st = db.get("students"), p = pend(); const byDept = DEPTS.map(d => { const l = st.filter(s => s.dept === d.id); return [d.id, l.length ? Math.round(l.reduce((a, s) => a + s.att, 0) / l.length) : 0]; });
        const collected = MONTHS.map(m => st.filter(s => isPaid(s.roll, m)).length * FEE);
        return `<h2>Welcome, ${esc(u.name)}</h2><div class="kpi"><div class="card"><b>${st.length}</b>Students</div><div class="card"><b>${db.get("teachers").length}</b>Teachers</div><div class="card"><b>${st.length ? Math.round(st.reduce((a, s) => a + s.att, 0) / st.length) : 0}%</b>Avg Attendance</div><div class="card"><b>${p.apps}</b>Pending applications</div><div class="card"><b>${p.leaves}</b>Pending leaves</div><div class="card"><b>${p.msgs}</b>Messages</div></div>
        <div class="grid"><div class="card"><h3>Attendance by Department (%)</h3><div class="chart">${byDept.map(d => `<div style="height:${d[1]}%"><span>${d[1]}</span><em>${esc(d[0])}</em></div>`).join("")}</div><br></div>
        <div class="card"><h3>Fee Collected (Rs)</h3><div class="chart">${collected.map((c, i) => `<div style="height:${Math.max(3, c / Math.max(1, ...collected, st.length * FEE) * 100)}%"><span>${c / 1000}k</span><em>${MONTHS[i].slice(0, 3)}</em></div>`).join("")}</div><br></div></div>`; },
      students: () => `<h2>Students</h2><form class="box wide full" onsubmit="return act.addStudent(this)"><div class="row2"><div><label>Roll No</label><input name="roll" required></div><div><label>Name</label><input name="name" required></div></div><div class="row2"><div><label>Class</label><input name="cls" required placeholder="e.g. BS CS 3"></div><div><label>Department</label><select name="dept">${DEPTS.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}</select></div></div><br><button class="btn">Add Student</button></form>
        <div class="filters"><input placeholder="Search students..." oninput="act.rowFilter(this,'pst')" aria-label="Search"></div>${tbl(["Roll", "Name", "Class", "Dept", "Attendance", ""], db.get("students").map((s, i) => [esc(s.roll), esc(s.name), esc(s.cls), esc(s.dept), tag(s.att + "%", s.att < 75 ? "warn" : "ok"), `<button class="btn red small" onclick="act.del('students',${i})">Delete</button>`]), "pst")}`,
      staff: () => `<h2>Staff</h2><form class="box wide full" onsubmit="return act.addTeacher(this)"><div class="row2"><div><label>Name</label><input name="n" required></div><div><label>Subject</label><input name="d" required></div></div><div class="row2"><div><label>Qualification</label><input name="q"></div><div><label>Department</label><select name="dept">${DEPTS.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}</select></div></div><br><button class="btn">Add Teacher</button></form>${tbl(["Name", "Subject", "Department", "Qualification", ""], db.get("teachers").map((x, i) => [esc(x.n), esc(x.d), esc(deptName(x.dept)), esc(x.q || ""), `<button class="btn red small" onclick="act.del('teachers',${i})">Delete</button>`]))}`,
      apps: () => { const l = db.get("apps"); return `<h2>Admission Applications</h2>${tbl(["Date", "Name", "Father", "Program", "Marks", "Phone", "Status", ""], l.map((a, i) => [fmtDate(a.date), esc(a.name), esc(a.father), esc(a.program), esc(a.marks) + "%", esc(a.phone), tag(esc(a.status), a.status === "Accepted" ? "ok" : a.status === "Rejected" ? "warn" : "gold"), `<button class="btn small" onclick="act.setStatus('apps',${i},'Accepted')">✔</button> <button class="btn red small" onclick="act.setStatus('apps',${i},'Rejected')">✖</button> <button class="btn ghost small" onclick="act.del('apps',${i})">🗑</button>`]))}${l.length ? "" : "<br>" + empty("Abhi koi application nahi. Admissions page se form bhar kar dekhein.")}`; },
      leaves: () => { const l = db.get("leaves"); return `<h2>Leave Requests</h2>${tbl(["Student", "From", "To", "Reason", "Status", ""], l.map((x, i) => [esc(x.name) + "<br><small>" + esc(x.roll) + "</small>", fmtDate(x.from), fmtDate(x.to), esc(x.reason), tag(esc(x.status), x.status === "Approved" ? "ok" : x.status === "Rejected" ? "warn" : "gold"), `<button class="btn small" onclick="act.setStatus('leaves',${i},'Approved')">Approve</button> <button class="btn red small" onclick="act.setStatus('leaves',${i},'Rejected')">Reject</button>`]))}${l.length ? "" : "<br>" + empty("Koi leave request nahi. Student login se bhej kar dekhein.")}`; },
      msgs: () => { const l = db.get("msgs"); return `<h2>Contact Messages</h2>${l.map((m, i) => `<div class="card" style="margin-bottom:10px"><b>${esc(m.name)}</b> &lt;${esc(m.email)}&gt; <small>${fmtDate(m.date)}</small><p>${esc(m.text)}</p><button class="btn red small" onclick="act.del('msgs',${i})">Delete</button></div>`).join("") || empty("Koi message nahi.")}`; },
      notices: () => { const l = db.get("notices"); return `<h2>Manage Notices</h2><form class="box wide full" onsubmit="return act.addNotice(this)"><label>New Notice</label><input name="t" required><label>Category</label><select name="c">${NEWS_CATS.map(c => `<option>${c}</option>`).join("")}</select><br><br><button class="btn">Publish</button></form>${l.map((n, i) => `<div class="card" style="margin-bottom:8px;display:flex;justify-content:space-between;gap:10px;align-items:center"><span>${catTag(n.c)} ${esc(n.t)}</span><button class="btn red small" onclick="act.del('notices',${i})">Delete</button></div>`).join("")}`; },
      fees: () => { const m = "November"; return `<h2>Fee Management - ${m}</h2>${tbl(["Roll", "Name", "Status", ""], db.get("students").map(s => { const p = isPaid(s.roll, m); return [esc(s.roll), esc(s.name), tag(p ? "Paid" : "Due", p ? "ok" : "warn"), `<button class="btn small" onclick="act.togglePaid('${esc(s.roll)}','${m}')">${p ? "Mark Due" : "Mark Paid"}</button>`]; }))}`; },
      attlog: () => { const l = db.get("attlog").slice().reverse(); return `<h2>Attendance Log</h2>${tbl(["Date", "Class", "Teacher", "Present", "Total"], l.map(x => [fmtDate(x.date), esc(x.cls), esc(x.by), x.present, x.total]))}${l.length ? "" : "<br>" + empty("Abhi koi attendance save nahi hui. Teacher login se lagayen.")}`; },
      reports: () => `<h2>Reports</h2><div class="grid">${[["students", "Student List"], ["attendance", "Attendance Report"], ["fees", "Fee Report"]].map(r => `<div class="card"><h3>${r[1]}</h3><button class="btn small" onclick="act.report('${r[0]}')">🖨️ Print</button></div>`).join("")}</div>`,
      settings: () => `<h2>Settings</h2><div class="grid"><div class="card"><h3>Backup</h3><p>Saara demo data JSON file mein download karein.</p><br><button class="btn small" onclick="act.exportData()">⬇️ Export JSON</button></div><div class="card"><h3>Reset Demo Data</h3><p>Sab changes mita kar original demo data wapas laayen.</p><br><button class="btn red small" onclick="act.reset()">Reset</button></div></div>`
    }
  }
};
function dashShell(role, body) {
  const D = DASH[role];
  return `<div class="dash"><aside class="side"><h4>${role.toUpperCase()} PANEL</h4>${D.items().map(([k, l]) => `<a class="${dtab === k ? "on" : ""}" tabindex="0" onclick="act.tab('${k}')">${l}</a>`).join("")}<a tabindex="0" onclick="act.logout()">🚪 ${t("logout")}</a></aside><div class="dmain">${body}</div></div>`;
}
pages["/dashboard"] = () => {
  if (!session || !USERS[session.role]) { session = null; LS.del("session"); renderNav(); location.hash = "#/login"; return ""; }
  const D = DASH[session.role];
  if (!D.render[dtab]) dtab = "home";
  return dashShell(session.role, D.render[dtab](USERS[session.role]));
};

/* ---------- ACTIONS ---------- */
const act = {
  toastDemo: () => toast("Demo: asli file yahan attach karein"),
  tab: k => { dtab = k; route(); },
  logout() { session = null; LS.del("session"); renderNav(); location.hash = "#/"; toast("Logout ho gaye"); },
  heroSearch(f) { const q = val(f, "q"); if (q) location.hash = "#/search/" + encodeURIComponent(q); return false; },
  facFilter() { $("#fl").innerHTML = facList($("#fq").value, $("#fd").value); },
  libFilter() { $("#bl").innerHTML = bookList($("#bq").value); },
  newsCat(c) { newsCat = c; route(); },
  rowFilter(inp, id) { const q = inp.value.toLowerCase(); $$("#" + id + " tbody tr").forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? "" : "none"; }); },
  lightbox(i) { const g = GAL[i]; $("#lightbox").innerHTML = `<div style="background:${g[1]}">${g[0]}</div>`; $("#lightbox").className = "lb show"; },
  checkResult(f) { const roll = val(f, "roll").toUpperCase(); const s = db.get("students").find(x => x.roll.toUpperCase() === roll); $("#rbox").innerHTML = s ? resultBox(s) : empty("Is roll number ka koi record nahi mila."); return false; },
  apply(f) { const l = db.get("apps"); const id = "APP-" + (1000 + l.length + 1); l.unshift({ id, name: val(f, "name"), father: val(f, "father"), program: val(f, "program"), marks: val(f, "marks"), phone: val(f, "phone"), address: val(f, "address"), date: today(), status: "Pending" }); db.set("apps", l); toast("Application jama ho gayi: " + id); f.reset(); return false; },
  merit(f) { const o = +val(f, "o"), tt = +val(f, "tt"); const p = tt > 0 ? (o / tt * 100) : 0; $("#mres").innerHTML = o > tt ? "Obtained marks total se zyada nahi ho sakte." : `Aap ka percentage: <b>${p.toFixed(2)}%</b> ${p >= 60 ? tag("Achhi merit (demo)", "ok") : tag("Merit list ka intezar karein", "gold")}`; return false; },
  sendMsg(f) { const l = db.get("msgs"); l.unshift({ name: val(f, "name"), email: val(f, "email"), text: val(f, "text"), date: today() }); db.set("msgs", l); toast("Message bhej diya gaya"); f.reset(); return false; },
  printResult(roll) { const s = db.get("students").find(x => x.roll === roll) || me(); printHTML(resultCardHTML(s)); },
  printID() { printHTML(idCardHTML(me())); },
  voucher(m) { printHTML(voucherHTML(me(), m)); },
  leave(f) { const s = me(); const l = db.get("leaves"); l.unshift({ roll: s.roll, name: s.name, from: val(f, "from"), to: val(f, "to"), reason: val(f, "reason"), status: "Pending" }); db.set("leaves", l); toast("Leave request bhej di gayi"); route(); return false; },
  attClass(c) { attSel = c; route(); },
  saveAtt() { const st = db.get("students").filter(s => s.cls === attSel); let p = 0; st.forEach((s, i) => { const c = $("#ap_" + i); if (c && c.checked) p++; }); const l = db.get("attlog"); const d = $("#attDate"); l.push({ date: (d && d.value) || today(), cls: attSel, by: USERS.teacher.name, present: p, total: st.length }); db.set("attlog", l); toast(`Attendance save: ${p}/${st.length} present`); },
  markClass(c) { markSel = c; route(); },
  markSubj(s) { markSubj = s; route(); },
  saveMarks() { const st = db.get("students").filter(s => s.cls === markSel), m = db.get("marks"); let n = 0; st.forEach((s, i) => { const e = $("#mk_" + i); if (e && e.value !== "") { const v = Math.max(0, Math.min(100, +e.value)); (m[s.roll] = m[s.roll] || {})[markSubj] = v; n++; } }); db.set("marks", m); toast(n + " students ke marks save hue"); },
  addAssign(f) { const l = db.get("assign"); l.unshift({ id: uid(), t: val(f, "t"), s: USERS.teacher.sub, due: val(f, "due"), by: USERS.teacher.name, cls: val(f, "cls") }); db.set("assign", l); toast("Assignment post ho gayi"); route(); return false; },
  addNote(f) { const l = db.get("notes"); l.unshift({ t: val(f, "t"), s: USERS.teacher.sub, d: today() }); db.set("notes", l); toast("Notes upload hue"); route(); return false; },
  addStudent(f) { const l = db.get("students"); const roll = val(f, "roll"); if (l.some(s => s.roll.toLowerCase() === roll.toLowerCase())) { toast("Yeh roll number pehle se maujood hai"); return false; } l.push({ roll, name: val(f, "name"), cls: val(f, "cls"), dept: val(f, "dept") || "bs", att: 100 }); db.set("students", l); toast("Student add ho gaya"); route(); return false; },
  addTeacher(f) { const l = db.get("teachers"); l.push({ n: val(f, "n"), d: val(f, "d"), dept: val(f, "dept") || "bs", q: val(f, "q"), e: "" }); db.set("teachers", l); toast("Teacher add ho gaya"); route(); return false; },
  addNotice(f) { const l = db.get("notices"); l.unshift({ t: val(f, "t"), c: val(f, "c") || "General", d: today() }); db.set("notices", l); renderTicker(); toast("Notice lag gaya"); route(); return false; },
  del(key, i) { const l = db.get(key); if (i >= 0 && i < l.length) l.splice(i, 1); db.set(key, l); if (key === "notices") renderTicker(); route(); },
  setStatus(key, i, s) { const l = db.get(key); if (l[i]) l[i].status = s; db.set(key, l); toast("Status: " + s); route(); },
  togglePaid(roll, m) { const f = db.get("fees"); f[roll + "|" + m] = !isPaid(roll, m); db.set("fees", f); route(); },
  report(kind) {
    const st = db.get("students"); let h = `<h2>${COLLEGE} (Demo)</h2><p>Generated: ${fmtDate(today())}</p>`;
    if (kind === "students") h += "<h3>Student List</h3>" + tbl(["Roll", "Name", "Class"], st.map(s => [esc(s.roll), esc(s.name), esc(s.cls)]));
    if (kind === "attendance") h += "<h3>Attendance Report</h3>" + tbl(["Roll", "Name", "Attendance"], st.map(s => [esc(s.roll), esc(s.name), s.att + "%" + (s.att < 75 ? " (Short)" : "")]));
    if (kind === "fees") h += "<h3>Fee Report - November</h3>" + tbl(["Roll", "Name", "Status"], st.map(s => [esc(s.roll), esc(s.name), isPaid(s.roll, "November") ? "Paid" : "Due"]));
    printHTML(h);
  },
  exportData() { const o = {}; Object.keys(SEED).forEach(k => { o[k] = db.get(k); }); const b = new Blob([JSON.stringify(o, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "college-demo-backup.json"; a.click(); },
  reset() { if (typeof confirm === "function" && !confirm("Saara demo data reset ho jayega. Jari rakhein?")) return; Object.keys(SEED).forEach(k => LS.del(k)); renderTicker(); toast("Demo data reset ho gaya"); route(); },
  setSession(role) { session = { role }; LS.set("session", session); dtab = "home"; renderNav(); location.hash = "#/dashboard"; toast("Login kamyab"); }
};

/* ---------- login binding, counters, router ---------- */
function bindLogin() {
  const f = $("#lf"); if (!f) return; let role = "student";
  $$(".roles button", f).forEach(b => b.onclick = () => { role = b.dataset.r; $$(".roles button", f).forEach(x => x.classList.toggle("on", x === b)); });
  f.onsubmit = e => { e.preventDefault(); const u = USERS[role];
    if ($("#uid").value.trim() === u.id && $("#pw").value === u.pass) act.setSession(role); else toast("Ghalat ID ya password"); };
}
function counters() {
  $$("[data-count]").forEach(el => { const end = +el.dataset.count, suf = el.dataset.suf || ""; let n = 0; const step = Math.max(1, Math.ceil(end / 40));
    const iv = setInterval(() => { n = Math.min(end, n + step); el.textContent = n.toLocaleString() + (n >= end ? suf : ""); if (n >= end) clearInterval(iv); }, 30); });
}
const TITLES = { "/": "Home", "/about": "About", "/departments": "Departments", "/dept": "Department", "/faculty": "Faculty", "/news": "News", "/events": "Events", "/downloads": "Downloads", "/results": "Results", "/library": "Library", "/societies": "Societies", "/gallery": "Gallery", "/facilities": "Facilities", "/faq": "FAQ", "/admissions": "Admissions", "/contact": "Contact", "/search": "Search", "/login": "Login", "/dashboard": "Dashboard" };
function route() {
  const h = (location.hash || "#/").slice(1);
  const parts = h.split("/"); const seg = parts[1] || ""; let arg = parts.slice(2).join("/");
  try { arg = decodeURIComponent(arg); } catch (e) {}
  const key = "/" + seg;
  let html;
  try { html = pages[key] ? pages[key](arg) : pages["/404"](); }
  catch (e) { console.error(e); html = `<section class="section">${empty("Kuch ghalat ho gaya. Page dobara load karein.")}</section>`; }
  app.innerHTML = html;
  if (window.scrollTo) window.scrollTo(0, 0);
  $$("#nav a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + key || (key === "/" && a.getAttribute("href") === "#/")));
  const nav = $("#nav"); if (nav) nav.classList.remove("open");
  document.title = (TITLES[key] || "Page") + " | " + COLLEGE;
  bindLogin(); counters();
}

/* ---------- boot ---------- */
$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
$("#sf").onsubmit = e => { e.preventDefault(); const q = $("#sq").value.trim(); if (q) location.hash = "#/search/" + encodeURIComponent(q); };
$("#langBtn").onclick = () => { lang = lang === "en" ? "ur" : "en"; LS.set("lang", lang); applyPrefs(); renderNav(); renderFoot(); route(); };
$("#themeBtn").onclick = () => { LS.set("theme", LS.get("theme", "light") === "dark" ? "light" : "dark"); applyPrefs(); renderNav(); };
$("#toTop").onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
$("#lightbox").onclick = () => { $("#lightbox").className = "lb"; };
window.addEventListener("scroll", () => { $("#toTop").style.display = window.scrollY > 400 ? "block" : "none"; });
window.addEventListener("hashchange", route);
document.addEventListener("keydown", e => { if (e.key === "Escape") $("#lightbox").className = "lb"; });
window.addEventListener("afterprint", () => { $("#printbox").innerHTML = ""; });
applyPrefs(); renderNav(); renderTicker(); renderFoot(); route();
