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

// خواندن معیارها از آدرس؛ دسته نامعتبر نادیده گرفته می‌شود
function readCatalogCriteria(params) {
  const category = params.get("category");
  return {
    query: (params.get("q") || "").trim(),
    category: CATEGORIES.includes(category) ? category : "",
    freeOnly: params.get("free") === "1"
  };
}

// فیلتر دسته و رایگان با هم (اشتراک شرط‌ها)
function filterBooks(books, { category, freeOnly }) {
  return books.filter((book) =>
    (!category || book.category === category) &&
    (!freeOnly || book.price === 0)
  );
}

// نتیجه نهایی: ابتدا جستجو، بعد فیلتر
function getCatalogBooks(criteria) {
  return filterBooks(searchBooks(BOOKS, criteria.query), criteria);
}

function hasActiveCriteria(criteria) {
  return criteria.query !== "" || criteria.category !== "" || criteria.freeOnly;
}