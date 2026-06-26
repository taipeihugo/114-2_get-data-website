const STORAGE_KEY = "coursepulse.surveyResponses";

const form = document.querySelector("#surveyForm");
const formStatus = document.querySelector("#formStatus");
const recordsBody = document.querySelector("#recordsBody");
const emptyState = document.querySelector("#emptyState");
const downloadButton = document.querySelector("#downloadCsv");
const clearButton = document.querySelector("#clearRecords");
const totalResponses = document.querySelector("#totalResponses");
const averageOverall = document.querySelector("#averageOverall");
const averageInstructor = document.querySelector("#averageInstructor");

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

function formatRating(value) {
  return value ? `${value} / 5` : "—";
}

function getAverage(records, field) {
  const ratings = records.map((record) => Number(record[field])).filter(Boolean);
  if (ratings.length === 0) return "—";
  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return `${average.toFixed(1)} / 5`;
}

function renderSummary(records) {
  totalResponses.textContent = records.length;
  averageOverall.textContent = getAverage(records, "overallRating");
  averageInstructor.textContent = getAverage(records, "instructorRating");
}

function renderRecords() {
  const records = getRecords();
  renderSummary(records);
  recordsBody.innerHTML = records
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.createdAt)}</td>
          <td>${escapeHtml(record.courseName)}</td>
          <td>${escapeHtml(record.studentName || "匿名")}</td>
          <td>${escapeHtml(formatRating(record.overallRating))}</td>
          <td>${escapeHtml(formatRating(record.contentRating))}</td>
          <td>${escapeHtml(formatRating(record.instructorRating))}</td>
          <td>${escapeHtml(formatRating(record.materialRating))}</td>
          <td>${escapeHtml(record.mostHelpful || "—")}</td>
          <td>${escapeHtml(record.improvement || "—")}</td>
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
  const headers = [
    "時間",
    "課程名稱",
    "講師姓名",
    "學員姓名",
    "Email",
    "整體滿意度",
    "課程內容",
    "講師教學",
    "教材品質",
    "最有幫助",
    "希望改進",
    "未來想學",
  ];
  const rows = records.map((record) => [
    record.createdAt,
    record.courseName,
    record.instructor,
    record.studentName,
    record.email,
    record.overallRating,
    record.contentRating,
    record.instructorRating,
    record.materialRating,
    record.mostHelpful,
    record.improvement,
    record.futureTopic,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map(recordToCsvValue).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `course-satisfaction-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    setStatus("請確認必填評分欄位與同意勾選。", "error");
    return;
  }

  const formData = new FormData(form);
  const record = {
    createdAt: new Date().toLocaleString("zh-TW", { hour12: false }),
    courseName: formData.get("courseName").trim(),
    instructor: formData.get("instructor").trim(),
    studentName: formData.get("studentName").trim(),
    email: formData.get("email").trim(),
    overallRating: formData.get("overallRating"),
    contentRating: formData.get("contentRating"),
    instructorRating: formData.get("instructorRating"),
    materialRating: formData.get("materialRating"),
    mostHelpful: formData.get("mostHelpful").trim(),
    improvement: formData.get("improvement").trim(),
    futureTopic: formData.get("futureTopic").trim(),
  };

  const records = getRecords();
  records.unshift(record);
  saveRecords(records);
  renderRecords();
  form.reset();
  setStatus("問卷已成功保存於本機瀏覽器。", "success");
});

downloadButton.addEventListener("click", downloadCsv);

clearButton.addEventListener("click", () => {
  const confirmed = window.confirm("確定要清除所有問卷回覆嗎？此動作無法復原。");
  if (!confirmed) return;
  saveRecords([]);
  renderRecords();
  setStatus("所有問卷回覆已清除。", "success");
});

renderRecords();
