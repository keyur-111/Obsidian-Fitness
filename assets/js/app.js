/* OBSIDIAN FITNESS — data, storage, form validation and page logic (plain JavaScript) */
const PLANS = [{
  name: "1 Month",
  price: 1500
}, {
  name: "3 Months",
  price: 3500
}, {
  name: "6 Months",
  price: 7000
}];
const SEED = {
  members: [{
    id: "m1",
    name: "Johnathan Smith",
    email: "j.smith@gmail.com",
    phone: "9876500001",
    plan: "1 Month",
    status: "Active",
    joined: "2024-01-12",
    lastAttendance: "Today"
  }, {
    id: "m2",
    name: "Sarah Jenkins",
    email: "sarah.k.j@outlook.com",
    phone: "9876500002",
    plan: "6 Months",
    status: "Active",
    joined: "2023-11-03",
    lastAttendance: "Yesterday"
  }, {
    id: "m3",
    name: "Marcus Broadus",
    email: "mbroadus@verizon.net",
    phone: "9876500003",
    plan: "3 Months",
    status: "Active",
    joined: "2023-08-15",
    lastAttendance: "Today"
  }, {
    id: "m4",
    name: "Emily Watson",
    email: "em.watson@yahoo.com",
    phone: "9876500004",
    plan: "1 Month",
    status: "Inactive",
    joined: "2024-02-10",
    lastAttendance: "1 week ago"
  }, {
    id: "m5",
    name: "Aria Montgomery",
    email: "aria.mont@gmail.com",
    phone: "9876500006",
    plan: "3 Months",
    status: "Suspended",
    joined: "2023-07-19",
    lastAttendance: "1 month ago"
  }, ],
  classes: [{
    id: "c1",
    title: "HIIT Conditioning",
    schedule: "Mon/Wed/Fri 07:00",
    instructor: "Coach Amit Shah",
    booked: 18,
    capacity: 20
  }, {
    id: "c2",
    title: "Olympic Lifting",
    schedule: "Tue/Thu 12:00",
    instructor: "Coach Ravi Patel",
    booked: 12,
    capacity: 15
  }, {
    id: "c3",
    title: "Endurance & Engine Lab",
    schedule: "Mon/Wed/Fri 17:30",
    instructor: "Coach Priya Solanki",
    booked: 20,
    capacity: 20
  }, {
    id: "c4",
    title: "Power Lifting Foundations",
    schedule: "Sat 10:00",
    instructor: "Coach Darshan Mehta",
    booked: 8,
    capacity: 10
  }, {
    id: "c5",
    title: "Mobility & Recovery",
    schedule: "Sun 11:00",
    instructor: "Coach Neha Joshi",
    booked: 15,
    capacity: 25
  }, ],
  trainers: [{
    id: "t1",
    name: "Coach Ravi Patel",
    specialty: "Olympic Lifting & Power",
    status: "On-Duty",
    phone: "9876543101"
  }, {
    id: "t2",
    name: "Coach Amit Shah",
    specialty: "Metabolic Conditioning & HIIT",
    status: "On-Duty",
    phone: "9876543102"
  }, {
    id: "t3",
    name: "Coach Neha Joshi",
    specialty: "Biomechanics & Rehabilitation",
    status: "On-Duty",
    phone: "9876543103"
  }, {
    id: "t4",
    name: "Coach Darshan Mehta",
    specialty: "Strength Foundations",
    status: "Off-Duty",
    phone: "9876543104"
  }, {
    id: "t5",
    name: "Coach Priya Solanki",
    specialty: "Flexibility & Posture Mobility",
    status: "On-Duty",
    phone: "9876543105"
  }, {
    id: "t6",
    name: "Coach Vikas Rajput",
    specialty: "Athletic Conditioning",
    status: "Leave",
    phone: "9876543106"
  }, ],
  inquiries: [],
};

const Store = {
  get(k) {
    const raw = localStorage.getItem("of_" + k);
    if (raw) return JSON.parse(raw);
    this.set(k, SEED[k]);
    return SEED[k];
  },
  set(k, v) {
    localStorage.setItem("of_" + k, JSON.stringify(v));
  },
};
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
} [c]));
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Validation ---------- */
const RULES = {
  name: [(v) => /^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.trim()), "Enter a valid full name (letters only, 2–60 characters)."],
  email: [(v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "Enter a valid email address."],
  phone: [(v) => /^(\+91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")), "Enter a valid 10-digit mobile number."],
  required: [(v) => v.trim() !== "", "This field is required."],
  message: [(v) => v.trim().length >= 10 && v.length <= 1000, "Message must be 10–1000 characters."],
  min3: [(v) => v.trim().length >= 3, "Enter at least 3 characters."],
  capacity: [(v) => /^\d+$/.test(v) && +v >= 1 && +v <= 100, "Capacity must be a whole number from 1 to 100."],
  password: [(v) => v.length >= 6, "Password must be at least 6 characters."],
};

function validateForm(form) {
  let ok = true;
  form.querySelectorAll("[data-rule]").forEach((el) => {
    const [fn, msg] = RULES[el.dataset.rule];
    const valid = fn(el.value);
    el.classList.toggle("is-invalid", !valid);
    el.classList.toggle("is-valid", valid);
    el.parentElement.querySelector(".invalid-feedback").textContent = msg;
    if (!valid) ok = false;
  });
  return ok;
}
const formData = (form) => Object.fromEntries(new FormData(form).entries());

function resetForm(form) {
  form.reset();
  form.querySelectorAll(".is-valid,.is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
  if (form.id && form.querySelector("[name=id]")) form.querySelector("[name=id]").value = "";
}

function toast(msg, type = "success") {
  let box = document.getElementById("toastBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "toastBox";
    box.className = "toast-container position-fixed top-0 end-0 p-3";
    document.body.append(box);
  }
  const el = document.createElement("div");
  el.className = `toast align-items-center text-bg-${type === "success" ? "success" : "danger"} border-0`;
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(msg)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
  box.append(el);
  new bootstrap.Toast(el, {
    delay: 3000
  }).show();
}
const planOptions = (sel) => PLANS.map((p) => `<option ${p.name === sel ? "selected" : ""}>${p.name}</option>`).join("");

/* ---------- Admin login (demo only, stored in the browser) ---------- */
const ADMIN = {
  email: "admin@obsidianfitness.in",
  password: "obsidian123"
};
const Auth = {
  ok: () => localStorage.getItem("of_admin") === "1",
  guard() {
    if (!this.ok()) location.href = "login.html";
  },
  out() {
    localStorage.removeItem("of_admin");
    location.href = "login.html";
  },
};

/* Generic table CRUD helper for admin pages */
function crud({
  key,
  form,
  body,
  fields,
  row,
  beforeSave,
  onNew,
  titleEl,
  titles
}) {
  const render = () => {
    body.innerHTML = Store.get(key).map(row).join("") || `<tr><td colspan="6" class="text-center text-muted-soft py-4">Nothing here yet.</td></tr>`;
  };
  const setTitle = (edit) => {
    if (titleEl) titleEl.textContent = edit ? titles[1] : titles[0];
  };
  body.addEventListener("click", (e) => {
    const d = e.target.dataset,
      all = Store.get(key);
    if (d.edit) {
      const it = all.find((x) => x.id === d.edit);
      fields.forEach((k) => (form[k].value = it[k]));
      setTitle(true);
      const panel = form.closest(".collapse");
      if (panel) bootstrap.Collapse.getOrCreateInstance(panel).show();
      form.scrollIntoView({
        behavior: "smooth"
      });
    }
    if (d.del && confirm("Are you sure?")) {
      Store.set(key, all.filter((x) => x.id !== d.del));
      render();
      toast("Removed.");
    }
    if (d.toggle) {
      const it = all.find((x) => x.id === d.toggle);
      it.status = it.status === "Frozen" ? "Active" : "Frozen";
      Store.set(key, all);
      render();
    }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;
    const d = formData(form),
      all = Store.get(key);
    const err = beforeSave?.(d, all);
    if (err) return toast(err, "error");
    if (d.id) Object.assign(all.find((x) => x.id === d.id), d);
    else all.unshift({
      ...onNew(d),
      ...d,
      id: uid()
    });
    Store.set(key, all);
    toast(d.id ? "Changes saved." : "Added successfully.");
    resetForm(form);
    setTitle(false);
    render();
  });
  form.addEventListener("reset", () => setTimeout(() => {
    form.querySelectorAll(".is-valid,.is-invalid").forEach((el) => el.classList.remove("is-valid", "is-invalid"));
    form.id && (form.querySelector("[name=id]").value = "");
    setTitle(false);
  }));
  return render;
}
const actions = (id, extra = "") => `<td class="text-nowrap"><button class="btn btn-link btn-sm" data-edit="${id}">Edit</button>${extra}<button class="btn btn-link btn-sm text-danger" data-del="${id}">Delete</button></td>`;

const Pages = {
  contact() {
    const f = document.getElementById("contactForm");
    const requestedService = new URLSearchParams(location.search).get("service");
    const serviceSelect = document.getElementById("service");
    if (requestedService && Array.from(serviceSelect.options).some((option) => option.value === requestedService)) serviceSelect.value = requestedService;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) return;
      const all = Store.get("inquiries");
      all.unshift({
        id: uid(),
        ...formData(f),
        date: today()
      });
      Store.set("inquiries", all);
      toast("Message sent. Our team will get back to you shortly.");
      resetForm(f);
    });
  },
  join() {
    const f = document.getElementById("joinForm");
    f.plan.innerHTML = `<option value="">Select a plan</option>` + planOptions(new URLSearchParams(location.search).get("plan"));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) return;
      const d = formData(f),
        all = Store.get("members");
      if (all.some((m) => m.email.toLowerCase() === d.email.toLowerCase())) return toast("This email is already registered.", "error");
      all.unshift({
        id: uid(),
        ...d,
        status: "Active",
        joined: today()
      });
      Store.set("members", all);
      f.classList.add("d-none");
      document.getElementById("joinDone").classList.remove("d-none");
      document.getElementById("joinName").textContent = d.name.split(" ")[0];
    });
  },
  schedule() {
    const body = document.getElementById("scheduleBody");
    const render = () => {
      body.innerHTML = Store.get("classes").map((c) => {
        const full = c.booked >= c.capacity;
        return `<tr><td class="fw-semibold">${esc(c.title)}</td><td>${esc(c.schedule)}</td><td>${esc(c.instructor)}</td><td>${c.booked} / ${c.capacity}</td>
        <td class="text-end"><button class="btn btn-sm ${full ? "btn-of-outline" : "btn-of"}" ${full ? "disabled" : ""} data-book="${c.id}">${full ? "Full" : "Book Class"}</button></td></tr>`;
      }).join("");
    };
    body.addEventListener("click", (e) => {
      const id = e.target.dataset.book;
      if (!id) return;
      const all = Store.get("classes"),
        c = all.find((x) => x.id === id);
      if (c.booked >= c.capacity) return toast("Class is full.", "error");
      c.booked++;
      Store.set("classes", all);
      render();
      toast(`Spot reserved in ${c.title}.`);
    });
    render();
  },
  login() {
    if (Auth.ok()) location.href = "dashboard.html";
    const f = document.getElementById("loginForm");
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) return;
      const d = formData(f);
      if (d.email.trim().toLowerCase() === ADMIN.email && d.password === ADMIN.password) {
        localStorage.setItem("of_admin", "1");
        location.href = "dashboard.html";
      } else {
        f.password.classList.add("is-invalid");
        f.password.parentElement.querySelector(".invalid-feedback").textContent = "Incorrect email or password.";
      }
    });
  },
  dashboard() {
    const m = Store.get("members"),
      c = Store.get("classes");
    const active = m.filter((x) => x.status === "Active");
    const revenue = active.reduce((s, x) => s + (PLANS.find((p) => p.name === x.plan)?.price || 0), 0);
    const week = Date.now() - 7 * 864e5;
    document.getElementById("sMembers").textContent = active.length;
    document.getElementById("sRevenue").textContent = "₹" + revenue.toLocaleString("en-IN");
    document.getElementById("sClasses").textContent = c.length;
    document.getElementById("sNew").textContent = m.filter((x) => new Date(x.joined) > week).length;
    document.getElementById("opsLog").innerHTML = m.slice(0, 5).map((x) => `<li class="list-group-item d-flex justify-content-between"><span>${esc(x.name)} registered on ${esc(x.plan)} plan</span><span class="text-muted-soft">${x.joined}</span></li>`).join("");
    document.getElementById("peakList").innerHTML = c.slice(0, 4).map((item) => {
      const percent = Math.round((item.booked / item.capacity) * 100);
      return `<div class="mb-3"><div class="d-flex justify-content-between small mb-1"><span>${esc(item.title)}</span><span class="text-muted-soft">${percent}%</span></div><div class="progress" style="height:8px"><div class="progress-bar" style="width:${percent}%;background:var(--sage)"></div></div></div>`;
    }).join("");
  },
  members() {
    const f = document.getElementById("memberForm"),
      body = document.getElementById("memberBody");
    const q = document.getElementById("q"),
      fp = document.getElementById("fPlan"),
      fs = document.getElementById("fStatus");
    f.plan.innerHTML = `<option value="">Select plan</option>` + planOptions();
    fp.innerHTML = `<option value="All">Membership: All</option>` + planOptions();
    const show = (m) => (m.name + m.email).toLowerCase().includes(q.value.toLowerCase()) && (fp.value === "All" || m.plan === fp.value) && (fs.value === "All" || m.status === fs.value);
    const render = crud({
      key: "members",
      form: f,
      body,
      fields: ["id", "name", "email", "phone", "plan"],
      titleEl: document.getElementById("memberTitle"),
      titles: ["Register New Member", "Edit Member"],
      row: (m) => show(m) ? `<tr><td><div class="fw-semibold">${esc(m.name)}</div><div class="small text-muted-soft">${esc(m.email)}</div></td><td>${esc(m.plan)}</td><td><span class="pill pill-${m.status}">${m.status}</span></td><td>${esc(m.joined)}</td><td>${esc(m.lastAttendance || "Not yet visited")}</td><td class="text-nowrap"><button class="btn btn-link btn-sm" data-edit="${m.id}">Edit</button><button class="btn btn-link btn-sm" data-toggle="${m.id}">${m.status === "Frozen" ? "Unfreeze" : "Freeze"}</button></td></tr>` : "",
      beforeSave: (d, all) => all.some((m) => m.email.toLowerCase() === d.email.toLowerCase() && m.id !== d.id) ? "A member with this email already exists." : null,
      onNew: () => ({
        status: "Active",
        joined: today(),
        lastAttendance: "Not yet visited"
      }),
    });
    [q, fp, fs].forEach((el) => el.addEventListener("input", render));
    render();
  },
  classes() {
    const f = document.getElementById("classForm");
    f.instructor.innerHTML = `<option value="">Select Trainer...</option>` + Store.get("trainers").map((t) => `<option>${esc(t.name)}</option>`).join("");
    crud({
      key: "classes",
      form: f,
      body: document.getElementById("classBody"),
      fields: ["id", "title", "schedule", "instructor", "capacity"],
      row: (c) => `<tr><td class="fw-semibold">${esc(c.title)}</td><td>${esc(c.schedule)}</td><td>${esc(c.instructor)}</td><td>${c.booked} / ${c.capacity}</td>${actions(c.id)}</tr>`,
      beforeSave: (d, all) => {
        d.capacity = +d.capacity;
        const c = all.find((x) => x.id === d.id);
        return c && d.capacity < c.booked ? `Already ${c.booked} booked — capacity can't be lower.` : null;
      },
      onNew: () => ({
        booked: 0
      }),
    })();
  },
  trainers() {
    crud({
      key: "trainers",
      form: document.getElementById("trainerForm"),
      body: document.getElementById("trainerBody"),
      fields: ["id", "name", "specialty", "phone", "status"],
      row: (t) => `<tr><td class="fw-semibold">${esc(t.name)}</td><td>${esc(t.specialty)}</td><td><span class="pill pill-${t.status}">${t.status}</span></td><td>${esc(t.phone)}</td>${actions(t.id)}</tr>`,
      onNew: () => ({}),
    })();
  },
  reports() {
    const rev = [
      ["Oct", 9800],
      ["Nov", 11200],
      ["Dec", 10400],
      ["Jan", 12800],
      ["Feb", 13900],
      ["Mar", 14250]
    ];
    const max = Math.max(...rev.map((r) => r[1]));
    document.getElementById("revChart").innerHTML = rev.map(([m, v]) => `<div style="height:${(v / max) * 100}%" title="${m}: ₹${v}"></div>`).join("");
    document.getElementById("revLabels").innerHTML = rev.map(([m]) => `<span class="flex-fill text-center small text-muted-soft">${m}</span>`).join("");
    document.getElementById("attList").innerHTML = Store.get("classes").map((c) => {
      const p = Math.round((c.booked / c.capacity) * 100);
      return `<div class="mb-3"><div class="d-flex justify-content-between small"><span>${esc(c.title)}</span><span class="text-muted-soft">${p}% Average</span></div><div class="progress" style="height:8px"><div class="progress-bar" style="width:${p}%;background:var(--sage)"></div></div></div>`;
    }).join("");
    document.querySelectorAll("[data-period]").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll("[data-period]").forEach((x) => (x.className = "btn btn-sm btn-of-outline"));
      b.className = "btn btn-sm btn-of";
    }));
    document.getElementById("exportBtn").addEventListener("click", () => {
      const rows = [
        ["Name", "Email", "Plan", "Status", "Joined"], ...Store.get("members").map((m) => [m.name, m.email, m.plan, m.status, m.joined])
      ];
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")], {
        type: "text/csv"
      }));
      a.download = "obsidian-fitness-members.csv";
      a.click();
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.admin) Auth.guard();
  document.querySelectorAll("[data-logout]").forEach((b) => b.addEventListener("click", () => Auth.out()));
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  Pages[document.body.dataset.page]?.();
});
