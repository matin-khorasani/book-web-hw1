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

// ===== جستجو =====
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

// ===== معیارهای فهرست (جستجو + فیلتر) =====
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

function hiddenInput(name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  return input;
}

// جستجوی هدر باید فیلترهای فعلی را نگه دارد تا با هم ترکیب شوند
function syncHeaderSearch(criteria) {
  const form = document.querySelector(".search-form");
  form.querySelectorAll("input[data-keep]").forEach((input) => input.remove());
  const keep = { category: criteria.category, free: criteria.freeOnly ? "1" : "" };
  Object.entries(keep).forEach(([name, value]) => {
    if (!value) return;
    const input = hiddenInput(name, value);
    input.dataset.keep = "1";
    form.append(input);
  });
}

// نوار فیلتر: دسته، فقط رایگان، دکمه اعمال، پاک کردن
function createFilterBar(criteria) {
  const form = el("form", "filter-bar");
  form.method = "get";
  form.action = "index.html";
  form.setAttribute("aria-label", "فیلتر کتاب‌ها");
  form.append(hiddenInput("view", "catalog"));
  if (criteria.query) form.append(hiddenInput("q", criteria.query));

  // دسته‌بندی
  const field = el("div", "filter-field");
  const label = el("label", "", "دسته‌بندی");
  label.htmlFor = "filter-category";
  const select = el("select");
  select.id = "filter-category";
  select.name = "category";
  const all = el("option", "", "همه دسته‌ها");
  all.value = "";
  select.append(all);
  CATEGORIES.forEach((name) => {
    const option = el("option", "", name);
    option.value = name;
    select.append(option);
  });
  select.value = criteria.category;
  field.append(label, select);

  // فقط رایگان
  const check = el("label", "filter-check");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "free";
  checkbox.value = "1";
  checkbox.checked = criteria.freeOnly;
  check.append(checkbox, el("span", "", "فقط کتاب‌های رایگان"));

  const apply = el("button", "btn btn-primary", "اعمال");
  apply.type = "submit";

  form.append(field, check, apply);

  if (hasActiveCriteria(criteria)) {
    const clear = el("a", "clear-filters", "پاک کردن همه فیلترها");
    clear.href = catalogUrl();
    form.append(clear);
  }
  return form;
}

// ===== صفحه فهرست =====
function renderCatalog(params) {
  const criteria = readCatalogCriteria(params);
  const books = getCatalogBooks(criteria);

  document.title = "فهرست کتاب‌ها | کتاب‌سرا";
  document.getElementById("search-input").value = criteria.query; // عبارت جستجو در هدر بماند
  syncHeaderSearch(criteria);

  const header = el("div", "catalog-header");
  const countText = formatNumber(books.length) + " کتاب";
  header.append(
    el("h1", "catalog-title", criteria.query ? "نتایج جستجو" : "فهرست کتاب‌ها"),
    el("p", "result-count", criteria.query ? countText + " برای «" + criteria.query + "»" : countText)
  );

  const filterBar = createFilterBar(criteria);
  const app = document.getElementById("app");

  if (books.length === 0) {
    const empty = el("div", "message-box");
    empty.append(el("p", "", "کتابی با این شرایط پیدا نشد."));
    const back = el("a", "btn btn-primary", "نمایش همه کتاب‌ها");
    back.href = catalogUrl();
    empty.append(back);
    app.replaceChildren(header, filterBar, empty);
    return;
  }

  const grid = el("div", "book-grid");
  books.forEach((book) => grid.append(createBookCard(book)));
  app.replaceChildren(header, filterBar, grid);
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