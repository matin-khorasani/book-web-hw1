// وضعیت برنامه: تنها جایی که علاقه‌مندی‌ها، کتابخانه، کاربر و تنظیمات مطالعه تغییر می‌کنند.
// رابط فقط از توابع این فایل استفاده می‌کند و بعد از هر تغییر، ذخیره و اطلاع‌رسانی خودکار است.

const FONT_SIZES = ["small", "medium", "large"];
const THEMES = ["light", "dark"];
const PHONE_PATTERN = /^09\d{9}$/; // شماره با ارقام لاتین (نرمال‌سازی در فرم ورود انجام می‌شود)

function createDefaultState() {
  return {
    favoriteBookIds: [],
    libraryBookIds: [],
    currentUser: null, // یا { name, phone }
    readerSettings: { fontSize: "medium", theme: "light" }
  };
}

// ===== اعتبارسنجی داده ذخیره‌شده (هر فیلد جدا؛ فیلد خراب به مقدار امن برمی‌گردد) =====
function sanitizeIdList(value) {
  if (!Array.isArray(value)) return [];
  const result = [];
  value.forEach((id) => {
    if (typeof id === "string" && getBookById(id) && !result.includes(id)) result.push(id);
  });
  return result;
}

function sanitizeUser(value) {
  if (!value || typeof value !== "object") return null;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone : "";
  return name !== "" && PHONE_PATTERN.test(phone) ? { name, phone } : null;
}

function sanitizeReaderSettings(value) {
  const defaults = createDefaultState().readerSettings;
  const source = value && typeof value === "object" ? value : {};
  return {
    fontSize: FONT_SIZES.includes(source.fontSize) ? source.fontSize : defaults.fontSize,
    theme: THEMES.includes(source.theme) ? source.theme : defaults.theme
  };
}

function sanitizeState(raw) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  return {
    favoriteBookIds: sanitizeIdList(source.favoriteBookIds),
    libraryBookIds: sanitizeIdList(source.libraryBookIds),
    currentUser: sanitizeUser(source.currentUser),
    readerSettings: sanitizeReaderSettings(source.readerSettings)
  };
}

// ===== وضعیت فعلی و اطلاع‌رسانی =====
let appState = sanitizeState(loadStoredState());
const stateListeners = [];

function getState() {
  return appState;
}

// نماها با subscribeState ثبت می‌شوند تا بعد از هر تغییر به‌روز شوند
function subscribeState(listener) {
  stateListeners.push(listener);
}

function notifyState() {
  stateListeners.forEach((listener) => listener(appState));
}

// ذخیره در localStorage + اطلاع‌رسانی
function commitState() {
  saveStoredState(appState);
  notifyState();
}

// ===== پرسش‌ها =====
function isFavorite(bookId) {
  return appState.favoriteBookIds.includes(bookId);
}

function isInLibrary(bookId) {
  return appState.libraryBookIds.includes(bookId);
}

function isLoggedIn() {
  return appState.currentUser !== null;
}

// ===== تغییرها =====
// افزودن/حذف علاقه‌مندی؛ وضعیت جدید (true = علاقه‌مند) را برمی‌گرداند
function toggleFavorite(bookId) {
  if (!getBookById(bookId)) return false;
  const list = appState.favoriteBookIds;
  const index = list.indexOf(bookId);
  if (index === -1) list.push(bookId);
  else list.splice(index, 1);
  commitState();
  return index === -1;
}

// دریافت رایگان یا خرید نمایشی. نتیجه یکی از این‌هاست:
// "added" | "already-owned" | "not-logged-in" | "unknown-book"
function addToLibrary(bookId) {
  if (!getBookById(bookId)) return "unknown-book";
  if (!isLoggedIn()) return "not-logged-in";
  if (isInLibrary(bookId)) return "already-owned";
  appState.libraryBookIds.push(bookId);
  commitState();
  return "added";
}

// ورود نمایشی؛ اگر نام یا شماره معتبر نبود false
function setCurrentUser(user) {
  const clean = sanitizeUser(user);
  if (!clean) return false;
  appState.currentUser = clean;
  commitState();
  return true;
}

// خروج: فقط کاربر پاک می‌شود، کتابخانه و علاقه‌مندی‌ها می‌مانند
function logout() {
  appState.currentUser = null;
  commitState();
}

// تغییر تنظیمات مطالعه؛ مثلاً updateReaderSettings({ theme: "dark" })
function updateReaderSettings(changes) {
  appState.readerSettings = sanitizeReaderSettings({ ...appState.readerSettings, ...changes });
  commitState();
}

// پاک کردن همه وضعیت ذخیره‌شده و برگشت به حالت اولیه
function resetState() {
  clearStoredState();
  appState = createDefaultState();
  notifyState();
}