// ورود نمایشی: اعتبارسنجی، فرم ورود، نمایش کاربر در سربرگ
// رمز عبور یا اطلاعات حساس دریافت نمی‌شود؛ فقط نام نمایشی و شماره موبایل.

// ===== منطق خالص =====
// نام خالی رد می‌شود؛ شماره باید دقیقاً ۱۱ رقم و با 09 شروع شود (ارقام فارسی و لاتین هر دو)
function validateLogin({ name, phone }) {
  const cleanName = name.trim();
  const cleanPhone = normalizeDigits(phone.trim());
  const errors = {};
  if (cleanName === "") errors.name = "نام نمایشی را وارد کنید.";
  if (!PHONE_PATTERN.test(cleanPhone)) {
    errors.phone = "شماره موبایل باید دقیقاً ۱۱ رقم باشد و با ۰۹ شروع شود.";
  }
  return { errors, values: { name: cleanName, phone: cleanPhone } };
}

// فقط آدرس‌های داخلی برنامه برای بازگشت بعد از ورود پذیرفته می‌شوند
function safeNextUrl(next) {
  const allowed = /^\?view=(catalog|book|library|reader)(&|$)/;
  return typeof next === "string" && allowed.test(next) ? next : "index.html";
}

// ===== فرم =====
function setFieldError(input, errorBox, message) {
  errorBox.textContent = message;
  if (message) input.setAttribute("aria-invalid", "true");
  else input.removeAttribute("aria-invalid");
}

// یک ورودی با برچسب و جای پیام خطا کنار خودش
function createField({ id, label, type, name, inputMode, autocomplete, placeholder, ltr }) {
  const wrapper = el("div", "form-field");
  const labelEl = el("label", "", label);
  labelEl.htmlFor = id;

  const input = document.createElement("input");
  input.id = id;
  input.name = name;
  input.type = type;
  if (inputMode) input.inputMode = inputMode;
  if (autocomplete) input.autocomplete = autocomplete;
  if (placeholder) input.placeholder = placeholder;
  if (ltr) input.dir = "ltr";
  input.setAttribute("aria-describedby", id + "-error");

  const errorBox = el("p", "field-error");
  errorBox.id = id + "-error";
  errorBox.setAttribute("role", "alert");

  // با شروع ویرایش، خطای همان ورودی پاک می‌شود
  input.addEventListener("input", () => setFieldError(input, errorBox, ""));

  wrapper.append(labelEl, input, errorBox);
  return { wrapper, input, errorBox };
}

function createLoginForm(nextUrl) {
  const form = el("form", "login-form");
  form.noValidate = true; // اعتبارسنجی را خودمان انجام می‌دهیم

  const nameField = createField({
    id: "login-name", label: "نام نمایشی", type: "text", name: "name", autocomplete: "name"
  });
  const phoneField = createField({
    id: "login-phone", label: "شماره موبایل", type: "tel", name: "phone",
    inputMode: "numeric", autocomplete: "tel", placeholder: "09123456789", ltr: true
  });

  const note = el("p", "form-note", "این ورود نمایشی است. رمز عبور یا اطلاعات حساس وارد نکنید.");
  const submit = el("button", "btn btn-primary btn-block", "ورود");
  submit.type = "submit";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { errors, values } = validateLogin({
      name: nameField.input.value,
      phone: phoneField.input.value
    });
    setFieldError(nameField.input, nameField.errorBox, errors.name || "");
    setFieldError(phoneField.input, phoneField.errorBox, errors.phone || "");

    if (errors.name) { nameField.input.focus(); return; }
    if (errors.phone) { phoneField.input.focus(); return; }

    if (setCurrentUser(values)) window.location.href = nextUrl;
  });

  form.append(nameField.wrapper, phoneField.wrapper, note, submit);
  return form;
}

// ===== نمای ورود =====
function renderLogin(params) {
  document.title = "ورود | کتاب‌سرا";
  const box = el("div", "login-box");
  box.append(el("h1", "catalog-title", "ورود به حساب"));

  const user = getState().currentUser;
  if (user) {
    box.append(el("p", "", "با نام «" + user.name + "» وارد شده‌اید."));
    const logoutButton = el("button", "btn btn-gray", "خروج");
    logoutButton.type = "button";
    logoutButton.addEventListener("click", () => { logout(); showStatus("از حساب خارج شدید."); });
    const home = el("a", "btn btn-primary", "صفحه اصلی");
    home.href = "index.html";
    box.append(home, " ", logoutButton);
  } else {
    box.append(createLoginForm(safeNextUrl(params.get("next"))));
  }
  document.getElementById("app").replaceChildren(box);
}

// ===== سربرگ: ورود یا نام کاربر + خروج =====
function renderAccount() {
  const area = document.getElementById("account-area");
  const user = getState().currentUser;

  if (!user) {
    const link = el("a", "btn btn-gray", "ورود به حساب کاربری");
    link.id = "account-link";
    link.href = "?view=login";
    area.replaceChildren(link);
    return;
  }

  const name = el("span", "account-name", "سلام، " + user.name);
  name.title = user.name;
  const logoutButton = el("button", "btn btn-gray", "خروج");
  logoutButton.type = "button";
  logoutButton.addEventListener("click", () => { logout(); showStatus("از حساب خارج شدید."); });
  area.replaceChildren(name, logoutButton);
}