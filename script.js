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
    const customOrderForm = document.getElementById('custom-order-form');
    const customFormStatus = document.getElementById('custom-form-status');
    const customFlowersGrid = document.getElementById('custom-flowers-grid');
    const testimonialsGrid = document.getElementById('testimonials-grid');
    const directOrderBtn = document.getElementById('direct-order-btn');
    const closeModals = document.querySelectorAll('.close-modal');

    let currentSelectedProduct = null;
    let customFlowers = [];

    function bindFulfillmentForm(selectId, groupId, addressId) {
        const select = document.getElementById(selectId);
        const addressGroup = document.getElementById(groupId);
        const address = document.getElementById(addressId);
        const updateAddressField = () => {
            const isDelivery = select.value === 'Delivery';
            addressGroup.hidden = !isDelivery;
            address.required = isDelivery;
            address.disabled = !isDelivery;
        };

        select.addEventListener('change', updateAddressField);
        select.form.addEventListener('reset', () => setTimeout(updateAddressField, 0));
        updateAddressField();
    }

    bindFulfillmentForm('checkout-fulfillment', 'checkout-address-group', 'checkout-delivery-address');
    bindFulfillmentForm('custom-fulfillment', 'custom-address-group', 'custom-delivery-address');
    
    // Render Products
    async function renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        
        // Show skeleton loaders First
        grid.innerHTML = Array(3).fill(`
            <div class="product-card">
                <div class="skeleton skeleton-img"></div>
                <div class="product-info">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-price"></div>
                    <div class="skeleton skeleton-btn"></div>
                </div>
            </div>
        `).join('');

        try {
            const products = typeof getProducts === 'function' ? await getProducts() : [];
            grid.replaceChildren();

            if (products.length === 0) {
                const emptyState = document.createElement('p');
                emptyState.style.gridColumn = '1 / -1';
                emptyState.style.textAlign = 'center';
                emptyState.textContent = 'No products are available right now. Please check back soon.';
                grid.appendChild(emptyState);
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                const image = document.createElement('img');
                image.className = 'product-img';
                image.alt = product.name || 'Petalea bouquet';
                image.loading = 'lazy';
                if (typeof product.image === 'string') {
                    try {
                        const imageUrl = new URL(product.image, window.location.href);
                        if (imageUrl.protocol === 'https:' || imageUrl.protocol === 'http:') {
                            image.src = imageUrl.href;
                        }
                    } catch (error) {
                        console.warn('Ignoring invalid product image URL.', error);
                    }
                }

                const info = document.createElement('div');
                info.className = 'product-info';
                const title = document.createElement('h3');
                title.className = 'product-title';
                title.textContent = product.name || 'Unnamed bouquet';
                const price = Number(product.price);
                const priceLabel = document.createElement('div');
                priceLabel.className = 'product-price';
                priceLabel.textContent = `₱${(Number.isFinite(price) ? price : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                const orderButton = document.createElement('button');
                orderButton.type = 'button';
                orderButton.className = 'btn btn-primary order-action-btn';
                orderButton.textContent = 'Add to Order';
                orderButton.addEventListener('click', () => {
                    currentSelectedProduct = {
                        id: product.id,
                        name: product.name,
                        price: Number.isFinite(price) ? price : 0,
                        image: product.image
                    };
                    if (orderModal) orderModal.classList.add('active');
                });

                info.append(title, priceLabel, orderButton);
                card.append(image, info);
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Could not load products:', error);
            grid.replaceChildren();
            const errorMessage = document.createElement('p');
            errorMessage.style.gridColumn = '1 / -1';
            errorMessage.style.textAlign = 'center';
            errorMessage.textContent = 'Products are temporarily unavailable. Please try again later.';
            grid.appendChild(errorMessage);
        }
    }

    renderProducts();

    async function renderTestimonials() {
        if (!testimonialsGrid) return;
        try {
            if (typeof getTestimonials !== 'function') {
                throw new Error('The customer stories service is unavailable.');
            }
            const testimonials = await getTestimonials();
            testimonialsGrid.replaceChildren();
            if (testimonials.length === 0) {
                const message = document.createElement('p');
                message.className = 'testimonial-message';
                message.textContent = 'Customer stories will be shared here soon.';
                testimonialsGrid.appendChild(message);
                return;
            }

            testimonials.forEach(testimonial => {
                const card = document.createElement('article');
                card.className = 'testimonial-card';
                const image = document.createElement('img');
                image.className = 'testimonial-image';
                image.alt = `Petalea customer ${testimonial.name ? `(${testimonial.name})` : ''}`;
                image.loading = 'lazy';
                if (typeof testimonial.image === 'string') {
                    try {
                        const imageUrl = new URL(testimonial.image, window.location.href);
                        if (imageUrl.protocol === 'https:' || imageUrl.protocol === 'http:') {
                            image.src = imageUrl.href;
                        }
                    } catch (error) {
                        console.warn('Ignoring invalid customer photo path.', error);
                    }
                }

                const quote = document.createElement('blockquote');
                quote.textContent = `“${testimonial.feedback || ''}”`;
                const attribution = document.createElement('p');
                attribution.className = 'testimonial-attribution';
                attribution.textContent = testimonial.name || 'Petalea Customer';
                card.append(image, quote, attribution);
                testimonialsGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Could not load customer stories:', error);
            testimonialsGrid.replaceChildren();
            const message = document.createElement('p');
            message.className = 'testimonial-message is-error';
            message.textContent = 'Customer stories are temporarily unavailable. Please try again later.';
            testimonialsGrid.appendChild(message);
        }
    }

    renderTestimonials();

    async function renderCustomFlowers() {
        if (!customFlowersGrid) return;
        try {
            if (typeof getCustomFlowers !== 'function') {
                throw new Error('The flower catalog service is unavailable.');
            }
            customFlowers = await getCustomFlowers();
            customFlowersGrid.replaceChildren();
            if (customFlowers.length === 0) {
                const message = document.createElement('p');
                message.className = 'flower-picker-message';
                message.textContent = 'No flower choices are available yet. Please check back soon.';
                customFlowersGrid.appendChild(message);
                return;
            }

            customFlowers.forEach(flower => {
                const label = document.createElement('label');
                label.className = 'flower-choice';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'selected-flowers';
                checkbox.value = flower.id;
                checkbox.setAttribute('aria-label', `${flower.name}, ${Number(flower.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} pesos per flower`);
                const image = document.createElement('img');
                image.alt = flower.name || 'Fuzzy wire flower';
                image.loading = 'lazy';
                if (typeof flower.image === 'string') {
                    try {
                        const imageUrl = new URL(flower.image, window.location.href);
                        if (imageUrl.protocol === 'https:' || imageUrl.protocol === 'http:') {
                            image.src = imageUrl.href;
                        }
                    } catch (error) {
                        console.warn('Ignoring invalid flower image path.', error);
                    }
                }

                const info = document.createElement('span');
                info.className = 'flower-choice-info';
                const name = document.createElement('strong');
                name.textContent = flower.name || 'Unnamed flower';
                const price = Number(flower.price);
                const priceLabel = document.createElement('span');
                priceLabel.className = 'flower-choice-price';
                priceLabel.textContent = `₱${(Number.isFinite(price) ? price : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} / flower`;
                info.append(name, priceLabel);
                label.append(checkbox, image, info);
                customFlowersGrid.appendChild(label);
            });
        } catch (error) {
            console.error('Could not load custom bouquet flowers:', error);
            customFlowers = [];
            customFlowersGrid.replaceChildren();
            const message = document.createElement('p');
            message.className = 'flower-picker-message is-error';
            message.textContent = 'Flower choices are temporarily unavailable. Please try again later.';
            customFlowersGrid.appendChild(message);
        }
    }

    renderCustomFlowers();

    if (customOrderForm) {
        customOrderForm.addEventListener('submit', async event => {
            event.preventDefault();
            const submitButton = customOrderForm.querySelector('button[type="submit"]');
            const selectedColor = customOrderForm.querySelector('input[name="color"]:checked');
            const selectedIds = new Set(
                Array.from(customOrderForm.querySelectorAll('input[name="selected-flowers"]:checked'))
                    .map(input => input.value)
            );
            const selectedFlowers = customFlowers
                .filter(flower => selectedIds.has(flower.id))
                .map(flower => ({
                    id: flower.id,
                    name: flower.name,
                    price: Number(flower.price),
                    image: flower.image
                }));
            const request = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('custom-phone').value.trim(),
                facebookName: document.getElementById('custom-facebook-name').value.trim(),
                paymentMethod: document.getElementById('custom-payment-method').value,
                fulfillment: document.getElementById('custom-fulfillment').value,
                deliveryAddress: document.getElementById('custom-fulfillment').value === 'Delivery'
                    ? document.getElementById('custom-delivery-address').value.trim()
                    : '',
                deliveryFeeStatus: document.getElementById('custom-fulfillment').value === 'Delivery'
                    ? 'Quote required'
                    : 'No delivery fee',
                color: selectedColor ? selectedColor.value : 'Not specified',
                selectedFlowers,
                details: document.getElementById('details').value.trim()
            };

            customFormStatus.hidden = true;
            customFormStatus.classList.remove('is-error');
            if (selectedFlowers.length === 0) {
                customFormStatus.textContent = 'Please choose at least one flower for your bouquet.';
                customFormStatus.classList.add('is-error');
                customFormStatus.hidden = false;
                return;
            }
            submitButton.disabled = true;
            submitButton.textContent = 'Sending Request…';
            try {
                if (typeof addCustomRequest !== 'function') {
                    throw new Error('The custom request service is unavailable. Please try again later.');
                }
                await addCustomRequest(request);
                customOrderForm.reset();
                customFormStatus.textContent = 'Thank you! Your custom bouquet request has been sent. We’ll contact you to confirm the bouquet price, payment, and any delivery fee.';
                customFormStatus.hidden = false;
            } catch (error) {
                console.error('Could not submit custom request:', error);
                customFormStatus.textContent = `We could not send your request. ${error.message}`;
                customFormStatus.classList.add('is-error');
                customFormStatus.hidden = false;
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Custom Request';
            }
        });
    }

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
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const customerName = document.getElementById('checkout-name').value;
            const email = document.getElementById('checkout-email').value;
            const phone = document.getElementById('checkout-phone').value;
            const submitButton = checkoutForm.querySelector('button[type="submit"]');
            
            // Validate Phone
            const phoneRegex = /^(09|\+639)\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid Philippine phone number (e.g., 09123456789).');
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = 'Placing Order…';
            try {
                if (typeof addOrder !== 'function') {
                    throw new Error('The order service is unavailable. Please try again later.');
                }
                await addOrder({
                    customerName,
                    email,
                    phone,
                    facebookName: document.getElementById('checkout-facebook-name').value.trim(),
                    paymentMethod: document.getElementById('checkout-payment-method').value,
                    fulfillment: document.getElementById('checkout-fulfillment').value,
                    deliveryAddress: document.getElementById('checkout-fulfillment').value === 'Delivery'
                        ? document.getElementById('checkout-delivery-address').value.trim()
                        : '',
                    deliveryFeeStatus: document.getElementById('checkout-fulfillment').value === 'Delivery'
                        ? 'Quote required'
                        : 'No delivery fee',
                    productName: (currentSelectedProduct && currentSelectedProduct.name) ? currentSelectedProduct.name : 'Custom Order',
                    total: (currentSelectedProduct && currentSelectedProduct.price) ? currentSelectedProduct.price : 0,
                    image: (currentSelectedProduct && currentSelectedProduct.image) ? currentSelectedProduct.image : 'assets/hero_bouquet_1771732940523.png'
                });
                alert('Your order request has been sent! We will contact you shortly to confirm payment and final details. Delivery fees are quoted separately.');
                checkoutModal.classList.remove('active');
                checkoutForm.reset();
            } catch (error) {
                console.error('Could not place order:', error);
                alert(`We could not place your order. ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Confirm & Place Order';
            }
        });
    }
});
