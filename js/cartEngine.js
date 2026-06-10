(function () {

    /* --loading cart-- */

    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch (err) {
            console.error("Cart load error:", err);
            return [];
        }
    }

    let cart = loadCart();

    /* SAVE CART STATE */

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    /*  EVENT SYSTEM (UI SYNC) */

    const listeners = [];

    function subscribe(fn) {
        listeners.push(fn);
    }

    function notify() {
        const snapshot = getCart();
        listeners.forEach(fn => fn(snapshot));

        // ALWAYS sync badges globally
        syncCartBadges(snapshot);
    }

    /*  GLOBAL BADGE SYNC*/

    function syncCartBadges(cartData) {

        const totalItems = cartData.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        document.querySelectorAll(
            ".cart-count, #cart-count, #status-items, #cart-items-count"
        ).forEach(el => {
            if (el) el.textContent = totalItems;
        });
    }

    /*GET CART */

    function getCart() {
        return cart;
    }

    /* ADD ITEM */

    function addToCart(product) {

        if (!product || !product.id) {
            console.warn("Invalid product:", product);
            return;
        }

        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: Number(product.price) || 0,
                image: product.image || "",
                quantity: 1
            });
        }

        saveCart();
        notify();
    }

    /*  REMOVE ITEM */

    function removeFromCart(productId) {

        cart = cart.filter(item => item.id !== productId);

        saveCart();
        notify();
    }

    /*UPDATE QUANTITY= */

    function updateQuantity(productId, change) {

        const item = cart.find(p => p.id === productId);

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart();
        notify();
    }

    /* CLEAR CART */

    function clearCart() {
        cart = [];
        saveCart();
        notify();
    }

    /* TOTALS ENGINE */

    function getTotals() {

        const subtotal = cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        return {
            subtotal,
            discount: 0,
            savings: 0,
            total: subtotal
        };
    }

    /* INIT SYNC ON PAGE LOAD*/

    document.addEventListener("DOMContentLoaded", () => {
        syncCartBadges(cart);
    });

    /* PUBLIC API */

    window.cartEngine = {
        getCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotals,
        subscribe
    };

})();