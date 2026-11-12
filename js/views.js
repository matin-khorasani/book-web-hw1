// نماها (صفحه‌ها): هر تابع محتوای #app را از روی آدرس و داده می‌سازد.

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