// نقطه شروع: ثبت نماها در روتر و اجرای نمای فعلی

registerRoute("home", () => { document.title = "کتاب‌سرا"; renderHome(); });
registerRoute("catalog", renderCatalog);
registerRoute("book", renderBookDetail);
["library", "reader", "login"].forEach((v) => registerRoute(v, renderComingSoon));
registerRoute("notFound", renderNotFound);

subscribeState(syncStateUi); // هر تغییر وضعیت، همه دکمه‌ها را هماهنگ می‌کند

renderRoute();