document.addEventListener("DOMContentLoaded", () => {

    if (!window.cartEngine) {
        console.error("cartEngine not loaded");
        return;
    }

    const container = document.getElementById("cart-items-container");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const deliveryMessage = document.getElementById("delivery-message");

    /* =========================
       RENDER CART
    ========================= */

    function renderCart() {

        const cart = cartEngine.getCart();

        if (!container) return;

        container.innerHTML = "";

        if (cart.length === 0) {
            container.innerHTML = `
                <p style="text-align:center;color:#777;padding:20px;">
                    Your cart is empty
                </p>
            `;
            updateUI();
            return;
        }

        cart.forEach(item => {

            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">

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

    /* =========================
       UI UPDATES (SINGLE SOURCE)
    ========================= */

    function updateUI() {

        const totals = cartEngine.getTotals();
        const cart = cartEngine.getCart();

        if (subtotalEl) {
            subtotalEl.textContent = `Ksh ${totals.subtotal}`;
        }

        if (totalEl) {
            totalEl.textContent = `Ksh ${totals.total}`;
        }

        if (deliveryMessage) {

            if (totals.subtotal >= 1000) {
                deliveryMessage.textContent =
                    "You qualify for FREE delivery!";
            } else {
                const remaining = 1000 - totals.subtotal;
                deliveryMessage.textContent =
                    `Add Ksh ${remaining} more to unlock FREE delivery`;
            }
        }

        // IMPORTANT: badge sync handled by engine, so no duplicate logic here
    }

    document.addEventListener("click", (e) => {

    const qtyId = e.target.dataset.id;

    /* =========================
       QUANTITY + REMOVE
    ========================= */

    if (qtyId && e.target.classList.contains("qty-minus")) {
        cartEngine.updateQuantity(qtyId, -1);
        return;
    }

    if (qtyId && e.target.classList.contains("qty-plus")) {
        cartEngine.updateQuantity(qtyId, 1);
        return;
    }

    if (qtyId && e.target.classList.contains("remove-btn")) {
        cartEngine.removeFromCart(qtyId);
        return;
    }

    /* =========================
       RECOMMENDATION ADD TO CART
    ========================= */

    const recBtn = e.target.closest(".add-rec-btn");

    if (recBtn) {

        const product = {
            id: recBtn.dataset.id,
            name: recBtn.dataset.name,
            price: Number(recBtn.dataset.price),
            image: recBtn.dataset.image
        };

        cartEngine.addToCart(product);
    }
});
// ======CART RECOMMENDATION 
async function loadRecommendations() {

    const container = document.querySelector(".recommendation-track");
    if (!container) return;

    try {
        const res = await fetch("/api/products");
        const products = await res.json();

        const cart = cartEngine.getCart();

        // Get categories or exclude cart items
        const cartIds = cart.map(item => item.id);

        const suggestions = products
            .filter(p => !cartIds.includes(p.id))
            .slice(0, 6); // limit results

        container.innerHTML = "";

        suggestions.forEach(product => {

            const card = document.createElement("div");
            card.className = "rec-card";

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">

                <div class="rec-details">
                    <h4>${product.name}</h4>
                    <p class="rec-price">Ksh ${product.price}</p>

                    <button class="add-rec-btn"
                        data-id="${product.id}"
                        data-name="${product.name}"
                        data-price="${product.price}"
                        data-image="${product.image}">
                        + Add to Cart
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error("Recommendations error:", err);
    }
  
}
    /* =========================
       ENGINE CONNECTION
    ========================= */

    cartEngine.subscribe(renderCart);

    /* =========================
       INITIAL LOAD
    ========================= */

    renderCart();

});
  loadRecommendations();