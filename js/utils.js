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

// تبدیل ارقام فارسی (۰-۹) و عربی (٠-٩) به لاتین: "۰۹۱۲" -> "0912"
function normalizeDigits(text) {
  return text.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
  });
}