//Hero Section//
document.addEventListener("DOMContentLoaded", () => {
    const slideContainer = document.querySelector(".header-banner-image");
    const prevBtn = document.querySelector(".arrow.left");
    const nextBtn = document.querySelector(".arrow.right");

    if (!slideContainer) return;

    //  Creating  the slider track element dynamically
    const track = document.createElement("div");
    track.className = "slide-track";

    // Moving images inside the track without breaking them
    const originalSlides = slideContainer.querySelectorAll(".header-img");
    originalSlides.forEach(slide => track.appendChild(slide));
    slideContainer.appendChild(track);

    //sliding logic variables
    let currentSlide = 0;
    const totalSlides = originalSlides.length;
    let slideInterval;

    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        if (totalSlides === 0) return;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        if (totalSlides === 0) return;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    function startAutoplay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (totalSlides > 1) nextSlide();
        }, 5000);
    }

    // event controls 
    nextBtn?.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });

    prevBtn?.addEventListener("click", () => {
        prevSlide();
        startAutoplay();
    });

    //  slider loop
    startAutoplay();
});

//  SEARCH SYSTEM 
const searchInput = document.querySelector(".bmday-search input");
const searchslideTrack = document.querySelector(".slide-track");

function updateSlider() {
    if (!slideTrack) return;
    slideTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}
dropdown = document.querySelector(".search-dropdown");
let searchTimeout;


// ---------------- BACKEND SEARCH ----------------
async function searchProducts(query) {
    try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Search failed");
        return await res.json();
    } catch (err) {
        console.error("Search error:", err);
        return [];
    }
}
// ---------------- MAIN SEARCH ENGINE ----------------
async function performSearch(query) {
const q = query.trim();
    if (!q) return;
 // just pass query
    window.location.href = `products?search=${encodeURIComponent(q)}`;
}
// ================= ENTER KEY SEARCH =================
searchInput?.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        const value = searchInput.value.trim();
        if (!value) return;
        performSearch(value);
    }
});
// ================= LIVE SEARCH  =================
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
        searchDropdown.innerHTML = `
            <div class="search-title">No results found</div>
        `;
           searchDropdown.classList.add("open");
        return;
    }

    const fragment = document.createDocumentFragment();
    products.slice(0, 6).forEach(p => {
  const item = document.createElement("a");
   item.href = "products.html";
        item.className = "dropdown-item";
        
        item.innerHTML = `
            <strong>${p.name}</strong><br>
            <small>${p.category}</small>
        `;

        item.addEventListener("click", (e) => {
    e.preventDefault();

    const productName = p.name;
    window.location.href =
        `products.html?search=${encodeURIComponent(productName)}`;
});
        fragment.appendChild(item);
    });

    searchDropdown.appendChild(fragment);
    searchDropdown.classList.add("open");
}


// ================= DROPDOWN OPEN/CLOSE =================
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