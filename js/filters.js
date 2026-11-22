// منطق خالص جستجو و فیلتر (بدون DOM)
// ورودی و خروجی همه توابع داده است؛ نمایش در views.js و components.js انجام می‌شود.

// یکسان‌سازی متن برای مقایسه: فاصله اول/آخر، حروف عربی، نیم‌فاصله، حروف لاتین
function normalizeText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, "");
}

// کتاب‌هایی که عنوان یا نویسنده‌شان شامل عبارت است؛ عبارت خالی یعنی همه کتاب‌ها
function searchBooks(books, query) {
  const q = normalizeText(query);
  if (q === "") return books;
  return books.filter((book) =>
    normalizeText(book.title).includes(q) || normalizeText(book.author).includes(q)
  );
}

// حالت‌های مرتب‌سازی؛ value همان مقدار پارامتر sort در آدرس است
const SORT_OPTIONS = [
  { value: "price-asc", label: "قیمت: کم به زیاد" },
  { value: "price-desc", label: "قیمت: زیاد به کم" },
  { value: "rating", label: "امتیاز: بیشترین" }
];

// خواندن معیارها از آدرس؛ دسته و مرتب‌سازی نامعتبر نادیده گرفته می‌شوند
function readCatalogCriteria(params) {
  const category = params.get("category");
  const sort = params.get("sort");
  return {
    query: (params.get("q") || "").trim(),
    category: CATEGORIES.includes(category) ? category : "",
    freeOnly: params.get("free") === "1",
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : ""
  };
}

// فیلتر دسته و رایگان با هم (اشتراک شرط‌ها)
function filterBooks(books, { category, freeOnly }) {
  return books.filter((book) =>
    (!category || book.category === category) &&
    (!freeOnly || book.price === 0)
  );
}

// مرتب‌سازی روی یک کپی (آرایه اصلی تغییر نمی‌کند)؛ sort پایدار است،
// پس کتاب‌های هم‌ارزش ترتیب اولیه‌شان را حفظ می‌کنند
function sortBooks(books, sort) {
  const sorted = [...books];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
  return sorted;
}

// نتیجه نهایی: ابتدا جستجو، بعد فیلتر، در آخر مرتب‌سازی
function getCatalogBooks(criteria) {
  const found = filterBooks(searchBooks(BOOKS, criteria.query), criteria);
  return sortBooks(found, criteria.sort);
}

function hasActiveCriteria(criteria) {
  return criteria.query !== "" || criteria.category !== "" || criteria.freeOnly || criteria.sort !== "";
}

// کتاب‌های هم‌دسته با کتاب داده‌شده (خود کتاب حذف می‌شود)، حداکثر count تا
function getRelatedBooks(book, count) {
  return BOOKS
    .filter((other) => other.category === book.category && other.id !== book.id)
    .slice(0, count);
}