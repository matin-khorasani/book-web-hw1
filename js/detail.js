// صفحه جزئیات کتاب: مسیر صفحه، اطلاعات کتاب، کارت خرید، کتاب‌های مرتبط

// مسیر صفحه: کتاب‌سرا / دسته / عنوان
function createBreadcrumb(book) {
  const nav = el("nav", "breadcrumb");
  nav.setAttribute("aria-label", "مسیر صفحه");
  const list = el("ol");

  const home = el("li");
  const homeLink = el("a", "", "کتاب‌سرا");
  homeLink.href = "index.html";
  home.append(homeLink);

  const category = el("li");
  const categoryLink = el("a", "", book.category);
  categoryLink.href = catalogUrl({ category: book.category });
  category.append(categoryLink);

  const current = el("li", "", book.title);
  current.setAttribute("aria-current", "page");

  list.append(home, category, current);
  nav.append(list);
  return nav;
}

// کارت خرید: قیمت، دریافت/خرید، علاقه‌مندی، نمونه
function createBuyCard(book) {
  const card = el("aside", "buy-card");
  card.setAttribute("aria-label", "خرید و دریافت");

  // قیمت
  const priceBox = el("p", "detail-price");
  if (book.price === 0) {
    priceBox.append(el("span", "badge-free badge-free-lg", "رایگان"));
  } else {
    priceBox.append("قیمت: ", el("strong", "", formatNumber(book.price)), " تومان");
  }

  card.append(priceBox, createAcquireButton(book), createFavoriteButton(book, "detail"));

  // نمونه: اگر نبود، کنترل غیرفعال همراه با توضیح
  if (book.sample.length > 0) {
    const sample = el("a", "btn btn-outline btn-block", "خواندن نمونه");
    sample.href = "?view=reader&id=" + encodeURIComponent(book.id);
    card.append(sample);
  } else {
    const sample = el("button", "btn btn-outline btn-block", "خواندن نمونه");
    sample.type = "button";
    sample.disabled = true;
    sample.setAttribute("aria-describedby", "sample-note");
    const note = el("p", "sample-note", "نمونه‌ای برای این کتاب موجود نیست.");
    note.id = "sample-note";
    card.append(sample, note);
  }
  return card;
}

// بخش اصلی جزئیات: جلد، اطلاعات، کارت خرید
function createBookDetail(book) {
  const root = el("article", "book-detail");

  // جلد
  const coverBox = el("div", "detail-cover");
  const img = document.createElement("img");
  img.src = book.cover;
  img.alt = "جلد کتاب " + book.title;
  img.addEventListener("error", () => { img.hidden = true; });
  coverBox.append(img);

  // اطلاعات
  const info = el("div", "detail-info");
  const authorLine = el("p", "detail-meta");
  authorLine.append("نویسنده: ", el("strong", "", book.author));

  const categoryLine = el("p", "detail-meta");
  const categoryLink = el("a", "detail-category", book.category);
  categoryLink.href = catalogUrl({ category: book.category });
  categoryLine.append("دسته‌بندی: ", categoryLink);

  const rating = el("p", "detail-rating");
  rating.append(el("span", "star", "★"), " " + formatRating(book.rating) + " از ۵");

  info.append(
    el("h1", "detail-title", book.title),
    authorLine,
    categoryLine,
    rating,
    el("p", "detail-description", book.description)
  );

  root.append(coverBox, info, createBuyCard(book));
  return root;
}

// ===== نماها =====
function renderBookNotFound() {
  document.title = "کتاب یافت نشد | کتاب‌سرا";
  const box = el("div", "message-box");
  box.append(el("h1", "catalog-title", "کتاب یافت نشد"));
  box.append(el("p", "", "کتابی با این شناسه وجود ندارد."));
  const toCatalog = el("a", "btn btn-primary", "رفتن به فهرست کتاب‌ها");
  toCatalog.href = catalogUrl();
  const toHome = el("a", "btn btn-gray", "صفحه اصلی");
  toHome.href = "index.html";
  box.append(toCatalog, " ", toHome);
  document.getElementById("app").replaceChildren(box);
}

function renderBookDetail(params) {
  const id = params.get("id");
  const book = id ? getBookById(id) : null;
  if (!book) {
    renderBookNotFound();
    return;
  }

  document.title = book.title + " | کتاب‌سرا";
  const parts = [createBreadcrumb(book), createBookDetail(book)];

  const related = getRelatedBooks(book, 8);
  if (related.length > 0) {
    parts.push(createBookRow({
      title: "کتاب‌های مرتبط",
      subtitle: "بیشتر از دسته «" + book.category + "»",
      books: related,
      href: catalogUrl({ category: book.category })
    }));
  }
  document.getElementById("app").replaceChildren(...parts);
}