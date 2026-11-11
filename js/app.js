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

// ===== آدرس‌ها =====
// پارامترهای آدرس: view, category, free, sort, q (در گام فهرست استفاده می‌شوند)
function catalogUrl(params) {
  const query = new URLSearchParams({ view: "catalog", ...params });
  return "?" + query.toString();
}

// ===== ردیف افقی کتاب =====
let rowCounter = 0;

// فعال/غیرفعال کردن دکمه قبل/بعد (دکمه غیرفعال با CSS پنهان می‌شود)
function setNavButton(button, enabled, fallbackFocus) {
  // اگر دکمه‌ای که فوکوس دارد پنهان می‌شود، فوکوس را گم نکنیم
  if (!enabled && document.activeElement === button) fallbackFocus.focus();
  button.disabled = !enabled;
}

function createBookRow({ title, subtitle, books, href }) {
  const headingId = "row-title-" + (++rowCounter);
  const section = el("section", "book-row");
  section.setAttribute("aria-labelledby", headingId);

  // سربرگ ردیف: عنوان، زیرعنوان، مشاهده همه
  const header = el("div", "row-header");
  const heading = el("div");
  const h2 = el("h2", "row-title", title);
  h2.id = headingId;
  heading.append(h2, el("p", "row-subtitle", subtitle));
  const viewAll = el("a", "view-all", "مشاهده همه ");
  viewAll.append(el("span", "chevron", "‹")); // داخل span ltr تا آینه نشود
  viewAll.href = href;
  header.append(heading, viewAll);

  // مسیر اسکرول + دکمه‌های قبل/بعد
  const wrapper = el("div", "row-wrapper");
  const track = el("div", "row-track");
  track.tabIndex = 0;
  track.setAttribute("role", "region");
  track.setAttribute("aria-label", title);
  books.forEach((book) => track.append(createBookCard(book)));

  const prev = el("button", "row-btn row-btn-prev", "›");
  prev.type = "button";
  prev.setAttribute("aria-label", "قبلی: " + title);
  const next = el("button", "row-btn row-btn-next", "‹");
  next.type = "button";
  next.setAttribute("aria-label", "بعدی: " + title);

  // در RTL ادامه محتوا سمت چپ است، پس «بعدی» به چپ اسکرول می‌کند
  const step = () => track.clientWidth * 0.8;
  prev.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));

  // در RTL مقدار scrollLeft از صفر شروع و به سمت منفی می‌رود، پس قدر مطلق می‌گیریم
  const updateButtons = () => {
    const max = track.scrollWidth - track.clientWidth;
    const pos = Math.abs(track.scrollLeft);
    setNavButton(prev, pos > 1, track);
    setNavButton(next, pos < max - 1, track);
  };
  track.addEventListener("scroll", updateButtons);
  new ResizeObserver(updateButtons).observe(track); // بعد از اولین نمایش و تغییر اندازه

  wrapper.append(prev, track, next);
  section.append(header, wrapper);
  return section;
}

// ===== بخش‌های صفحه اصلی =====
function createBanner() {
  const banner = el("section", "banner");
  banner.append(
    el("h1", "banner-title", "هر کتابی که می‌خواهی، همین‌جا"),
    el("p", "banner-text", "کتاب‌های داستان، تاریخ و ادبیات را پیدا کن، نمونه‌اش را بخوان و به کتابخانه‌ات اضافه کن.")
  );
  const cta = el("a", "btn btn-light", "کتاب‌های رایگان");
  cta.href = catalogUrl({ free: "1" });
  banner.append(cta);
  return banner;
}

function createCategories() {
  const section = el("section", "categories");
  section.setAttribute("aria-labelledby", "categories-title");
  const h2 = el("h2", "row-title", "دسته‌بندی‌ها");
  h2.id = "categories-title";
  const list = el("ul", "category-list");
  CATEGORIES.forEach((name) => {
    const item = el("li");
    const link = el("a", "category-chip", name);
    link.href = catalogUrl({ category: name });
    item.append(link);
    list.append(item);
  });
  section.append(h2, list);
  return section;
}

// ===== صفحه اصلی =====
function renderHome() {
  // ابتدا داده‌ها را آماده می‌کنیم، بعد صفحه را پاک می‌کنیم
  const recommended = [...BOOKS].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const newest = [...BOOKS].reverse().slice(0, 8); // فعلاً آخرین کتاب‌های آرایه = تازه‌ترین
  const free = BOOKS.filter((book) => book.price === 0);

  const app = document.getElementById("app");
  app.replaceChildren(
    createBanner(),
    createCategories(),
    createBookRow({
      title: "پیشنهادهای کتاب‌سرا",
      subtitle: "پرامتیازترین کتاب‌ها",
      books: recommended,
      href: catalogUrl({ sort: "rating" })
    }),
    createBookRow({
      title: "تازه‌ها",
      subtitle: "اولین نفر باش که می‌خوانی",
      books: newest,
      href: catalogUrl()
    }),
    createBookRow({
      title: "کتاب‌های رایگان",
      subtitle: "بدون هزینه بخوان",
      books: free,
      href: catalogUrl({ free: "1" })
    })
  );
}

// ===== صفحه فهرست =====
function renderCatalog(params) {
  document.title = "فهرست کتاب‌ها | کتاب‌سرا";
  const books = BOOKS; // جستجو و فیلتر در قدم‌های بعد

  const header = el("div", "catalog-header");
  header.append(
    el("h1", "catalog-title", "فهرست کتاب‌ها"),
    el("p", "result-count", formatNumber(books.length) + " کتاب")
  );

  const grid = el("div", "book-grid");
  books.forEach((book) => grid.append(createBookCard(book)));

  document.getElementById("app").replaceChildren(header, grid);
}

// ===== نماهایی که هنوز ساخته نشده‌اند =====
function renderComingSoon() {
  const box = el("div", "message-box");
  box.append(el("h1", "catalog-title", "این بخش به‌زودی ساخته می‌شود"));
  const back = el("a", "btn btn-primary", "بازگشت به صفحه اصلی");
  back.href = "index.html";
  box.append(back);
  document.getElementById("app").replaceChildren(box);
}

function renderNotFound() {
  document.title = "صفحه پیدا نشد | کتاب‌سرا";
  const box = el("div", "message-box");
  box.append(el("h1", "catalog-title", "صفحه پیدا نشد"));
  const back = el("a", "btn btn-primary", "بازگشت به صفحه اصلی");
  back.href = "index.html";
  box.append(back);
  document.getElementById("app").replaceChildren(box);
}

// ===== ثبت نماها و شروع =====
registerRoute("home", () => { document.title = "کتاب‌سرا"; renderHome(); });
registerRoute("catalog", renderCatalog);
["book", "library", "reader", "login"].forEach((v) => registerRoute(v, renderComingSoon));
registerRoute("notFound", renderNotFound);

renderRoute();