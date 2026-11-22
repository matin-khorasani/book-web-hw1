// خواندن و نوشتن امن localStorage
// هیچ تابعی خطا پرت نمی‌کند: اگر مرورگر دسترسی ندهد یا داده خراب باشد، برنامه با حافظه معمولی کار می‌کند.

const STORAGE_KEY = "ketabsara:state:v1";

// داده ذخیره‌شده را برمی‌گرداند؛ اگر نبود یا خراب بود null
function loadStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

// ذخیره وضعیت؛ موفقیت را true/false برمی‌گرداند
function saveStoredState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    return false;
  }
}

function clearStoredState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // نادیده گرفته می‌شود
  }
}