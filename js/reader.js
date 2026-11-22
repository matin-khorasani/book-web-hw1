// نمونه‌خوان: متن چندبندی کتاب + اندازه قلم و تم (ذخیره‌شده در State)

const FONT_SIZE_CHOICES = [
  { value: "small", label: "کوچک" },
  { value: "medium", label: "متوسط" },
  { value: "large", label: "بزرگ" }
];
const THEME_CHOICES = [
  { value: "light", label: "روشن" },
  { value: "dark", label: "تیره" }
];

// گروهی از دکمه‌ها برای انتخاب یک تنظیم؛ وضعیت با aria-pressed مشخص می‌شود
function createChoiceGroup(setting, label, choices) {
  const group = el("div", "reader-group");
  group.setAttribute("role", "group");
  group.setAttribute("aria-label", label);
  group.append(el("span", "reader-group-label", label + ":"));
  choices.forEach(({ value, label: text }) => {
    const button = el("button", "reader-btn", text);
    button.type = "button";
    button.dataset.setting = setting;
    button.dataset.value = value;
    button.addEventListener("click", () => updateReaderSettings({ [setting]: value }));
    group.append(button);
  });
  return group;
}

function createReaderToolbar(book) {
  const toolbar = el("div", "reader-toolbar");
  const exit = el("a", "reader-exit", "‹ بازگشت به جزئیات کتاب");
  exit.href = "?view=book&id=" + encodeURIComponent(book.id);
  toolbar.append(
    exit,
    createChoiceGroup("fontSize", "اندازه قلم", FONT_SIZE_CHOICES),
    createChoiceGroup("theme", "تم", THEME_CHOICES)
  );
  return toolbar;
}

function createReader(book) {
  const reader = el("article", "reader");
  const text = el("div", "reader-text");
  book.sample.forEach((paragraph) => text.append(el("p", "", paragraph)));

  reader.append(
    createReaderToolbar(book),
    el("h1", "reader-title", "نمونه کتاب «" + book.title + "»"),
    el("p", "reader-author", book.author),
    text
  );
  return reader;
}

// اعمال تنظیمات فعلی روی نمونه‌خوان و وضعیت دکمه‌ها (بدون ساخت دوباره صفحه)
function syncReaderSettings() {
  const reader = document.querySelector(".reader");
  if (!reader) return;
  const settings = getState().readerSettings;
  reader.dataset.fontSize = settings.fontSize;
  reader.dataset.theme = settings.theme;
  reader.querySelectorAll("[data-setting]").forEach((button) => {
    const active = settings[button.dataset.setting] === button.dataset.value;
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderReader(params) {
  const id = params.get("id");
  const book = id ? getBookById(id) : null;
  if (!book) {
    renderBookNotFound();
    return;
  }

  document.title = "نمونه: " + book.title + " | کتاب‌سرا";
  const app = document.getElementById("app");

  // کتاب بدون نمونه: پیام روشن و راه بازگشت
  if (book.sample.length === 0) {
    const box = el("div", "message-box");
    box.append(el("h1", "catalog-title", "نمونه‌ای موجود نیست"));
    box.append(el("p", "", "برای «" + book.title + "» نمونه متنی وجود ندارد."));
    const back = el("a", "btn btn-primary", "بازگشت به جزئیات کتاب");
    back.href = "?view=book&id=" + encodeURIComponent(book.id);
    box.append(back);
    app.replaceChildren(box);
    return;
  }

  app.replaceChildren(createReader(book));
  syncReaderSettings();
}