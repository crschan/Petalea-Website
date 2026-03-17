document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Modal Logic & Product Rendering
    const orderModal = document.getElementById('order-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const directOrderBtn = document.getElementById('direct-order-btn');
    const closeModals = document.querySelectorAll('.close-modal');

    let currentSelectedProduct = null;
    
    // Render Products
    function renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const products = typeof getProducts === 'function' ? getProducts() : [];
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-price">₱${p.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <button class="btn btn-primary order-action-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">Add to Order</button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Attach modal logic to new buttons
        document.querySelectorAll('.order-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentSelectedProduct = {
                    id: btn.getAttribute('data-id'),
                    name: btn.getAttribute('data-name'),
                    price: parseFloat(btn.getAttribute('data-price') || 0),
                    image: btn.getAttribute('data-image')
                };
                if (orderModal) orderModal.classList.add('active');
            });
        });
    }

    renderProducts();

    if (closeModals) {
        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                if (orderModal) orderModal.classList.remove('active');
                if (checkoutModal) checkoutModal.classList.remove('active');
            });
        });
    }
    
    window.addEventListener('click', (e) => {
        if (orderModal && e.target === orderModal) orderModal.classList.remove('active');
        if (checkoutModal && e.target === checkoutModal) checkoutModal.classList.remove('active');
    });

    if (directOrderBtn) {
        directOrderBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (orderModal) orderModal.classList.remove('active');
            if (checkoutModal) checkoutModal.classList.add('active');
            
            // Populate checkout form
            if (currentSelectedProduct && currentSelectedProduct.name) {
                document.getElementById('checkout-product-display').textContent = `${currentSelectedProduct.name} - ₱${currentSelectedProduct.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            } else {
                document.getElementById('checkout-product-display').textContent = 'General/Custom Order';
            }
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const customerName = document.getElementById('checkout-name').value;
            const email = document.getElementById('checkout-email').value;
            
            if (typeof addOrder === 'function') {
                addOrder({
                    customerName,
                    email,
                    productName: (currentSelectedProduct && currentSelectedProduct.name) ? currentSelectedProduct.name : 'Custom Order',
                    total: (currentSelectedProduct && currentSelectedProduct.price) ? currentSelectedProduct.price : 0,
                    image: (currentSelectedProduct && currentSelectedProduct.image) ? currentSelectedProduct.image : 'assets/hero_bouquet_1771732940523.png'
                });
                alert('Success! Your order has been placed. We will contact you shortly.');
                checkoutModal.classList.remove('active');
                checkoutForm.reset();
            }
        });
    }
});
