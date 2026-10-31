/* ============================================================
   DATA & HELPERS  -  yahan apna asli data likhein
   ============================================================ */
const COLLEGE = "Your College Name";
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const dayOffset = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const today = () => dayOffset(0);
const fmtDate = d => { const x = new Date(d); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };

/* ---------- storage (localStorage, demo only) ---------- */
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};

/* ---------- static content ---------- */
const DEPTS = [
  { id: "11th", name: "11th (First Year)", icon: "📘", hod: "Prof. Name", desc: "Intermediate part-1 ke tamam groups.",
    groups: ["Pre-Medical", "Pre-Engineering", "ICS", "I.Com", "Arts"], subjects: ["English", "Urdu", "Islamiat", "Physics", "Chemistry", "Biology/Maths/CS"] },
  { id: "12th", name: "12th (Second Year)", icon: "📗", hod: "Prof. Name", desc: "Intermediate part-2 aur board exam tayyari.",
    groups: ["Pre-Medical", "Pre-Engineering", "ICS", "I.Com", "Arts"], subjects: ["English", "Urdu", "Pak Studies", "Physics", "Chemistry", "Biology/Maths/CS"] },
  { id: "adp", name: "ADP (2 Year)", icon: "🎓", hod: "Prof. Name", desc: "Associate Degree Programs.",
    groups: ["ADP Computer Science", "ADP Commerce", "ADP English"], subjects: ["Functional English", "Computing", "Mathematics", "Accounting"] },
  { id: "bs", name: "BS (4 Year)", icon: "🏛️", hod: "Prof. Name", desc: "4 saala BS programs, 8 semesters.",
    groups: ["BS Computer Science", "BS English", "BS Chemistry", "BS Botany", "BS Mathematics", "BS Commerce"], subjects: ["Programming", "Calculus", "English", "Physics", "Data Structures"] }
];
const SUBJ = ["Programming", "Calculus", "English", "Physics"];
const MONTHS = ["September", "October", "November", "December"];
const FEE = 5000;
const NEWS_CATS = ["General", "Exams", "Admissions", "Sports", "Events"];
const TT = [["8:00", "English", "Math", "Physics", "Chem", "Urdu"], ["9:00", "Math", "English", "Chem", "Physics", "Islamiat"], ["10:00", "Break", "Break", "Break", "Break", "Break"], ["10:30", "Physics", "Urdu", "English", "Math", "Lab"], ["11:30", "Chem", "Physics", "Math", "English", "Seminar"]];
const EVENTS = [
  { d: "2026-11-15", t: "Annual Sports Week", p: "College Ground", x: "Cricket, football, athletics aur volleyball ke muqable." },
  { d: "2026-12-02", t: "Science Exhibition", p: "Main Hall", x: "Talba ke science projects ki numaish." },
  { d: "2026-12-20", t: "Mid Term Exams", p: "Examination Hall", x: "Tamam classes ke mid-term imtihan." },
  { d: "2027-01-10", t: "Convocation", p: "Auditorium", x: "Kamyab talba ko degrees aur awards." },
  { d: "2027-02-05", t: "Career Counselling Day", p: "Seminar Room", x: "Mahireen ki rehnumai." }
];
const DOWNLOADS = [
  { t: "Admission Form 2026", c: "Forms", s: "120 KB" }, { t: "Fee Structure", c: "Forms", s: "80 KB" },
  { t: "Mid-Term Date Sheet", c: "Exams", s: "95 KB" }, { t: "Syllabus - 11th", c: "Syllabus", s: "1.2 MB" },
  { t: "Syllabus - 12th", c: "Syllabus", s: "1.3 MB" }, { t: "Syllabus - ADP", c: "Syllabus", s: "900 KB" },
  { t: "Syllabus - BS", c: "Syllabus", s: "2.1 MB" }, { t: "Scholarship Application", c: "Forms", s: "70 KB" },
  { t: "Academic Calendar", c: "General", s: "150 KB" }
];
const BOOKS = [
  { t: "Fundamentals of Physics", a: "Author One", c: "Physics", ok: true }, { t: "Organic Chemistry", a: "Author Two", c: "Chemistry", ok: true },
  { t: "Calculus and Analytic Geometry", a: "Author Three", c: "Maths", ok: false }, { t: "Introduction to Programming", a: "Author Four", c: "Computer Science", ok: true },
  { t: "English Grammar in Use", a: "Author Five", c: "English", ok: true }, { t: "Principles of Accounting", a: "Author Six", c: "Commerce", ok: false },
  { t: "Pakistan Studies", a: "Author Seven", c: "General", ok: true }, { t: "Data Structures", a: "Author Eight", c: "Computer Science", ok: true }
];
const SOCIETIES = [
  ["🎤", "Debating Society", "Munazra aur taqreeri muqable."], ["💻", "Computer Society", "Coding aur tech workshops."],
  ["📖", "Literary Society", "Mushaira, mazmoon navisi aur kitab mela."], ["🔬", "Science Society", "Science fair aur experiments."],
  ["🏏", "Cricket Club", "Inter-college tournaments."], ["⚽", "Football Club", "Daily practice aur matches."],
  ["🤝", "Social Welfare Society", "Blood drives aur charity."], ["🎨", "Arts Society", "Painting aur calligraphy."]
];
const FAQS = [
  ["Admission ke liye kya documents chahiyen?", "CNIC/B-Form, pichli degree ya marksheet ki copy, 4 tasveerein aur character certificate."],
  ["Admission kab shuru hote hain?", "Notice board aur News page par date ka elan kiya jata hai. Yahan apni asli date likhein."],
  ["Kya scholarships milti hain?", "Haan, merit aur need-based scholarships. Tafseel Admissions office se pata karein."],
  ["Fee kaise jama karwayen?", "Voucher student portal se download karke bank mein jama karwayen. (Demo)"],
  ["Result kahan dekhun?", "Results page par apna roll number daal kar result dekha ja sakta hai."],
  ["Transport ki sahulat hai?", "Haan, ilaqe ke mukhtalif rooton par college bus chalti hai."]
];
const TESTI = [
  ["Alumnus Name", "BS Computer Science", "Yahan ke asatiza ne mujhe aage barhne ka hosla diya."],
  ["Alumna Name", "ADP Commerce", "Library aur labs ki sahulat bohat achi hai."],
  ["Parent Name", "Walid-e-mohtaram", "Mere bete ki tarbiyat aur taleem dono behtareen hain."]
];
const STATIC_PAGES = [["Home", "#/"], ["About Us", "#/about"], ["Departments", "#/departments"], ["Admissions", "#/admissions"], ["Faculty", "#/faculty"], ["News & Notices", "#/news"], ["Events", "#/events"], ["Downloads", "#/downloads"], ["Check Result", "#/results"], ["Library", "#/library"], ["Societies & Sports", "#/societies"], ["Gallery", "#/gallery"], ["Facilities", "#/facilities"], ["FAQ", "#/faq"], ["Contact", "#/contact"], ["Portal Login", "#/login"]];

/* ---------- seed data (editable via the portals) ---------- */
const SEED = {
  students: [
    { roll: "BS-2026-001", name: "Ali Raza", cls: "BS CS 3", dept: "bs", att: 92 }, { roll: "BS-2026-002", name: "Hina Khan", cls: "BS CS 3", dept: "bs", att: 85 },
    { roll: "BS-2026-003", name: "Usman Tariq", cls: "BS CS 3", dept: "bs", att: 71 }, { roll: "BS-2026-004", name: "Sara Ahmed", cls: "BS CS 3", dept: "bs", att: 96 },
    { roll: "12-2026-010", name: "Bilal Hussain", cls: "12th ICS", dept: "12th", att: 64 }, { roll: "12-2026-011", name: "Ayesha Noor", cls: "12th ICS", dept: "12th", att: 89 },
    { roll: "11-2026-020", name: "Hamza Ali", cls: "11th Pre-Med", dept: "11th", att: 78 }, { roll: "AD-2026-030", name: "Zainab Fatima", cls: "ADP CS 1", dept: "adp", att: 91 }
  ],
  teachers: [
    { n: "Prof. Teacher One", d: "Physics", dept: "11th", q: "M.Sc Physics", e: "teacher1@example.com" }, { n: "Prof. Teacher Two", d: "Chemistry", dept: "12th", q: "M.Phil Chemistry", e: "teacher2@example.com" },
    { n: "Prof. Teacher Three", d: "Computer Science", dept: "bs", q: "MS Computer Science", e: "teacher3@example.com" }, { n: "Prof. Teacher Four", d: "English", dept: "adp", q: "M.A English", e: "teacher4@example.com" },
    { n: "Prof. Teacher Five", d: "Mathematics", dept: "11th", q: "M.Sc Mathematics", e: "teacher5@example.com" }, { n: "Prof. Teacher Six", d: "Commerce", dept: "adp", q: "M.Com", e: "teacher6@example.com" }
  ],
  notices: [
    { t: "Admissions 2026 open hain - last date jald announce hogi.", d: dayOffset(-2), c: "Admissions" },
    { t: "Mid-term exams ka date sheet notice board par laga di gayi hai.", d: dayOffset(-4), c: "Exams" },
    { t: "Annual Sports Week ki registration shuru.", d: dayOffset(-6), c: "Sports" },
    { t: "Library mein nayi kitabein shamil ki gayi hain.", d: dayOffset(-9), c: "General" }
  ],
  assign: [
    { id: "a1", t: "Data Structures - Worksheet 2", s: "Computer Science", due: dayOffset(5), by: "Prof. Demo Teacher", cls: "BS CS 3" },
    { id: "a2", t: "Calculus - Chapter 4 exercise", s: "Mathematics", due: dayOffset(9), by: "Prof. Teacher Five", cls: "BS CS 3" }
  ],
  notes: [], apps: [], leaves: [], msgs: [], attlog: [], marks: {}, fees: {}
};
const db = {
  get(k) {
    let v = LS.get(k, JSON.parse(JSON.stringify(SEED[k])));
    if (k === "notices") v = v.map(n => typeof n === "string" ? { t: n, d: today(), c: "General" } : n);
    return v;
  },
  set(k, v) { LS.set(k, v); }
};
const USERS = {
  student:   { id: "student1", pass: "1234",  name: "Demo Student",       roll: "BS-2026-001", cls: "BS CS 3" },
  teacher:   { id: "teacher1", pass: "1234",  name: "Prof. Demo Teacher", sub: "Computer Science" },
  principal: { id: "principal", pass: "admin", name: "Principal Demo" }
};

/* ---------- grading ---------- */
const grade = o => o >= 85 ? ["A+", 4] : o >= 75 ? ["A", 3.5] : o >= 65 ? ["B", 3] : o >= 55 ? ["C", 2] : o >= 40 ? ["D", 1] : ["F", 0];
function baseMarks(roll, s, i) {
  if (roll === "BS-2026-001") return [87, 74, 81, 68][i];
  let h = 0; for (const ch of roll + s) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return 48 + (h % 45);
}
function resultsFor(roll) {
  const m = db.get("marks")[roll] || {};
  const rows = SUBJ.map((s, i) => { const o = m[s] !== undefined && m[s] !== "" ? +m[s] : baseMarks(roll, s, i); const g = grade(o); return { s, total: 100, o, g: g[0], p: g[1] }; });
  const gpa = rows.reduce((a, r) => a + r.p, 0) / rows.length;
  return { rows, gpa: gpa.toFixed(2), total: rows.reduce((a, r) => a + r.o, 0) };
}
const isPaid = (roll, m) => { const f = db.get("fees"); const k = roll + "|" + m; return k in f ? f[k] : (m === "September" || m === "October"); };

/* ---------- translations ---------- */
const I18N = {
  en: { home: "Home", about: "About", departments: "Departments", admissions: "Admissions", faculty: "Faculty", news: "News", more: "More", downloads: "Downloads", results: "Results", library: "Library", societies: "Societies & Sports", gallery: "Gallery", facilities: "Facilities", faq: "FAQ", events: "Events", contact: "Contact", login: "Login", dashboard: "Dashboard", logout: "Logout", search: "Search college...", apply: "Apply for Admission", portal: "Student / Teacher Login", latest: "Latest:", heroSub: "Ilm, kirdar aur kamyabi ka safar. 11th se BS tak maiyari taleem, tajurbakar asatiza aur jadeed facilities.", quick: "Quick Access", notices: "Notice Board", upcoming: "Upcoming Events", principalMsg: "Principal's Message", words: "What People Say", deptsSub: "Apna program chunein", readMore: "View all" },
  ur: { home: "ہوم", about: "ہمارے بارے میں", departments: "شعبہ جات", admissions: "داخلے", faculty: "اساتذہ", news: "خبریں", more: "مزید", downloads: "ڈاؤن لوڈز", results: "نتائج", library: "لائبریری", societies: "سوسائٹیز و کھیل", gallery: "گیلری", facilities: "سہولیات", faq: "عمومی سوالات", events: "تقریبات", contact: "رابطہ", login: "لاگ ان", dashboard: "ڈیش بورڈ", logout: "لاگ آؤٹ", search: "کالج میں تلاش کریں...", apply: "داخلے کے لیے اپلائی کریں", portal: "طالب علم / استاد لاگ ان", latest: "تازہ ترین:", heroSub: "علم، کردار اور کامیابی کا سفر۔ گیارہویں سے بی ایس تک معیاری تعلیم، تجربہ کار اساتذہ اور جدید سہولیات۔", quick: "فوری رسائی", notices: "نوٹس بورڈ", upcoming: "آنے والی تقریبات", principalMsg: "پرنسپل کا پیغام", words: "لوگ کیا کہتے ہیں", deptsSub: "اپنا پروگرام منتخب کریں", readMore: "سب دیکھیں" }
};
let lang = LS.get("lang", "en");
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
