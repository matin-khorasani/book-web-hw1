// روتر ساده بر پایه آدرس: ?view=نام_نما&...
// هر نما یک تابع رندر دارد که با registerRoute ثبت می‌شود.

const ROUTES = {};

function registerRoute(view, handler) {
  ROUTES[view] = handler;
}

// نما و پارامترهای آدرس فعلی؛ بدون view یعنی صفحه اصلی
function getRoute() {
  const params = new URLSearchParams(window.location.search);
  return { view: params.get("view") || "home", params };
}

// نمای فعلی را رندر می‌کند؛ نمای ناشناخته به صفحه «یافت نشد» می‌رود
function renderRoute() {
  const { view, params } = getRoute();
  const handler = ROUTES[view] || ROUTES.notFound;
  handler(params);
  window.scrollTo(0, 0);
}

// نمای فعلی را دوباره می‌سازد، بدون پرش به بالای صفحه (برای به‌روزرسانی بعد از تغییر State)
function refreshRoute() {
  const { view, params } = getRoute();
  const handler = ROUTES[view] || ROUTES.notFound;
  handler(params);
}