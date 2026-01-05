console.log("SCRIPT RUNNING");

document.addEventListener("DOMContentLoaded", () => {
    console.log("SCRIPT READY");

    // ================= FADE OBSERVER =================
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

    // ================= DATA =================
    const services = [
        "Custom Hotwheels",
        "Đấu Giá",
        "Ký Gửi",
        "Order Nhật",
        "Săn Limited",
        "Tư Vấn Sưu Tầm"
    ];

    let products = [];

fetch("products.json")
    .then(res => res.json())
    .then(data => {
        products = data;

        // remove skeleton
        productGrid.classList.remove("skeleton");
        productGrid.innerHTML = "";

        renderProducts(products);
    })
    .catch(err => {
        console.error("Không load được products.json", err);
    });

    // ================= SERVICE =================
    const serviceList = document.querySelector(".service-list");
    if (serviceList) {
        services.forEach(s => {
            const div = document.createElement("div");
            div.className = "service-item fade";
            div.textContent = s;
            serviceList.appendChild(div);
        });
    }

    // ================= PRODUCT =================
    const productGrid = document.querySelector(".product-grid");
    const filterButtons = document.querySelectorAll(".product-filter button");

    function renderProducts(list) {
        productGrid.innerHTML = "";

        list.forEach(p => {
            const card = document.createElement("article");
            card.className = "product-card fade";

            card.innerHTML = `
                <span class="badge">${p.type}</span>
                <img src="${p.image}" alt="${p.name}">
                <p>${p.name}</p>
            `;

            card.addEventListener("click", () => {
               openProductModal(p);
            });


            productGrid.appendChild(card);
        });

        observeFade();
    }

    // ================= FILTER =================
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".product-filter .active")?.classList.remove("active");
            btn.classList.add("active");

            const type = btn.dataset.type;
            renderProducts(type === "all" ? products : products.filter(p => p.type === type));
        });
    });

    // ================= FORM =================
    const form = document.getElementById("contactForm");
    const msg = document.getElementById("formMessage");

    form?.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

        if (!name) return showMessage("Vui lòng nhập họ tên", "red");
        if (!phoneRegex.test(phone)) return showMessage("Số điện thoại không hợp lệ", "red");

        showMessage("Gửi thành công! Chúng tôi sẽ liên hệ sớm.", "green");
        form.reset();
    });

    function showMessage(text, color) {
        msg.textContent = text;
        msg.style.color = color;
    }

    // ================= MODAL =================
    function openModal(src) {
        const modal = document.createElement("div");
        modal.className = "image-modal";

        modal.innerHTML = `
            <div class="image-modal-content">
                <img src="${src}">
            </div>
        `;

        modal.addEventListener("click", () => modal.remove());
        document.body.appendChild(modal);
    }

    // INIT FADE
    observeFade();
    function openProductModal(product) {
    const modal = document.createElement("div");
    modal.className = "product-modal";

    modal.innerHTML = `
        <div class="product-modal-content">
            <span class="close">&times;</span>

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>
            <span class="tag">${product.type}</span>

            <p class="desc">${product.desc}</p>

            <a href="#contact" class="btn-primary">
                Liên hệ mua
            </a>
        </div>
    `;

    modal.querySelector(".close").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
}

});
