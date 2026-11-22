// صفحه کتابخانه: کتاب‌های دریافت‌شده و علاقه‌مندی‌ها در دو بخش جدا

function createEmptyNote(text, link) {
  const box = el("div", "empty-note");
  box.append(el("p", "", text));
  const anchor = el("a", "btn btn-primary", link.text);
  anchor.href = link.href;
  box.append(anchor);
  return box;
}

// کتاب دریافت‌شده: کارت + باز کردن نمونه (یا توضیح اگر نمونه ندارد)
function createOwnedItem(book) {
  const item = el("div", "library-item");
  item.append(createBookCard(book));
  if (book.sample.length > 0) {
    const open = el("a", "btn btn-outline btn-block", "باز کردن");
    open.href = "?view=reader&id=" + encodeURIComponent(book.id);
    item.append(open);
  } else {
    const noteId = "owned-note-" + book.id;
    const open = el("button", "btn btn-outline btn-block", "باز کردن");
    open.type = "button";
    open.disabled = true;
    open.setAttribute("aria-describedby", noteId);
    const note = el("p", "sample-note", "نمونه‌ای برای این کتاب موجود نیست.");
    note.id = noteId;
    item.append(open, note);
  }
  return item;
}

// علاقه‌مندی: کارت + دکمه حذف (همان دکمه هماهنگ با State)
function createFavoriteItem(book) {
  const item = el("div", "library-item");
  item.append(createBookCard(book), createFavoriteButton(book, "detail"));
  return item;
}

function createLibrarySection({ headingId, title, books, createItem, emptyNote }) {
  const section = el("section", "library-section");
  section.setAttribute("aria-labelledby", headingId);

  const heading = el("h2", "", title);
  heading.id = headingId;
  heading.tabIndex = -1; // برای انتقال فوکوس بعد از حذف
  section.append(heading, el("p", "section-count", formatNumber(books.length) + " کتاب"));

  if (books.length === 0) {
    section.append(emptyNote);
  } else {
    const grid = el("div", "book-grid");
    books.forEach((book) => grid.append(createItem(book)));
    section.append(grid);
  }
  return section;
}

function renderLibrary() {
  document.title = "کتابخانه من | کتاب‌سرا";
  const state = getState();
  const owned = state.libraryBookIds.map(getBookById).filter(Boolean);
  const favorites = state.favoriteBookIds.map(getBookById).filter(Boolean);

  const ownedEmpty = isLoggedIn()
    ? createEmptyNote("هنوز کتابی دریافت نکرده‌اید.", { text: "رفتن به فهرست کتاب‌ها", href: catalogUrl() })
    : createEmptyNote("برای دریافت کتاب ابتدا وارد شوید.", { text: "ورود به حساب", href: "?view=login&next=" + encodeURIComponent("?view=library") });
  const favoritesEmpty = createEmptyNote("هنوز کتابی را علاقه‌مند نکرده‌اید.", { text: "دیدن کتاب‌ها", href: catalogUrl() });

  document.getElementById("app").replaceChildren(
    el("h1", "catalog-title", "کتابخانه من"),
    createLibrarySection({
      headingId: "owned-title", title: "کتاب‌های دریافت‌شده",
      books: owned, createItem: createOwnedItem, emptyNote: ownedEmpty
    }),
    createLibrarySection({
      headingId: "favorites-title", title: "علاقه‌مندی‌ها",
      books: favorites, createItem: createFavoriteItem, emptyNote: favoritesEmpty
    })
  );
}