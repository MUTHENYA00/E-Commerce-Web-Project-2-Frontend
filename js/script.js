document.addEventListener("DOMContentLoaded", () => {

    // SEARCH 
    const searchBtn = document.querySelector('.search-btn');
    const dropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn && dropdown && searchInput) {

        const dropdownItems = Array.from(dropdown.querySelectorAll('.dropdown-item'));

        searchBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            searchBtn.setAttribute('aria-expanded', String(isOpen));
            if (isOpen) searchInput.focus();
        });

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-search-tab')) {
                dropdown.classList.remove('open');
                searchBtn.setAttribute('aria-expanded', 'false');
            }
        });

        searchInput.addEventListener('input', () => {
            const text = searchInput.value.trim().toLowerCase();

            dropdownItems.forEach((item) => {
                const label = item.textContent.trim().toLowerCase();
                item.style.display = label.includes(text) ? 'block' : 'none';
            });

            const anyVisible = dropdownItems.some((item) => item.style.display !== 'none');

            if (text && anyVisible) {
                dropdown.classList.add('open');
            } else {
                dropdown.classList.remove('open');
            }
        });

        dropdownItems.forEach((item) => {
            item.addEventListener('click', () => {
                searchInput.value = item.textContent.trim();
                dropdown.classList.remove('open');
            });
        });
    }

    // = POPUP SYSTEM =====

    const popup = document.getElementById("product-popup");
    const confirmBox = document.getElementById("confirm-box");

    const popupImg = document.getElementById("popup-img");
    const popupTitle = document.getElementById("popup-title");
    const popupPrice = document.getElementById("popup-price");

    if (!popup || !confirmBox) {
        console.log("Popup elements missing");
        return;
    }

    //  EVENT DELEGATION 
    document.addEventListener("click", (e) => {

        const card = e.target.closest(".products-card");

        if (!card) return;

        const img = card.querySelector("img")?.src;
        const title = card.querySelector("h3")?.innerText;
        const price = card.querySelector("span")?.innerText || "0";

        popupImg.src = img || "";
        popupTitle.innerText = title || "Product";
        popupPrice.innerText = price;

        popup.classList.remove("hidden");
    });

    // CLOSE POPUP
    document.getElementById("close-popup")?.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    // ADD TO CART
    document.getElementById("add-cart")?.addEventListener("click", () => {
        alert("Added to cart!");
    });

    // BUY NOW
    document.getElementById("buy-now")?.addEventListener("click", () => {
        confirmBox.classList.remove("hidden");
    });

    // CONFIRM BUY
    document.getElementById("confirm-buy")?.addEventListener("click", () => {
        window.location.href = "/signin";
    });

    // CANCEL BUY
    document.getElementById("cancel-buy")?.addEventListener("click", () => {
        confirmBox.classList.add("hidden");
    });

});



