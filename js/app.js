// نقطه شروع: ثبت نماها در روتر و اجرای نمای فعلی

registerRoute("home", () => { document.title = "کتاب‌سرا"; renderHome(); });
registerRoute("catalog", renderCatalog);
["book", "library", "reader", "login"].forEach((v) => registerRoute(v, renderComingSoon));
registerRoute("notFound", renderNotFound);

renderRoute();