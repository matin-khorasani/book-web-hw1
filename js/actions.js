// اجزای تعاملی وابسته به State: دکمه علاقه‌مندی، دکمه دریافت/خرید، پیام وضعیت، پنجره تأیید خرید
// منطق تغییر وضعیت در state.js است؛ اینجا فقط رابط و پیام‌ها هستند.

// ===== پیام وضعیت (برای صفحه‌خوان هم خوانده می‌شود) =====
let statusTimer = null;

function showStatus(message, link) {
  const box = document.getElementById("status");
  box.replaceChildren(message);
  if (link) {
    const anchor = el("a", "", link.text);
    anchor.href = link.href;
    box.append(" ", anchor);
  }
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => box.replaceChildren(), 8000);
}

// لینک ورود که بعد از ورود به همین صفحه برمی‌گردد
function loginLink() {
  const here = window.location.search;
  const next = here ? "&next=" + encodeURIComponent(here) : "";
  return { text: "ورود به حساب", href: "?view=login" + next };
}

// ===== علاقه‌مندی =====
// variant: "card" (آیکون روی کارت) یا "detail" (دکمه متنی در صفحه جزئیات)
function createFavoriteButton(book, variant) {
  const button = el("button", variant === "card" ? "fav-btn" : "btn btn-outline btn-block");
  button.type = "button";
  button.dataset.favoriteId = book.id;
  button.dataset.variant = variant;
  button.addEventListener("click", () => {
    const nowFavorite = toggleFavorite(book.id);
    showStatus(nowFavorite
      ? "«" + book.title + "» به علاقه‌مندی‌ها اضافه شد."
      : "«" + book.title + "» از علاقه‌مندی‌ها حذف شد.");
  });
  updateFavoriteButton(button);
  return button;
}

function updateFavoriteButton(button) {
  const book = getBookById(button.dataset.favoriteId);
  const favorite = isFavorite(button.dataset.favoriteId);
  button.classList.toggle("is-favorite", favorite);
  if (button.dataset.variant === "card") {
    button.textContent = favorite ? "♥" : "♡";
    button.setAttribute("aria-label", (favorite ? "حذف از علاقه‌مندی‌ها: " : "افزودن به علاقه‌مندی‌ها: ") + book.title);
  } else {
    button.textContent = favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها";
  }
}

// ===== دریافت / خرید =====
function createAcquireButton(book) {
  const button = el("button", "btn btn-primary btn-block");
  button.type = "button";
  button.dataset.acquireId = book.id;
  button.addEventListener("click", () => handleAcquire(book.id, button));
  updateAcquireButton(button);
  return button;
}

function updateAcquireButton(button) {
  const book = getBookById(button.dataset.acquireId);
  if (isInLibrary(book.id)) button.textContent = "مشاهده در کتابخانه";
  else button.textContent = book.price === 0 ? "دریافت رایگان کتاب" : "خرید کتاب";
}

function handleAcquire(bookId, opener) {
  const book = getBookById(bookId);
  if (isInLibrary(bookId)) {
    window.location.href = "?view=library"; // کتاب دریافت‌شده: رفتن به کتابخانه
    return;
  }
  if (!isLoggedIn()) {
    showStatus("برای دریافت کتاب ابتدا وارد شوید.", loginLink());
    return;
  }
  if (book.price === 0) completeAcquire(book);
  else openPurchaseDialog(book, opener);
}

// اضافه کردن به کتابخانه و پیام مناسب هر نتیجه
function completeAcquire(book) {
  const result = addToLibrary(book.id);
  if (result === "added") {
    showStatus("«" + book.title + "» به کتابخانه شما اضافه شد.", { text: "مشاهده کتابخانه", href: "?view=library" });
  } else if (result === "already-owned") {
    showStatus("این کتاب از قبل در کتابخانه شماست.");
  } else if (result === "not-logged-in") {
    showStatus("برای دریافت کتاب ابتدا وارد شوید.", loginLink());
  }
}

// پنجره تأیید خرید نمایشی؛ Escape آن را می‌بندد و فوکوس به دکمه بازکننده برمی‌گردد
function openPurchaseDialog(book, opener) {
  const dialog = el("dialog", "purchase-dialog");
  dialog.setAttribute("aria-labelledby", "purchase-title");

  const title = el("h2", "", "تأیید خرید");
  title.id = "purchase-title";
  const text = el("p", "", "خرید «" + book.title + "» به مبلغ " + formatNumber(book.price) + " تومان؟");
  const note = el("p", "purchase-note", "این خرید فقط نمایشی است و هیچ پرداخت واقعی انجام نمی‌شود.");

  const confirm = el("button", "btn btn-primary", "تأیید خرید");
  confirm.type = "button";
  const cancel = el("button", "btn btn-gray", "انصراف");
  cancel.type = "button";
  const actions = el("div", "dialog-actions");
  actions.append(confirm, cancel);

  confirm.addEventListener("click", () => {
    dialog.close();
    completeAcquire(book);
  });
  cancel.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    dialog.remove();
    opener.focus();
  });

  dialog.append(title, text, note, actions);
  document.body.append(dialog);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  cancel.focus();
}

// ===== هماهنگی همه دکمه‌ها با State =====
// بعد از هر تغییر وضعیت صدا زده می‌شود (در app.js ثبت شده)
function syncStateUi() {
  document.querySelectorAll("[data-favorite-id]").forEach(updateFavoriteButton);
  document.querySelectorAll("[data-acquire-id]").forEach(updateAcquireButton);
}