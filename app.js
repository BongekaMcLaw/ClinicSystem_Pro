// Add this to the top of app.js
function validateData(pid, phone, name) {
  const idRegex = /^\d{13}$/; // Checks for exactly 13 digits
  const phoneRegex = /^0\d{9}$/; // Checks for 10 digits starting with 0
  const nameRegex = /^[a-zA-Z\s]{3,}$/; // Names must be at least 3 letters

  if (!nameRegex.test(name)) return "Invalid Name: Use letters only (min 3).";
  if (!idRegex.test(pid)) return "Invalid ID: Must be exactly 13 digits.";
  if (!phoneRegex.test(phone))
    return "Invalid Phone: Use 10 digits (e.g., 071...).";

  return null; // No errors
}

document.getElementById("patientForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const symptomText = document.getElementById("symptoms").value.toLowerCase();

  // UNIQUE FEATURE: Automated Triage
  const urgentTerms = [
    "pain",
    "breath",
    "blood",
    "heart",
    "fever",
    "emergency",
  ];
  const priority = urgentTerms.some((term) => symptomText.includes(term))
    ? "URGENT"
    : "STABLE";

  const patient = {
    name: document.getElementById("fullName").value,
    pid: document.getElementById("patientID").value,
    phone: document.getElementById("contact").value,
    priority: priority,
    time: new Date().toLocaleTimeString(),
  };

  await addPatient(patient);
  e.target.reset();
  loadTable();
});

async function loadTable() {
  const patients = await getPatients();
  const body = document.getElementById("recordBody");
  body.innerHTML = patients
    .map(
      (p) => `
        <tr>
            <td>${p.name}</td>
            <td>${p.pid}</td>
            <td><span class="badge ${p.priority.toLowerCase()}">${p.priority}</span></td>
            <td>${p.time}</td>
        </tr>
    `,
    )
    .join("");
}

// UNIQUE FEATURE: Real-time Search
function filterRecords() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#recordBody tr");
  rows.forEach((row) => {
    row.style.display = row.innerText.toLowerCase().includes(query)
      ? ""
      : "none";
  });
}

function logout() {
  // Clears the session so the Guard Script will trigger on refresh[cite: 1]
  sessionStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

window.onload = loadTable;
