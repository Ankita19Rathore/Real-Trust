const apiBase = "http://localhost:5000";

/* ----------------------------------------------
   Escape HTML (Security)
---------------------------------------------- */
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

/* ==================================================
   1) HERO CONSULTATION FORM  → POST /api/contacts
================================================== */
(function () {
  const box = document.querySelector(".consult-box");
  if (!box) return;

  const inputs = box.querySelectorAll("input");
  const btn = box.querySelector(".quote-btn");

  btn.addEventListener("click", async () => {
    const fullName = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const mobile = inputs[2].value.trim();
    const city = inputs[3].value.trim();

    if (!fullName || !email) {
      alert("Please fill your name and email.");
      return;
    }

    try {
      const res = await fetch(apiBase + "/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, mobile, city })
      });

      if (!res.ok) throw new Error("Failed to submit!");

      alert("Thank you! We will contact you soon.");
      inputs.forEach(i => i.value = "");
    } catch (err) {
      alert("Something went wrong. Try again.");
    }
  });
})();

/* ==================================================
   2) FOOTER SUBSCRIBE FORM  → POST /api/subscribers
================================================== */
(function () {
  const foot = document.querySelector(".footer-subscribe");
  if (!foot) return;

  const emailInput = foot.querySelector("input");
  const btn = foot.querySelector("button");

  btn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const res = await fetch(apiBase + "/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error("Failed!");

      alert("Subscribed successfully!");
      emailInput.value = "";
    } catch (err) {
      alert("Subscription failed! Try again.");
    }
  });
})();
