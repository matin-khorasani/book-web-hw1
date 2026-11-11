// داده کتاب‌ها: تنها منبع داده برنامه
// price به تومان (عدد). price === 0 یعنی رایگان
// rating عدد از ۵
// sample: آرایه‌ای از پاراگراف‌ها؛ آرایه خالی یعنی کتاب نمونه ندارد
// TODO: description و sample را با متن خودتان جایگزین کنید

const CATEGORIES = ["تاریخ", "داستان و رمان", "ادبیات"];

const PLACEHOLDER_DESCRIPTION = "توضیحات این کتاب به‌زودی اضافه می‌شود.";

const PLACEHOLDER_SAMPLE = [
  "این پاراگراف اول نمونه متن است و باید با متن خودتان جایگزین شود.",
  "این پاراگراف دوم نمونه متن است و باید با متن خودتان جایگزین شود.",
  "این پاراگراف سوم نمونه متن است و باید با متن خودتان جایگزین شود."
];

const BOOKS = [
  // ---- تاریخ ----
  {
    id: "book-01",
    title: "تاریخ بیهقی",
    author: "ابوالفضل بیهقی",
    category: "تاریخ",
    cover: "assets/images/covers/book-01.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 0,
    rating: 4.6,
    sample: []
  },
  {
    id: "book-02",
    title: "سفرنامه ناصرخسرو",
    author: "ناصرخسرو قبادیانی",
    category: "تاریخ",
    cover: "assets/images/covers/book-02.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 85000,
    rating: 4.2,
    sample: []
  },
  {
    id: "book-03",
    title: "تاریخ جهانگشای جوینی",
    author: "عطاملک جوینی",
    category: "تاریخ",
    cover: "assets/images/covers/book-03.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 150000,
    rating: 4.0,
    sample: []
  },
  {
    id: "book-04",
    title: "تاریخ سیستان",
    author: "نویسنده ناشناس",
    category: "تاریخ",
    cover: "assets/images/covers/book-04.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 110000,
    rating: 3.8,
    sample: []
  },

  // ---- داستان و رمان ----
  {
    id: "book-05",
    title: "بوف کور",
    author: "صادق هدایت",
    category: "داستان و رمان",
    cover: "assets/images/covers/book-05.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 0,
    rating: 4.5,
    sample: PLACEHOLDER_SAMPLE
  },
  {
    id: "book-06",
    title: "سگ ولگرد",
    author: "صادق هدایت",
    category: "داستان و رمان",
    cover: "assets/images/covers/book-06.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 70000,
    rating: 4.1,
    sample: []
  },
  {
    id: "book-07",
    title: "چشم‌هایش",
    author: "بزرگ علوی",
    category: "داستان و رمان",
    cover: "assets/images/covers/book-07.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 0,
    rating: 4.3,
    sample: []
  },
  {
    id: "book-08",
    title: "شازده احتجاب",
    author: "هوشنگ گلشیری",
    category: "داستان و رمان",
    cover: "assets/images/covers/book-08.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 120000,
    rating: 4.4,
    sample: []
  },

  // ---- ادبیات ----
  {
    id: "book-09",
    title: "گلستان سعدی",
    author: "سعدی شیرازی",
    category: "ادبیات",
    cover: "assets/images/covers/book-09.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 0,
    rating: 4.8,
    sample: PLACEHOLDER_SAMPLE
  },
  {
    id: "book-10",
    title: "دیوان حافظ",
    author: "حافظ شیرازی",
    category: "ادبیات",
    cover: "assets/images/covers/book-10.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 180000,
    rating: 4.9,
    sample: PLACEHOLDER_SAMPLE
  },
  {
    id: "book-11",
    title: "مثنوی معنوی",
    author: "مولانا جلال‌الدین بلخی",
    category: "ادبیات",
    cover: "assets/images/covers/book-11.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 250000,
    rating: 4.7,
    sample: []
  },
  {
    id: "book-12",
    title: "شاهنامه فردوسی",
    author: "ابوالقاسم فردوسی",
    category: "ادبیات",
    cover: "assets/images/covers/book-12.jpg",
    description: PLACEHOLDER_DESCRIPTION,
    price: 300000,
    rating: 4.9,
    sample: []
  }
];

// پیدا کردن کتاب با شناسه؛ اگر نبود null برمی‌گرداند
function getBookById(id) {
  return BOOKS.find((book) => book.id === id) || null;
}