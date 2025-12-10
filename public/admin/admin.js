/*******************************
 ADMIN PANEL JS (FIXED)
*******************************/
const apiBase = "http://localhost:5000";  
let token = null;

/*******************************
 LOGIN HANDLING
*******************************/
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app');
const authMsg = document.getElementById('authMsg');
const adminEmailSpan = document.getElementById('adminEmail');

// LOGIN
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  authMsg.textContent = "";

  try {
    const res = await fetch(apiBase + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");

    token = data.token;
    localStorage.setItem("rt_token", token);
    localStorage.setItem("rt_email", email);

    adminEmailSpan.textContent = email;
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    await loadAllStats();
    showSection("dashboard");

  } catch (err) {
    authMsg.textContent = err.message;
  }
};

/*******************************
 RESTORE SESSION (FIXED)
*******************************/
window.addEventListener("load", async () => {
  const savedToken = localStorage.getItem("rt_token");
  const savedEmail = localStorage.getItem("rt_email");

  if (savedToken) {
    token = savedToken;
    adminEmailSpan.textContent = savedEmail;

    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    await loadAllStats();
    showSection("dashboard");
  }
});

/*******************************
 LOGOUT
*******************************/
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("rt_token");
  localStorage.removeItem("rt_email");
  location.reload();
};

/*******************************
 SIDEBAR NAVIGATION
*******************************/
const menuItems = document.querySelectorAll(".sidebar-menu li");
const sections = document.querySelectorAll(".section");

function showSection(id) {
  sections.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  menuItems.forEach(li => {
    li.classList.toggle("active", li.dataset.target === id);
  });

  if (id === "projects") loadProjects();
  if (id === "clients") loadClients();
  if (id === "contacts") loadContacts();
  if (id === "subs") loadSubs();
}

menuItems.forEach(li => {
  li.addEventListener("click", () => showSection(li.dataset.target));
});

/*******************************
 ADD PROJECT
*******************************/
document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return alert("Session expired. Login again.");

  const form = e.target;
  const fd = new FormData(form);

  try {
    const res = await fetch(apiBase + "/api/projects", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: fd
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert("Project added successfully!");
    form.reset();
    loadProjects();
    loadAllStats();

  } catch (err) {
    alert(err.message);
  }
});

/*******************************
 ADD CLIENT
*******************************/
document.getElementById("clientForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return alert("Session expired. Login again.");

  const form = e.target;
  const fd = new FormData(form);

  try {
    const res = await fetch(apiBase + "/api/clients", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token },
      body: fd
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert("Client added successfully!");
    form.reset();
    loadClients();
    loadAllStats();

  } catch (err) {
    alert(err.message);
  }
});

/*******************************
 ESCAPE HTML
*******************************/
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

/*******************************
 LOAD PROJECTS
*******************************/
async function loadProjects() {
  const res = await fetch(apiBase + "/api/projects");
  const arr = await res.json();

  const list = document.getElementById("projectsList");
  list.innerHTML = "";

  document.getElementById("badgeProjects").textContent = arr.length;
  document.getElementById("statProjects").textContent = arr.length;

  arr.forEach(p => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      ${p.imagePath ? `<img src="${p.imagePath}" class="thumb">` : ""}
      <div class="item-main">
        <strong>${escapeHtml(p.name)}</strong>
        <small>${escapeHtml(p.description || "")}</small>
        <div class="meta">Created: ${new Date(p.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn-danger" onclick="delProject('${p._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

/*******************************
 LOAD CLIENTS
*******************************/
async function loadClients() {
  const res = await fetch(apiBase + "/api/clients");
  const arr = await res.json();

  const list = document.getElementById("clientsList");
  list.innerHTML = "";

  document.getElementById("badgeClients").textContent = arr.length;
  document.getElementById("statClients").textContent = arr.length;

  arr.forEach(c => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      ${c.imagePath ? `<img src="${c.imagePath}" class="thumb">` : ""}
      <div class="item-main">
        <strong>${escapeHtml(c.name)}</strong>
        <small>${escapeHtml(c.designation || "")}</small>
        <small>${escapeHtml(c.description || "")}</small>
        <div class="meta">Created: ${new Date(c.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn-danger" onclick="delClient('${c._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

/*******************************
 LOAD CONTACTS
*******************************/
async function loadContacts() {
  const res = await fetch(apiBase + "/api/contacts", {
    headers: { "Authorization": "Bearer " + token }
  });

  const arr = await res.json();
  const list = document.getElementById("contactsList");
  list.innerHTML = "";

  document.getElementById("statContacts").textContent = arr.length;

  arr.forEach(c => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="item-main">
        <strong>${escapeHtml(c.fullName)}</strong>
        <small>${escapeHtml(c.email)} | ${escapeHtml(c.mobile || "")} | ${escapeHtml(c.city || "")}</small>
        <div class="meta">Created: ${new Date(c.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn-danger" onclick="delContact('${c._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

/*******************************
 LOAD SUBSCRIBERS
*******************************/
async function loadSubs() {
  const res = await fetch(apiBase + "/api/subscribers", {
    headers: { "Authorization": "Bearer " + token }
  });

  const arr = await res.json();
  const list = document.getElementById("subsList");
  list.innerHTML = "";

  document.getElementById("statSubs").textContent = arr.length;

  arr.forEach(s => {
    const div = document.createElement("div");
    div.className = "list-item";

    div.innerHTML = `
      <div class="item-main">
        <strong>${escapeHtml(s.email)}</strong>
        <div class="meta">Subscribed: ${new Date(s.createdAt).toLocaleString()}</div>
      </div>
      <button class="btn-danger" onclick="delSub('${s._id}')">Delete</button>
    `;

    list.appendChild(div);
  });
}

/*******************************
 LOAD ALL STATS
*******************************/
async function loadAllStats() {
  await loadProjects();
  await loadClients();
  await loadContacts();
  await loadSubs();
}

/*******************************
 DELETE (Projects, Clients, Contacts, Subs)
*******************************/
window.delProject = async (id) => {
  if (!confirm("Delete this project?")) return;

  await fetch(apiBase + "/api/projects/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  loadProjects();
  loadAllStats();
};

window.delClient = async (id) => {
  if (!confirm("Delete this client?")) return;

  await fetch(apiBase + "/api/clients/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  loadClients();
  loadAllStats();
};

window.delContact = async (id) => {
  if (!confirm("Delete this contact?")) return;

  await fetch(apiBase + "/api/contacts/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  loadContacts();
  loadAllStats();
};

window.delSub = async (id) => {
  if (!confirm("Delete this subscriber?")) return;

  await fetch(apiBase + "/api/subscribers/" + id, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });

  loadSubs();
  loadAllStats();
};
