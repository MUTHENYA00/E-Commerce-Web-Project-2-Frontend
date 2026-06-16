document.addEventListener("DOMContentLoaded", () => {
  // ---------------- SAFE GUARD ----------------
  if (!window.cartEngine) {
    console.error("cartEngine not loaded");
    return;
  }

  // ---------------- DOM ELEMENTS ----------------
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const deliveryMessage = document.getElementById("delivery-message");

  const recommendationContainer = document.querySelector(".recommendation-track");

  // ---------------- RENDER CART ----------------
  function renderCart() {
    const cart = cartEngine.getCart();

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = `<p style="text-align:center;color:#777;padding:20px;">Your cart is empty</p>`;
      updateUI();
      return;
    }

    cart.forEach((item) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <img src="${item.image || ''}" alt="${item.name || ''}">

        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Ksh ${item.price}</p>

          <div class="quantity">
            <button class="qty-minus" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>

          <button class="remove-btn" data-id="${item.id}">
            Remove
          </button>
        </div>
      `;

      container.appendChild(div);
    });

    updateUI();
  }

  // ---------------- UPDATE UI ----------------
  function updateUI() {
    const totals = cartEngine.getTotals();

    if (subtotalEl) {
      subtotalEl.textContent = `Ksh ${totals.subtotal}`;
    }

    if (totalEl) {
      totalEl.textContent = `Ksh ${totals.total}`;
    }

    if (deliveryMessage) {
      if (totals.subtotal >= 1000) {
        deliveryMessage.textContent = "You qualify for FREE delivery!";
      } else {
        const remaining = 1000 - totals.subtotal;
        deliveryMessage.textContent = `Add Ksh ${remaining} more to unlock FREE delivery`;
      }
    }
  }

  // ---------------- CART ACTIONS ----------------
  document.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (!id) return;

    if (e.target.classList.contains("qty-minus")) {
      cartEngine.updateQuantity(id, -1);
      return;
    }

    if (e.target.classList.contains("qty-plus")) {
      cartEngine.updateQuantity(id, 1);
      return;
    }

    if (e.target.classList.contains("remove-btn")) {
      cartEngine.removeFromCart(id);
      return;
    }

    const recBtn = e.target.closest(".add-rec-btn");
    if (recBtn) {
      cartEngine.addToCart({
        id: recBtn.dataset.id,
        name: recBtn.dataset.name,
        price: Number(recBtn.dataset.price),
        image: recBtn.dataset.image
      });
    }
  });

  // ---------------- RECOMMENDATIONS ----------------
  async function loadRecommendations() {
    if (!recommendationContainer) return;

    try {
      const res = await fetch("/api/products");
      const products = await res.json();

      const cart = cartEngine.getCart();
      const cartIds = cart.map((i) => i.id);

      const suggestions = products
        .filter((p) => !cartIds.includes(p.id))
        .slice(0, 6);

      recommendationContainer.innerHTML = "";

      suggestions.forEach((product) => {
        const card = document.createElement("div");
        card.className = "rec-card";

        card.innerHTML = `
          <img src="${product.image_path || ''}" alt="${product.product_name || ''}">

          <div class="rec-details">
            <h4>${product.product_name}</h4>
            <p class="rec-price">Ksh ${product.price}</p>

            <button class="add-rec-btn"
              data-id="${product.id}"
              data-name="${product.product_name}"
              data-price="${product.price}"
              data-image="${product.image_path}">
              + Add to Cart
            </button>
          </div>
        `;

        recommendationContainer.appendChild(card);
      });

    } catch (err) {
      console.error("Recommendations error:", err);
    }
  }

  // ---------------- SUBSCRIBE CART UPDATES ----------------
  cartEngine.subscribe(renderCart);

  // ---------------- INITIAL LOAD ----------------
  renderCart();
  loadRecommendations();
});