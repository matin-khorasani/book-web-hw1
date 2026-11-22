// نقطه شروع: ثبت نماها در روتر و اجرای نمای فعلی

registerRoute("home", () => { document.title = "کتاب‌سرا"; renderHome(); });
registerRoute("catalog", renderCatalog);
registerRoute("book", renderBookDetail);
registerRoute("library", renderLibrary);
registerRoute("login", renderLogin);
registerRoute("reader", renderReader);
registerRoute("notFound", renderNotFound);

subscribeState(syncStateUi); // هر تغییر وضعیت، همه دکمه‌ها را هماهنگ می‌کند
subscribeState(syncReaderSettings); // اندازه قلم و تم نمونه‌خوان
subscribeState(() => {
  renderAccount();
  // کتابخانه و ورود به وضعیت وابسته‌اند: بدون پرش به بالا دوباره ساخته می‌شوند
  if (["library", "login"].includes(getRoute().view)) {
    refreshRoute();
    // اگر دکمه‌ای که فوکوس داشت حذف شد، فوکوس به عنوان بخش علاقه‌مندی‌ها می‌رود
    const heading = document.getElementById("favorites-title");
    if (heading && document.activeElement === document.body) heading.focus();
  }
});

renderAccount();
renderRoute();