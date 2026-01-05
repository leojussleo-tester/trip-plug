console.log("SCRIPT RUNNING");

/* ================= GLOBAL STATE ================= */
let products = [];
let currentFilter = "ALL";

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {
    console.log("SCRIPT READY");

    const grid = document.querySelector(".product-grid");
    const searchInput = document.getElementById("searchInput");
    const navLinks = document.querySelectorAll(".main-nav a[data-filter]");

    /* ================= FADE EFFECT ================= */
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    function observeFade() {
        document.querySelectorAll(".fade").forEach(el => observer.observe(el));
    }

    /* ================= RENDER PRODUCTS ================= */
    function renderProducts(list) {
        grid.innerHTML = "";

        if (!list.length) {
            grid.innerHTML = "<p>Không tìm thấy sản phẩm</p>";
            return;
        }

        list.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card fade";

            card.innerHTML = `
                <span class="badge">${product.type}</span>
                <img src="${product.image}" alt="${product.name}">
                <p>${product.name}</p>
            `;

            card.addEventListener("click", () => openModal(product));
            grid.appendChild(card);
        });

        observeFade();
    }

    /* ================= FILTER + SEARCH ================= */
    function applyFilterAndSearch() {
        const keyword = searchInput.value.toLowerCase();

        const result = products.filter(p => {
            const matchType =
                currentFilter === "ALL" || p.type === currentFilter;

            const matchText =
                p.name.toLowerCase().includes(keyword);

            return matchType && matchText;
        });

        renderProducts(result);
    }

    /* ================= EVENTS ================= */
    searchInput.addEventListener("input", applyFilterAndSearch);

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            currentFilter = link.dataset.filter;
            applyFilterAndSearch();
        });
    });

    /* ================= LOAD DATA ================= */
    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            products = data;
            renderProducts(products);
        })
        .catch(err => console.error("Không load được products.json", err));

    observeFade();
});

/* ================= MODAL (SAFE) ================= */
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalType = document.getElementById("modalType");
const modalClose = document.querySelector(".modal-close");
const modalOverlay = document.querySelector(".modal-overlay");

function openModal(product) {
    if (!modal) return;
    modalImage.src = product.image;
    modalName.textContent = product.name;
    modalType.textContent = product.type;
    modal.classList.add("show");
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
}

modalClose && modalClose.addEventListener("click", closeModal);
modalOverlay && modalOverlay.addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});
