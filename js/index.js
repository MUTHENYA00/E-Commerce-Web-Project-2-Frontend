//Hero Section//
document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".slide-track");
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".arrow.left");
    const nextBtn = document.querySelector(".arrow.right");

    if (!track || slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function updateSlider() {
        track.style.transform =
            `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    }

    function startAutoplay() {
        clearInterval(slideInterval);

        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    nextBtn?.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });

    prevBtn?.addEventListener("click", () => {
        prevSlide();
        startAutoplay();
    });

    startAutoplay();
});
// SEARCH SYSTEM 
const searchInput = document.querySelector(".bmday-search input");
const searchDropdown = document.querySelector(".search-dropdown");
let searchTimeout;

// ---------------- BACKEND SEARCH ----------------
async function searchProducts(query) {
  const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);

  if (!res.ok) throw new Error("Search failed");

  return await res.json();
}
// ---------------- ENTER KEY SEARCH ----------------
searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = searchInput.value.trim();
        if (!value) return;
        window.location.href = `/products?search=${encodeURIComponent(value)}`;
    }
});

// ---------------- LIVE SEARCH ----------------
searchInput?.addEventListener("input", (e) => {
    const value = e.target.value.trim();

    clearTimeout(searchTimeout);

    if (!value) {
        searchDropdown?.classList.remove("open");
        return;
    }

    searchTimeout = setTimeout(async () => {
        const results = await searchProducts(value);
        showLiveResults(results);
    }, 300);
});

// ---------------- SHOW DROPDOWN RESULTS ----------------
function showLiveResults(products) {
    if (!searchDropdown) return;

    searchDropdown.innerHTML = "";

    if (!products || products.length === 0) {
        searchDropdown.innerHTML = `<div class="search-title">No results found</div>`;
        searchDropdown.classList.add("open");
        return;
    }

    products.slice(0, 6).forEach(p => {
    const item = document.createElement("a");

    item.className = "dropdown-item";
    item.href = `/products?search=${encodeURIComponent(p.product_name)}`;

    item.innerHTML = `
        <strong>${p.product_name}</strong><br>
    `;

    searchDropdown.appendChild(item);
});
    searchDropdown.classList.add("open");
}

// ---------------- DROPDOWN OPEN/CLOSE ----------------
searchInput?.addEventListener("focus", () => {
    searchDropdown?.classList.add("open");
});

document.addEventListener("click", (e) => {
    if (
        !searchInput?.contains(e.target) &&
        !searchDropdown?.contains(e.target)
    ) {
        searchDropdown?.classList.remove("open");
    }
});
// ================= SIDEBAR =================
function openSidebar() {
    document.getElementById("sidebar")?.classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("active");
}