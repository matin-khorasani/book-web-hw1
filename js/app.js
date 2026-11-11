// ===== توابع کمکی نمایش =====

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

// ===== کارت کتاب =====
// ورودی: یک شیء از BOOKS. خروجی: عنصر <article> آماده درج در صفحه
function createBookCard(book) {
  const card = el("article", "book-card");

  const link = el("a", "book-card-link");
  link.href = "?view=book&id=" + encodeURIComponent(book.id);

  // جلد
  const coverBox = el("div", "book-cover");
  const img = document.createElement("img");
  img.src = book.cover;
  img.alt = "جلد کتاب " + book.title;
  img.loading = "lazy";
  img.addEventListener("error", () => { img.hidden = true; }); // عکس نبود: فقط پس‌زمینه خاکستری
  coverBox.append(img);

  // عنوان و نویسنده
  const title = el("h3", "book-title", book.title);
  const author = el("p", "book-author", book.author);

  // امتیاز
  const rating = el("p", "book-rating");
  rating.append(el("span", "star", "★"), " " + formatRating(book.rating));
  rating.setAttribute("aria-label", "امتیاز " + formatRating(book.rating) + " از ۵");

  // قیمت یا برچسب رایگان
  const price = book.price === 0
    ? el("span", "badge-free", "رایگان")
    : el("span", "book-price", formatNumber(book.price) + " ت");

  link.append(coverBox, title, author, rating, price);
  card.append(link);
  return card;
}

// ===== رندر آزمایشی (در قدم بعد با صفحه اصلی واقعی جایگزین می‌شود) =====
function renderCardTest() {
  const app = document.getElementById("app");
  app.replaceChildren();
  const grid = el("div", "book-grid");
  BOOKS.forEach((book) => grid.append(createBookCard(book)));
  app.append(grid);
}

renderCardTest();