const tg = Telegram.WebApp;
tg.ready();
tg.expand();

// Set theme colors
tg.setHeaderColor("#000000");
tg.setBackgroundColor("#000000");

/* ===== CONFIG ===== */
const RATE = 1.84; // Fixed conversion rate

/* ===== CATEGORIES ===== */
const CATEGORIES = [
  { id: "all", title: "Всё меню" },
  { id: "desserts", title: "Десерты" },
  { id: "tea_chocolate", title: "Чай и шоколад" },
  { id: "frappe", title: "Фраппе" },
  { id: "classic_coffee", title: "Классический кофе" },
  { id: "bakery", title: "Выпечка" },
  { id: "combo", title: "Комбо" }
];

/* ===== PRODUCTS (by category) ===== */
function mk(id, name, priceRub, img, desc, category) {
  return { id, name, desc: desc || "", stars: Math.round(priceRub * RATE), img, category };
}

const PRODUCTS = [
  // Desserts
  mk("brownie_pecan_caramel", "Брауни с пеканом и карамелью", 380, "brownie_pecan_caramel.png", "100 г", "desserts"),
  mk("carrot_cake", "Морковный торт", 395, "carrot_cake.png", "115 г", "desserts"),
  mk("bouchee_cinnamon_chocolate", "Буше с корицей и шоколадом", 380, "bouchee_cinnamon_chocolate.png", "110 г", "desserts"),
  mk("cheesecake_raspberry", "Чизкейк Малиновый", 395, "cheesecake_raspberry.png", "145 г", "desserts"),
  // Tea and Chocolate
  mk("hot_chocolate", "Горячий шоколад", 385, "hot_chocolate.png", "350 мл • Охлаждённый", "tea_chocolate"),
  mk("green_tea_jasmine_mango", "Зелёный чай Жасмин Манго", 345, "green_tea_jasmine_mango.png", "350 мл", "tea_chocolate"),
  mk("matcha_latte", "Маття Чай Латте", 395, "matcha_latte.png", "350 мл • Охлаждённый", "tea_chocolate"),
  mk("mint_tea_raspberry_passion_fruit", "Мятный чай Малина Маракуйя", 345, "mint_tea_raspberry_passion_fruit.png", "350 мл", "tea_chocolate"),
  // Frappe
  mk("vanilla_frappe", "Ванильный фраппе", 405, "vanilla_frappe.png", "350 мл", "frappe"),
  mk("classic_frappe", "Классический фраппе", 415, "classic_frappe.png", "350 мл", "frappe"),
  mk("matcha_frappe", "Маття фраппе", 415, "matcha_frappe.png", "350 мл", "frappe"),
  mk("mocha_frappe", "Мокка фраппе", 425, "mocha_frappe.png", "350 мл", "frappe"),
  mk("white_chocolate_mocha_frappe", "Фраппе Белый шоколад Мокка", 425, "white_chocolate_mocha_frappe.png", "350 мл", "frappe"),
  mk("juicy_raspberry_frappe", "Малиновый фраппе", 425, "juicy_raspberry_frappe.png", "350 мл", "frappe"),
  mk("chocolate_frappe", "Шоколадный фраппе", 405, "chocolate_frappe.png", "350 мл", "frappe"),
  // Classic Coffee Drinks
  mk("golden_macchiato", "Голден макиато", 420, "golden_macchiato.png", "350 мл", "classic_coffee"),
  mk("classic_cappuccino", "Классический капучино", 380, "classic_cappuccino.png", "300 мл", "classic_coffee"),
  mk("lungo", "Лунго", 335, "lungo.png", "150 мл", "classic_coffee"),
  mk("mocha", "Мокка", 410, "mocha.png", "350 мл", "classic_coffee"),
  mk("white_chocolate_mocha", "Мокка белый шоколад", 410, "white_chocolate_mocha.png", "350 мл", "classic_coffee"),
  mk("vanilla_raf", "Ванильный раф", 435, "vanilla_raf.png", "350 мл", "classic_coffee"),
  mk("classic_raf", "Классический раф", 425, "classic_raf.png", "350 мл", "classic_coffee"),
  mk("flat_white", "Флэт уайт", 405, "flat_white.png", "350 мл", "classic_coffee"),
  // Bakery
  mk("belgian_waffle", "Бельгийская вафля", 290, "belgian_waffle.png", "Нежное лакомство", "bakery"),
  mk("pretzel", "Брецель с солёным маслом", 420, "pretzel.png", "Только натуральные ингредиенты", "bakery"),
  mk("croissant_almond", "Круассан Миндальный", 320, "croissant_almond.png", "Классический круассан", "bakery"),
  // Combo
  mk("combo_breakfast", "Комбо завтрак", 730, "combo_breakfast.png", "Начните свой день", "combo")
];

/* ===== CART MANAGEMENT ===== */
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  cart.push(product);
  saveCart();
  updateCartBadge();
  showNotification("✓ Добавлено в корзину");
}

function removeFromCart(index) {
  const item = cart[index];
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
  showNotification(`Удалено: ${item.name}`);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.stars, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (cart.length > 0) {
    badge.textContent = cart.length > 99 ? "99+" : cart.length;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }
}

/* ===== NOTIFICATIONS ===== */
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/* ===== CATEGORY FILTER ===== */
let currentCategory = "all";

function setCategory(categoryId) {
  currentCategory = categoryId;
  const btns = document.querySelectorAll(".category-btn");
  btns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-category") === categoryId);
  });
  renderProducts();
}

function renderCategoryButtons() {
  const container = document.getElementById("category-buttons");
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="category-btn ${cat.id === "all" ? "active" : ""}" data-category="${cat.id}">${cat.title}</button>
  `).join("");
  container.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => setCategory(btn.getAttribute("data-category")));
  });
}

/* ===== SEARCH ===== */
function getSearchQuery() {
  const input = document.getElementById("search-input");
  return input ? input.value.trim().toLowerCase() : "";
}

function getFilteredProducts() {
  const query = getSearchQuery();
  let list = PRODUCTS;
  if (currentCategory !== "all") {
    list = list.filter(p => p.category === currentCategory);
  }
  if (query) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(query) ||
      (p.desc && p.desc.toLowerCase().includes(query))
    );
  }
  return list;
}

function renderProducts(productsToShow) {
  const productList = document.getElementById("product-list");
  const noResults = document.getElementById("search-no-results");
  productList.innerHTML = "";

  const list = productsToShow != null ? productsToShow : getFilteredProducts();

  if (list.length === 0) {
    productList.style.display = "none";
    if (noResults) noResults.style.display = "block";
    return;
  }

  if (noResults) noResults.style.display = "none";
  productList.style.display = "grid";

  list.forEach((p, index) => {
    const el = document.createElement("div");
    el.className = "card";
    el.style.animationDelay = `${index * 0.05}s`;
    el.innerHTML = `
      <div class="card-image-wrapper">
        <img src="images/${p.img}" alt="${p.name}" loading="lazy">
        <div class="card-overlay"></div>
      </div>
      <div class="card-content">
        <h3>${p.name}</h3>
        <div class="price">${p.stars} ⭐</div>
        <div class="actions">
          <button class="glass add" data-product-id="${p.id}">В корзину</button>
          <button class="primary buy" data-product-id="${p.id}">Купить</button>
        </div>
      </div>
    `;

    el.querySelector(".add").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p);
      // Visual feedback
      const btn = el.querySelector(".add");
      const originalText = btn.textContent;
      btn.textContent = "✓ Добавлено";
      btn.classList.add("success");
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove("success");
      }, 1500);
    });

    el.querySelector(".buy").addEventListener("click", (e) => {
      e.stopPropagation();
      renderPayPage([p.id]);
      switchPage("page-pay");
    });

    productList.appendChild(el);
  });
}

/* ===== RENDER CART ===== */
function renderCart() {
  const cartList = document.getElementById("cart-list");
  const cartTotal = document.getElementById("cart-total");
  const cartTotalPrice = document.getElementById("cart-total-price");
  const payCartButton = document.getElementById("pay-cart-button");
  const cartEmpty = document.getElementById("cart-empty");

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartTotal.style.display = "none";
    payCartButton.style.display = "none";
    cartEmpty.style.display = "block";
    return;
  }

  cartEmpty.style.display = "none";
  cartTotal.style.display = "flex";
  payCartButton.style.display = "block";

  cart.forEach((item, index) => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.style.animationDelay = `${index * 0.05}s`;
    el.innerHTML = `
      <div class="cart-item-image">
        <img src="images/${item.img}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.stars} ⭐</div>
      </div>
      <button class="cart-remove" data-index="${index}" aria-label="Удалить">×</button>
    `;

    el.querySelector(".cart-remove").addEventListener("click", () => {
      removeFromCart(index);
    });

    cartList.appendChild(el);
  });

  const total = getCartTotal();
  cartTotalPrice.textContent = total;
  cartTotalPrice.innerHTML = `${total} ⭐`;

  payCartButton.onclick = () => {
    renderPayPage(cart.map(item => item.id));
    switchPage("page-pay");
  };
}

/* ===== RENDER PAY PAGE ===== */
function renderPayPage(items) {
  const payItems = document.getElementById("pay-items");
  const payTotalAmount = document.getElementById("pay-total-amount");
  const payButtonStars = document.getElementById("pay-button-stars");

  payItems.innerHTML = "";

  let total = 0;
  items.forEach((itemId, index) => {
    const product = PRODUCTS.find(p => p.id === itemId);
    if (product) {
      total += product.stars;
      const el = document.createElement("div");
      el.className = "pay-item";
      el.style.animationDelay = `${index * 0.05}s`;
      el.innerHTML = `
        <div class="pay-item-info">
          <span class="pay-item-name">${product.name}</span>
        </div>
        <span class="pay-item-price">${product.stars} ⭐</span>
      `;
      payItems.appendChild(el);
    }
  });

  payTotalAmount.textContent = total;
  payButtonStars.textContent = total;

  // Remove old event listeners and add new one
  const payButton = document.getElementById("pay-button");
  const newPayButton = payButton.cloneNode(true);
  payButton.parentNode.replaceChild(newPayButton, payButton);
  
  newPayButton.onclick = () => {
    startPayment(items, total);
  };
}

/* ===== PAYMENT ===== */
function startPayment(items, total) {
  // Validate
  if (!items || items.length === 0) {
    showNotification("❌ Ошибка: пустой заказ");
    return;
  }
  
  if (total <= 0) {
    showNotification("❌ Ошибка: неверная сумма");
    return;
  }
  
  // Show loading state
  const payButton = document.getElementById("pay-button");
  const originalContent = payButton.innerHTML;
  payButton.disabled = true;
  payButton.innerHTML = '<span>Обработка...</span>';
  
  try {
    // Send data to bot
    tg.sendData(JSON.stringify({
      type: "stars_payment",
      items: items,
      total: total
    }));
    
    showNotification("💳 Создание платежа...");
    
    // Reset button after a delay (in case of error)
    setTimeout(() => {
      if (payButton.disabled) {
        payButton.disabled = false;
        payButton.innerHTML = originalContent;
      }
    }, 5000);
    
    // The bot will create an invoice, and Telegram will handle the payment flow
    // After payment, the bot will send a message with QR code to the chat
    // User can check the chat for the QR code
    
  } catch (error) {
    console.error("Payment error:", error);
    showNotification("❌ Ошибка при создании платежа");
    payButton.disabled = false;
    payButton.innerHTML = originalContent;
  }
}

/* ===== QR DISPLAY ===== */
function showQR(qrUrl) {
  switchPage("page-qr");
  const qrImg = document.getElementById("qr-img");
  qrImg.src = qrUrl;
  qrImg.onload = () => {
    qrImg.style.opacity = "1";
  };
}

// Handle payment completion
// Note: Telegram WebApp doesn't directly receive payment callbacks
// The bot will send QR code to chat after successful payment
// User can check chat or return to app

// Check URL parameters for QR code (if bot sends it via URL)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("qr")) {
  showQR(urlParams.get("qr"));
}

// Listen for visibility change (when user returns to app)
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // User returned to app - could check for updates here
    updateCartBadge();
  }
});

/* ===== TAB BAR NAVIGATION ===== */
document.querySelectorAll(".tab-item").forEach(tab => {
  tab.addEventListener("click", () => {
    const pageId = tab.getAttribute("data-page");
    
    // Update active tab
    document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    
    // Switch page
    switchPage(pageId);
    
    // Render cart if switching to cart page
    if (pageId === "page-cart") {
      renderCart();
    }
  });
});

/* ===== PAGE NAVIGATION ===== */
function switchPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = document.getElementById(id);
  const tabBar = document.querySelector(".tab-bar");
  
  if (page) {
    page.classList.add("active");
    
    // Show/hide tab bar based on page
    if (id === "page-main" || id === "page-cart") {
      tabBar.classList.remove("hidden");
      // Update tab bar active state
      document.querySelectorAll(".tab-item").forEach(t => {
        t.classList.toggle("active", t.getAttribute("data-page") === id);
      });
    } else {
      // Hide tab bar for Pay and QR pages
      tabBar.classList.add("hidden");
      document.querySelectorAll(".tab-item").forEach(t => t.classList.remove("active"));
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  }
}

/* ===== BACK TO HOME ===== */
const backHomeButton = document.querySelector(".back-home-button");
if (backHomeButton) {
  backHomeButton.addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCartBadge();
    switchPage("page-main");
    renderCart();
  });
}

/* ===== SEARCH INPUT ===== */
const searchInput = document.getElementById("search-input");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderProducts();
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.blur();
      renderProducts();
    }
  });
}

/* ===== INITIALIZE ===== */
renderCategoryButtons();
renderProducts();
updateCartBadge();

// Add coffee-themed decorative elements
addCoffeeDecorations();

function addCoffeeDecorations() {
  // Add floating coffee beans animation
  const decor = document.createElement("div");
  decor.className = "coffee-decorations";
  decor.innerHTML = `
    <div class="coffee-bean bean-1">☕</div>
    <div class="coffee-bean bean-2">☕</div>
    <div class="coffee-bean bean-3">☕</div>
  `;
  document.body.appendChild(decor);
}
