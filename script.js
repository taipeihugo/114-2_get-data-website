const STORAGE_KEY = "datacollect.records";

const form = document.querySelector("#dataForm");
const formStatus = document.querySelector("#formStatus");
const recordsBody = document.querySelector("#recordsBody");
const emptyState = document.querySelector("#emptyState");
const downloadButton = document.querySelector("#downloadCsv");
const clearButton = document.querySelector("#clearRecords");

function getRecords() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRecords() {
  const records = getRecords();
  recordsBody.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.createdAt)}</td>
          <td>${escapeHtml(record.name)}</td>
          <td>${escapeHtml(record.email)}</td>
          <td>${escapeHtml(record.phone || "—")}</td>
          <td>${escapeHtml(record.purpose)}</td>
          <td>${escapeHtml(record.message || "—")}</td>
        </tr>
      `,
    )
    .join("");

  emptyState.hidden = records.length > 0;
  downloadButton.disabled = records.length === 0;
  clearButton.disabled = records.length === 0;
}

function setStatus(message, type = "success") {
  formStatus.textContent = message;
  formStatus.className = `status status--${type}`;
}

function recordToCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv() {
  const records = getRecords();
  const headers = ["時間", "姓名", "Email", "電話", "用途", "備註"];
  const rows = records.map((record) => [
    record.createdAt,
    record.name,
    record.email,
    record.phone,
    record.purpose,
    record.message,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(recordToCsvValue).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `datacollect-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    setStatus("請確認必填欄位與同意勾選。", "error");
    return;
  }

  const formData = new FormData(form);
  const record = {
    createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    purpose: formData.get("purpose"),
    message: formData.get("message").trim(),
  };

  const records = getRecords();
  records.unshift(record);
  saveRecords(records);
  renderRecords();
  form.reset();
  setStatus("資料已成功保存於本機瀏覽器。", "success");
});

downloadButton.addEventListener("click", downloadCsv);

clearButton.addEventListener("click", () => {
  const confirmed = window.confirm("確定要清除所有已保存資料嗎？此動作無法復原。");
  if (!confirmed) return;
  saveRecords([]);
  renderRecords();
  setStatus("所有資料已清除。", "success");
});

renderRecords();
