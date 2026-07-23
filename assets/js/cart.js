/*
  باطنو (Batenno) — shared cart logic
  از localStorage برای نگه‌داشتن سبد خرید بین صفحات مختلف سایت استفاده می‌کنه.
*/
(function (window) {
  'use strict';

  var CART_KEY = 'batenno_cart_v1';

  // کاتالوگ محصولات فروشگاه (باید با کارت‌های shop.html هماهنگ باشه)
// کاتالوگ محصولات فروشگاه (هماهنگ شده با کارت‌های shop.html)
  var PRODUCTS = {
    p1: {
      name: 'سیب گلاب باغی', category: 'میوه', price: 95000, oldPrice: null, emoji: '🍎',
      image: './assets/images/products/apple.png',
      weight: '۱ کیلوگرم', rating: 4, reviews: 124, badge: null,
      description: 'سیب‌های گلابی باغی که فقط به‌خاطر لکه‌های طبیعی روی پوست یا شکل نامتعارف، اجازه‌ی ورود به بازار سنتی رو پیدا نکردن؛ از نظر شیرینی، آبداری و ارزش غذایی هیچ فرقی با سیب درجه‌یک ندارن. مستقیم از باغدار خریداری، کنترل کیفیت و بسته‌بندی شدن.'
    },
    p2: {
      name: 'هویج ارگانیک', category: 'سبزیجات', price: 42000, oldPrice: null, emoji: '🥕',
      image: './assets/images/products/carrot.jpg',
      weight: '۱ کیلوگرم', rating: 5, reviews: 89, badge: null,
      description: 'هویج ارگانیک با کمی انحنا یا دوشاخگی طبیعی که ظاهرش رو از استاندارد یکنواخت بازار خارج کرده، ولی طعم و مواد مغذی‌ش دست‌نخورده مونده. مناسب آبمیوه‌گیری، خورش و سالاد.'
    },
    p3: {
      name: 'پرتقال تامسون شمال', category: 'مرکبات', price: 102000, oldPrice: 120000, emoji: '🍊',
      image: './assets/images/products/orange.png',
      weight: '۱ کیلوگرم', rating: 4, reviews: 203, badge: '۱۵٪ ارزان‌تر',
      description: 'پرتقال تامسون شمال، آبدار و پرویتامین C، که به دلیل پوست کمی نامنظم یا لکه‌های سطحی از چرخه فروش سنتی کنار گذاشته شده. باطن کاملاً سالم و کنترل‌کیفیت‌شده.'
    },
    p4: {
      name: 'سبد نیمه‌سفارشی خانواده', category: 'سبد ترکیبی', price: 149000, oldPrice: null, emoji: '🧺',
      image: null,
      weight: 'حدود ۵ کیلوگرم میوه و سبزی متنوع', rating: 5, reviews: 67, badge: null,
      description: 'سبدی از میوه و سبزیجات فصل که می‌تونی محتوای اقلامش رو تا حدی مطابق سلیقه خانواده‌ت قبل از ارسال تغییر بدی. گزینه‌ی اقتصادی برای خانواده‌هایی که دنبال کاهش هزینه سبد غذایی هستن.'
    },
    p5: {
      name: 'موز وارداتی', category: 'میوه', price: 115000, oldPrice: null, emoji: '🍌',
      image: './assets/images/products/banana.webp',
      weight: '۱ کیلوگرم', rating: 4, reviews: 158, badge: null,
      description: 'موز وارداتی که به دلیل رسیدگی زودتر از موعد یا لکه‌های طبیعی پوست، تخفیف قابل‌توجهی خورده؛ مصرف سریع پیشنهاد می‌شه.'
    },
    p6: {
      name: 'گوجه‌فرنگی گلخانه‌ای', category: 'سبزیجات', price: 45000, oldPrice: null, emoji: '🍅',
      image: './assets/images/products/tomato.png',
      weight: '۱ کیلوگرم', rating: 4, reviews: 96, badge: null,
      description: 'گوجه‌فرنگی گلخانه‌ای با شکل نامنظم یا ترک سطحی خفیف، مناسب برای رب، سس و پخت‌وپز روزمره.'
    },
    p7: {
      name: 'توت‌فرنگی باغی', category: 'میوه', price: 184000, oldPrice: null, emoji: '🍓',
      image: './assets/images/products/strawberry.webp',
      weight: '۱ کیلوگرم', rating: 5, reviews: 141, badge: null,
      description: 'توت‌فرنگی باغی، شیرین و معطر، با شکل و اندازه‌ی نامتعارف که هیچ تاثیری روی طعم و کیفیتش نداره.'
    },
    p8: {
      name: 'سبد سبزیجات هفتگی', category: 'سبد ترکیبی', price: 98000, oldPrice: null, emoji: '🥦',
      image: './assets/images/products/veg-basket.jpeg',
      weight: 'حدود ۴ کیلوگرم سبزیجات متنوع', rating: 5, reviews: 219, badge: 'پرفروش',
      description: 'ترکیبی هفتگی از سبزیجات فصل با ظاهر نامتعارف اما کاملاً سالم؛ گزینه‌ای مقرون‌به‌صرفه برای تامین سبزی موردنیاز آشپزخانه.'
    }
  };

  var CUSTOM_KEY = 'batenno_custom_products_v1';

  // سبدهای نیمه‌سفارشی که کاربر خودش می‌سازه، این‌جا نگه‌داری می‌شن
  // تا وقتی صفحه عوض شد (مثلاً از سازنده‌ی سبد به صفحه‌ی سبد خرید) اطلاعاتشون از دست نره.
  function loadCustomProducts() {
    try {
      var raw = window.localStorage.getItem(CUSTOM_KEY);
      var custom = raw ? JSON.parse(raw) : {};
      Object.keys(custom).forEach(function (id) { PRODUCTS[id] = custom[id]; });
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
  }

  function registerCustomProduct(product) {
    var id = 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    PRODUCTS[id] = product;
    try {
      var raw = window.localStorage.getItem(CUSTOM_KEY);
      var custom = raw ? JSON.parse(raw) : {};
      custom[id] = product;
      window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    return id;
  }

  var FA_DIGITS = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };

  function toFa(n) {
    return String(n).replace(/[0-9]/g, function (d) { return FA_DIGITS[d]; });
  }

  function formatToman(n) {
    var withCommas = Math.round(n).toLocaleString('en-US');
    return toFa(withCommas) + ' تومان';
  }

  function getCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveCart(cart) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    updateBadge();
    window.dispatchEvent(new CustomEvent('batenno:cart-updated', { detail: cart }));
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    if (!PRODUCTS[id]) return getCart();
    var cart = getCart();
    cart[id] = (cart[id] || 0) + qty;
    saveCart(cart);
    return cart;
  }

  function setQty(id, qty) {
    var cart = getCart();
    qty = Math.max(0, Math.min(20, qty));
    if (qty <= 0) { delete cart[id]; } else { cart[id] = qty; }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id) {
    var cart = getCart();
    delete cart[id];
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart({});
  }

  function cartCount() {
    var cart = getCart();
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  function cartSubtotal() {
    var cart = getCart();
    return Object.keys(cart).reduce(function (sum, id) {
      var p = PRODUCTS[id];
      return p ? sum + p.price * cart[id] : sum;
    }, 0);
  }

  function updateBadge() {
    var badges = document.querySelectorAll('[data-cart-badge]');
    var count = cartCount();
    badges.forEach(function (badge) {
      badge.textContent = count > 99 ? '۹۹+' : toFa(count);
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  // ---------------------------------------------------------------------
  // احراز هویت ساده (فقط سمت کلاینت، صرفاً برای دموی رابط کاربری)
  // اطلاعات کاربر در localStorage نگه‌داشته می‌شه تا وضعیت ورود بین صفحات حفظ بشه.
  // ---------------------------------------------------------------------
  var USER_KEY = 'batenno_user_v1';

  function getUser() {
    try {
      var raw = window.localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    updateAuthUI();
  }

  function logout() {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    updateAuthUI();
  }

  // اگه صفحه یک اسلات با data-auth-slot داشته باشه، این تابع بسته به
  // وضعیت لاگین، دکمه‌ی «ورود / ثبت‌نام» یا نام کاربر (لینک به پروفایل) رو نشون می‌ده.
  function updateAuthUI() {
    var user = getUser();
    var slots = document.querySelectorAll('[data-auth-slot]');
    slots.forEach(function (slot) {
      if (user) {
        slot.innerHTML =
          '<a href="./profile.html" class="d-inline-flex align-items-center gap-2 text-decoration-none">' +
          '<span class="rounded-circle d-inline-flex align-items-center justify-content-center" ' +
          'style="width:38px;height:38px;background: rgba(15,81,50,0.10); color: var(--batenno-primary-dark);">' +
          '<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10m0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5"/></svg>' +
          '</span>' +
          '<span class="fw-semibold small text-dark">' + user.name + '</span>' +
          '</a>';
      } else {
        slot.innerHTML = '<a href="./auth.html" class="btn btn-primary">ورود / ثبت‌نام</a>';
      }
    });
  }

  // ---------------------------------------------------------------------
  // تاریخچه‌ی سفارش‌ها (فقط سمت کلاینت). عکسِ رسید پرداخت خودش این‌جا ذخیره
  // نمی‌شه؛ فقط اسم فایل ثبت می‌شه — دلیلش رو توی پیام همراهِ این تغییر توضیح دادم.
  // ---------------------------------------------------------------------
  var ORDERS_KEY = 'batenno_orders_v1';

  function getOrders() {
    try {
      var raw = window.localStorage.getItem(ORDERS_KEY);
      var orders = raw ? JSON.parse(raw) : [];
      return orders.sort(function (a, b) { return b.createdAt - a.createdAt; });
    } catch (e) {
      return [];
    }
  }

  function addOrder(order) {
    var orders = [];
    try {
      var raw = window.localStorage.getItem(ORDERS_KEY);
      orders = raw ? JSON.parse(raw) : [];
    } catch (e) { orders = []; }
    orders.push(order);
    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    return order;
  }

  // ---------------------------------------------------------------------
  // اشتراک میوه (فقط سمت کلاینت) — وضعیت پلن کاربر (فعال/مکث/لغو)
  // ---------------------------------------------------------------------
  var SUB_KEY = 'batenno_subscription_v1';

  function getSubscription() {
    try {
      var raw = window.localStorage.getItem(SUB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    // مقدار پیش‌فرض دمو: یک پلن فعال
    return { planName: 'پلن هفتگی خانواده', nextDelivery: 'چهارشنبه، ۱۴۰۵/۰۵/۰۷', status: 'active' };
  }

  function setSubscription(patch) {
    var current = getSubscription();
    var updated = Object.assign({}, current, patch);
    try {
      window.localStorage.setItem(SUB_KEY, JSON.stringify(updated));
    } catch (e) { /* حالت خصوصی مرورگر یا ذخیره‌سازی غیرفعال */ }
    return updated;
  }

  loadCustomProducts();
  document.addEventListener('DOMContentLoaded', function () {
    updateBadge();
    updateAuthUI();
  });

  window.Batenno = {
    PRODUCTS: PRODUCTS,
    toFa: toFa,
    formatToman: formatToman,
    getCart: getCart,
    addToCart: addToCart,
    setQty: setQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    cartCount: cartCount,
    cartSubtotal: cartSubtotal,
    updateBadge: updateBadge,
    registerCustomProduct: registerCustomProduct,
    getUser: getUser,
    setUser: setUser,
    logout: logout,
    updateAuthUI: updateAuthUI,
    getOrders: getOrders,
    addOrder: addOrder,
    getSubscription: getSubscription,
    setSubscription: setSubscription
  };
})(window);