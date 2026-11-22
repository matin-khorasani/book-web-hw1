// اجزای قابل استفاده مجدد رابط: کارت، ردیف افقی، بنر، دسته‌ها، نوار فیلتر
// همه از روی داده ساخته می‌شوند و فقط عنصر DOM برمی‌گردانند.

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
  card.append(link, createFavoriteButton(book, "card"));
  return card;
}

// فعال/غیرفعال کردن دکمه قبل/بعد (دکمه غیرفعال با CSS پنهان می‌شود)
function setNavButton(button, enabled, fallbackFocus) {
  // اگر دکمه‌ای که فوکوس دارد پنهان می‌شود، فوکوس را گم نکنیم
  if (!enabled && document.activeElement === button) fallbackFocus.focus();
  button.disabled = !enabled;
}

let rowCounter = 0; // شمارنده برای شناسه یکتای عنوان هر ردیف

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

// جستجوی هدر باید فیلترهای فعلی را نگه دارد تا با هم ترکیب شوند
function syncHeaderSearch(criteria) {
  const form = document.querySelector(".search-form");
  form.querySelectorAll("input[data-keep]").forEach((input) => input.remove());
  const keep = { category: criteria.category, free: criteria.freeOnly ? "1" : "", sort: criteria.sort };
  Object.entries(keep).forEach(([name, value]) => {
    if (!value) return;
    const input = hiddenInput(name, value);
    input.dataset.keep = "1";
    form.append(input);
  });
}

// نوار فیلتر: دسته، فقط رایگان، مرتب‌سازی، دکمه اعمال، پاک کردن
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

  // مرتب‌سازی
  const sortField = el("div", "filter-field");
  const sortLabel = el("label", "", "مرتب‌سازی");
  sortLabel.htmlFor = "filter-sort";
  const sortSelect = el("select");
  sortSelect.id = "filter-sort";
  sortSelect.name = "sort";
  const defaultSort = el("option", "", "پیش‌فرض");
  defaultSort.value = "";
  sortSelect.append(defaultSort);
  SORT_OPTIONS.forEach(({ value, label: text }) => {
    const option = el("option", "", text);
    option.value = value;
    sortSelect.append(option);
  });
  sortSelect.value = criteria.sort;
  sortField.append(sortLabel, sortSelect);

  const apply = el("button", "btn btn-primary", "اعمال");
  apply.type = "submit";

  form.append(field, check, sortField, apply);

  if (hasActiveCriteria(criteria)) {
    const clear = el("a", "clear-filters", "پاک کردن همه فیلترها");
    clear.href = catalogUrl();
    form.append(clear);
  }
  return form;
}