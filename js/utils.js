// توابع کمکی عمومی: فرمت اعداد، ساخت عنصر DOM، ساخت آدرس
// (بدون وابستگی به نمای خاصی)

// عدد با ارقام فارسی و جداکننده هزارگان: 180000 -> ۱۸۰٬۰۰۰
function formatNumber(n) {
  return n.toLocaleString("fa-IR");
}

// امتیاز با یک رقم اعشار: 4.5 -> ۴٫۵
function formatRating(r) {
  return r.toLocaleString("fa-IR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// ساخت یک عنصر با کلاس و متن (متن با textContent، نه innerHTML)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function hiddenInput(name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  return input;
}

// پارامترهای آدرس: view, category, free, sort, q (در گام فهرست استفاده می‌شوند)
function catalogUrl(params) {
  const query = new URLSearchParams({ view: "catalog", ...params });
  return "?" + query.toString();
}