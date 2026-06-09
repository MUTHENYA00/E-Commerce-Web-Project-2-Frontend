document.addEventListener("DOMContentLoaded", async () => {
  // --- 1. DOM ELEMENTS ---
  const container = document.getElementById("product-container");
  const loadingText = document.getElementById("loadingText");
  const searchInput = document.getElementById("searchInput");
  
  // Modal Elements
  const buyModal = document.getElementById("buyModal");
  const closeModal = document.getElementById("closeModal");
  const modalImage = document.getElementById("modalImage");
  const modalName = document.getElementById("modalName");
  const modalPrice = document.getElementById("modalPrice");
  const confirmBuy = document.getElementById("confirmBuy");

  // --- 2. GLOBAL STATE ---
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  const search = params.get("search");
  let allProducts = [];

  if (container) container.classList.add("product-grid");

  // --- 3. API & DATA FETCHING ---
  async function apiFetch(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`API Fetch Error (${url}):`, err);
      return [];
    }
  }

  // --- 4. UI RENDERING ---
  function renderProducts(products, title) {
    if (!container) return;
    container.replaceChildren();
    
    if (loadingText) loadingText.style.display = "none";

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div style="padding:30px; text-align:center; width:100%;">
          <h3>${title}</h3>
          <p>No products found.</p>
        </div>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    products.forEach(({ id, name, price, image, desc }) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="img-box">
          <img src="${image}" alt="${name}">
        </div>
        <h3>${name}</h3>
        <p>${desc}</p>
        <p class="product-price">${price}</p>
        <button class="buy-now" data-name="${name}" data-price="${price}" data-image="${image}">
          Buy Now
        </button>
        <button class="add-to-cart" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}">
          Add to Cart
        </button>`;
      fragment.appendChild(card);
    });
    container.appendChild(fragment);
  }

  // --- 5. CART & MODAL ACTIONS ---
  function handleAddToCart(target) {

  if (!window.cartEngine) {
    console.error("cartEngine not loaded");
    return;
  }

  const product = {
    id: target.dataset.id,
    name: target.dataset.name,
    price: Number(target.dataset.price),
    image: target.dataset.image
  };

  cartEngine.addToCart(product);

  console.log(`${product.name} added to cart`);
}

  function openBuyModal(target) {
    if (!buyModal) return;
    const imagePath = target.dataset.image;
    
    if (modalImage) {
      modalImage.src = imagePath;
      modalImage.dataset.image = imagePath;
    }
    if (modalName) modalName.textContent = target.dataset.name;
    if (modalPrice) modalPrice.textContent = target.dataset.price;
    
    buyModal.classList.add("active");
  }

  function closeBuyModal() {
    if (!buyModal) return;
    buyModal.classList.remove("active");
    localStorage.removeItem("pendingPurchase");
  }

  // --- 6. EVENT LISTENERS ---
  
  // Global Delegation for dynamic product buttons
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      handleAddToCart(e.target);
    } else if (e.target.classList.contains("buy-now")) {
      openBuyModal(e.target);
    }
  });

  // Modal Closures
  if (closeModal) {
    closeModal.addEventListener("click", closeBuyModal);
  }
  
  window.addEventListener("click", (e) => {
    if (e.target === buyModal) closeBuyModal();
  });

  // Confirm Purchase Redirect
  if (confirmBuy) {
    confirmBuy.addEventListener("click", (e) => {
      e.preventDefault();
      const modalData = {
        image: modalImage?.dataset.image || "",
        name: modalName?.textContent || "",
        price: modalPrice?.textContent || ""
      };
      localStorage.setItem("pendingPurchase", JSON.stringify(modalData));
      window.location.assign("/signin");
    });
  }

  // Live Search Setup
  function initLiveSearch() {
    if (!searchInput) return;
    searchInput.addEventListener("input", async (e) => {
      const value = e.target.value.trim();
      if (!value) {
        renderProducts(allProducts, "All Products");
        return;
      }
      const searchedProducts = await apiFetch(`/api/products/search?q=${encodeURIComponent(value)}`);
      renderProducts(searchedProducts, `Search: ${value}`);
    });
  }

  // --- 7. CACHE & HARD REFRESH HANDLING ---
  
  // Page Show / Back Button Fix
  window.addEventListener("pageshow", () => {
    const modalContainer = document.querySelector(".buy-modal, .modal");
    if (modalContainer) {
      modalContainer.removeAttribute("style");
      modalContainer.classList.remove("active", "show", "open");
    }
  });

  // Hard Refresh Elements Cleanup
  (() => {
    const modalContainer = document.querySelector(".buy-modal, .modal");
    if (modalContainer) {
      modalContainer.style.display = "none";
      modalContainer.classList.remove("active", "show", "open");
    }
    if (modalImage) {
      modalImage.src = "";
      modalImage.dataset.image = "";
    }
    if (modalName) modalName.textContent = "";
    if (modalPrice) modalPrice.textContent = "";
  })();

  // --- 8. INITIALIZATION ---
  async function init() {
    allProducts = await apiFetch("/api/products");

    if (category) {
      const categoryProducts = await apiFetch(`/api/products/category/${encodeURIComponent(category)}`);
      renderProducts(categoryProducts, category.replace(/-/g, " "));
    } else if (search) {
      const query = search.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
      );
      renderProducts(filtered, `Search: ${search}`);
    } else {
      renderProducts(allProducts, "All Products");
    }

    initLiveSearch();
    restorePendingPurchase();
  }

  function restorePendingPurchase() {
    const savedPurchase = JSON.parse(localStorage.getItem("pendingPurchase"));
    if (!savedPurchase || !modalImage) return;

    const newImage = new Image();
    newImage.src = savedPurchase.image;
    newImage.onload = () => {
      modalImage.src = savedPurchase.image;
      if (modalName) modalName.textContent = savedPurchase.name;
      if (modalPrice) modalPrice.textContent = savedPurchase.price;
      buyModal?.classList.add("active");
    };
  }

  // Trigger app entry point
  init();
});
