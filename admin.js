document.addEventListener('DOMContentLoaded', () => {
    const productsTbody = document.getElementById('products-tbody');
    const flowersTbody = document.getElementById('flowers-tbody');
    const testimonialsTbody = document.getElementById('testimonials-tbody');
    const ordersTbody = document.getElementById('orders-tbody');
    const requestsTbody = document.getElementById('requests-tbody');
    const addProductForm = document.getElementById('add-product-form');
    const addFlowerForm = document.getElementById('add-flower-form');
    const addTestimonialForm = document.getElementById('add-testimonial-form');
    const totalSalesEl = document.getElementById('total-sales');
    const totalOrdersEl = document.getElementById('total-orders');
    const totalProductsEl = document.getElementById('total-products');
    const totalRequestsEl = document.getElementById('total-requests');
    const loginScreen = document.getElementById('login-screen');
    const adminSidebar = document.getElementById('admin-sidebar');
    const adminMain = document.getElementById('admin-main');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const adminStatus = document.getElementById('admin-status');
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    function showLoginError(message) {
        loginError.textContent = message;
        loginError.hidden = false;
    }

    function setDashboardVisible(visible) {
        loginScreen.hidden = visible;
        adminSidebar.hidden = !visible;
        adminMain.hidden = !visible;
    }

    function showStatus(message, isError = false) {
        adminStatus.textContent = message;
        adminStatus.classList.toggle('is-error', isError);
        adminStatus.hidden = false;
    }

    function clearStatus() {
        adminStatus.textContent = '';
        adminStatus.classList.remove('is-error');
        adminStatus.hidden = true;
    }

    function appendCell(row, content, className) {
        const cell = document.createElement('td');
        if (className) cell.className = className;
        if (content instanceof Node) {
            cell.appendChild(content);
        } else {
            cell.textContent = content;
        }
        row.appendChild(cell);
        return cell;
    }

    function appendEmptyRow(tbody, columnCount, message) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = columnCount;
        cell.className = 'empty-state';
        cell.textContent = message;
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    function formatCurrency(amount) {
        const numericAmount = Number(amount);
        return `₱${currencyFormatter.format(Number.isFinite(numericAmount) ? numericAmount : 0)}`;
    }

    function formatDate(order) {
        if (order.timestamp && typeof order.timestamp.toDate === 'function') {
            return order.timestamp.toDate().toLocaleString();
        }
        if (typeof order.date === 'string' && order.date) {
            return order.date;
        }
        return '—';
    }

    function setSafeImageSource(image, source) {
        if (typeof source !== 'string' || !source.trim()) return;
        try {
            const url = new URL(source, window.location.href);
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                image.src = url.href;
            }
        } catch (error) {
            console.warn('Ignoring invalid product image URL.', error);
        }
    }

    function renderProducts(products) {
        productsTbody.replaceChildren();
        if (products.length === 0) {
            appendEmptyRow(productsTbody, 4, 'No products yet. Add one using the form above.');
            return;
        }

        products.forEach(product => {
            const row = document.createElement('tr');
            const image = document.createElement('img');
            image.alt = typeof product.name === 'string' ? product.name : 'Product';
            image.loading = 'lazy';
            setSafeImageSource(image, product.image);
            appendCell(row, image);

            const name = document.createElement('strong');
            name.textContent = product.name || 'Unnamed product';
            appendCell(row, name);
            appendCell(row, formatCurrency(product.price));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn btn-small btn-danger';
            removeButton.dataset.productId = product.id;
            removeButton.innerHTML = '<i class="fas fa-trash" aria-hidden="true"></i> Remove';
            appendCell(row, removeButton);
            productsTbody.appendChild(row);
        });
    }

    function renderCustomFlowers(flowers) {
        flowersTbody.replaceChildren();
        if (flowers.length === 0) {
            appendEmptyRow(flowersTbody, 4, 'No flowers listed yet. Add flower types for the custom bouquet builder.');
            return;
        }

        flowers.forEach(flower => {
            const row = document.createElement('tr');
            const image = document.createElement('img');
            image.alt = flower.name || 'Flower';
            image.loading = 'lazy';
            setSafeImageSource(image, flower.image);
            appendCell(row, image);

            const name = document.createElement('strong');
            name.textContent = flower.name || 'Unnamed flower';
            appendCell(row, name);
            appendCell(row, `${formatCurrency(flower.price)} / flower`);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn btn-small btn-danger';
            removeButton.dataset.flowerId = flower.id;
            removeButton.textContent = 'Remove';
            appendCell(row, removeButton);
            flowersTbody.appendChild(row);
        });
    }

    function renderTestimonials(testimonials) {
        testimonialsTbody.replaceChildren();
        if (testimonials.length === 0) {
            appendEmptyRow(testimonialsTbody, 4, 'No customer stories published yet.');
            return;
        }

        testimonials.forEach(testimonial => {
            const row = document.createElement('tr');
            const image = document.createElement('img');
            image.alt = `Photo of ${testimonial.name || 'Petalea customer'}`;
            image.loading = 'lazy';
            setSafeImageSource(image, testimonial.image);
            appendCell(row, image);

            const name = document.createElement('strong');
            name.textContent = testimonial.name || 'Petalea Customer';
            appendCell(row, name);

            const feedback = document.createElement('p');
            feedback.className = 'testimonial-feedback-cell';
            feedback.textContent = testimonial.feedback || '';
            appendCell(row, feedback);

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'btn btn-small btn-danger';
            removeButton.dataset.testimonialId = testimonial.id;
            removeButton.textContent = 'Remove';
            appendCell(row, removeButton);
            testimonialsTbody.appendChild(row);
        });
    }

    function renderOrders(orders) {
        ordersTbody.replaceChildren();
        if (orders.length === 0) {
            appendEmptyRow(ordersTbody, 7, 'No orders yet.');
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            const orderId = document.createElement('span');
            orderId.className = 'order-id';
            orderId.textContent = `#${String(order.id).slice(0, 8)}`;
            appendCell(row, orderId);
            appendCell(row, formatDate(order));

            const customer = document.createElement('div');
            const customerName = document.createElement('strong');
            customerName.textContent = order.customerName || 'Unknown customer';
            const contact = document.createElement('small');
            contact.className = 'order-contact';
            contact.textContent = [
                order.phone,
                order.facebookName ? `Facebook: ${order.facebookName}` : '',
                order.email
            ].filter(Boolean).join(' · ') || 'No contact details';
            customer.append(customerName, document.createElement('br'), contact);
            appendCell(row, customer);

            appendCell(row, order.paymentMethod || 'Not provided');

            const fulfillment = document.createElement('div');
            const fulfillmentType = document.createElement('strong');
            fulfillmentType.textContent = order.fulfillment || 'Not provided';
            fulfillment.appendChild(fulfillmentType);
            if (order.fulfillment === 'Delivery' && order.deliveryAddress) {
                const address = document.createElement('small');
                address.className = 'order-contact order-address';
                address.textContent = order.deliveryAddress;
                fulfillment.append(document.createElement('br'), address);
            }
            appendCell(row, fulfillment);

            const product = document.createElement('div');
            const image = document.createElement('img');
            image.className = 'order-image';
            image.alt = '';
            image.loading = 'lazy';
            setSafeImageSource(image, order.image);
            const productName = document.createElement('span');
            productName.textContent = order.productName || 'Custom Order';
            const total = document.createElement('strong');
            total.className = 'order-total';
            total.textContent = `Bouquet: ${formatCurrency(order.total)}`;
            const deliveryFee = document.createElement('small');
            deliveryFee.className = 'order-contact';
            deliveryFee.textContent = order.deliveryFeeStatus === 'Quote required'
                ? 'Delivery fee: quote required'
                : 'Delivery fee: none';
            product.append(image, productName, document.createElement('br'), total, document.createElement('br'), deliveryFee);
            appendCell(row, product);

            const status = document.createElement('span');
            status.className = 'order-status';
            status.textContent = order.status || 'Pending';
            appendCell(row, status);
            ordersTbody.appendChild(row);
        });
    }

    function renderCustomRequests(requests) {
        requestsTbody.replaceChildren();
        if (requests.length === 0) {
            appendEmptyRow(requestsTbody, 11, 'No custom requests yet.');
            return;
        }

        requests.forEach(request => {
            const row = document.createElement('tr');
            appendCell(row, formatDate(request));

            const customer = document.createElement('div');
            const customerName = document.createElement('strong');
            customerName.textContent = request.name || 'Unknown customer';
            const email = document.createElement('small');
            email.className = 'order-contact';
            email.textContent = request.email || 'No email provided';
            customer.append(customerName, document.createElement('br'), email);
            appendCell(row, customer);

            const contact = document.createElement('span');
            contact.className = 'request-details';
            contact.textContent = [
                request.phone,
                request.facebookName ? `Facebook: ${request.facebookName}` : ''
            ].filter(Boolean).join(' · ');
            appendCell(row, contact);

            appendCell(row, request.paymentMethod || 'Not provided');

            const fulfillment = document.createElement('div');
            const fulfillmentType = document.createElement('strong');
            fulfillmentType.textContent = request.fulfillment || 'Not provided';
            const deliveryFee = document.createElement('small');
            deliveryFee.className = 'order-contact';
            deliveryFee.textContent = request.deliveryFeeStatus === 'Quote required'
                ? 'Fee to be quoted'
                : 'No delivery fee';
            fulfillment.append(fulfillmentType, document.createElement('br'), deliveryFee);
            appendCell(row, fulfillment);

            const address = document.createElement('p');
            address.className = 'request-details';
            address.textContent = request.fulfillment === 'Delivery'
                ? request.deliveryAddress || 'No address provided'
                : 'Pickup';
            appendCell(row, address);

            appendCell(row, request.color || 'Not specified');
            const selectedFlowers = document.createElement('ul');
            selectedFlowers.className = 'request-flowers';
            (Array.isArray(request.selectedFlowers) ? request.selectedFlowers : []).forEach(flower => {
                const item = document.createElement('li');
                item.textContent = `${flower.name || 'Flower'} (${formatCurrency(flower.price)})`;
                selectedFlowers.appendChild(item);
            });
            if (!selectedFlowers.childElementCount) {
                const item = document.createElement('li');
                item.textContent = 'No flowers selected';
                selectedFlowers.appendChild(item);
            }
            appendCell(row, selectedFlowers);
            const details = document.createElement('p');
            details.className = 'request-details';
            details.textContent = request.details || 'No details provided';
            appendCell(row, details);

            const isContacted = request.status === 'Contacted';
            const status = document.createElement('span');
            status.className = 'order-status';
            status.textContent = isContacted ? 'Contacted' : 'New';
            appendCell(row, status);

            const action = document.createElement('button');
            action.type = 'button';
            action.className = 'btn btn-small btn-outline';
            action.dataset.requestId = request.id;
            action.textContent = isContacted ? 'Contacted' : 'Mark Contacted';
            action.disabled = isContacted;
            appendCell(row, action);
            requestsTbody.appendChild(row);
        });
    }

    async function renderAdmin() {
        showStatus('Loading dashboard…');
        try {
            const [products, flowers, testimonials, orders, requests] = await Promise.all([
                getProducts(),
                getCustomFlowers(),
                getTestimonials(),
                getOrders(),
                getCustomRequests()
            ]);
            totalProductsEl.textContent = products.length.toLocaleString();
            totalOrdersEl.textContent = orders.length.toLocaleString();
            const totalSales = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
            totalSalesEl.textContent = formatCurrency(totalSales);
            totalRequestsEl.textContent = requests.filter(request => request.status !== 'Contacted').length.toLocaleString();
            renderProducts(products);
            renderCustomFlowers(flowers);
            renderTestimonials(testimonials);
            renderOrders(orders);
            renderCustomRequests(requests);
            clearStatus();
        } catch (error) {
            console.error('Could not load the admin dashboard:', error);
            showStatus(`Could not load dashboard data. ${error.message}`, true);
        }
    }

    loginForm.addEventListener('submit', async event => {
        event.preventDefault();
        loginError.hidden = true;
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In…';
        try {
            await requireFirebaseAuth().signInWithEmailAndPassword(
                document.getElementById('login-email').value.trim(),
                document.getElementById('login-password').value
            );
        } catch (error) {
            console.error('Admin sign-in failed:', error);
            showLoginError(error.message || 'Sign-in failed. Please try again.');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    logoutBtn.addEventListener('click', async () => {
        logoutBtn.disabled = true;
        try {
            await requireFirebaseAuth().signOut();
        } catch (error) {
            console.error('Could not sign out:', error);
            showStatus(`Could not sign out. ${error.message}`, true);
        } finally {
            logoutBtn.disabled = false;
        }
    });

    productsTbody.addEventListener('click', async event => {
        const button = event.target instanceof Element
            ? event.target.closest('button[data-product-id]')
            : null;
        if (!button) return;
        const productId = button.dataset.productId;
        if (!confirm('Remove this product from the store?')) return;

        button.disabled = true;
        try {
            await removeProduct(productId);
            await renderAdmin();
            showStatus('Product removed.');
        } catch (error) {
            console.error('Could not remove product:', error);
            showStatus(`Could not remove product. ${error.message}`, true);
            button.disabled = false;
        }
    });

    flowersTbody.addEventListener('click', async event => {
        const button = event.target instanceof Element
            ? event.target.closest('button[data-flower-id]')
            : null;
        if (!button || !confirm('Remove this flower from the custom bouquet choices?')) return;

        button.disabled = true;
        try {
            await removeCustomFlower(button.dataset.flowerId);
            await renderAdmin();
            showStatus('Flower removed from custom bouquet choices.');
        } catch (error) {
            console.error('Could not remove flower:', error);
            showStatus(`Could not remove flower. ${error.message}`, true);
            button.disabled = false;
        }
    });

    testimonialsTbody.addEventListener('click', async event => {
        const button = event.target instanceof Element
            ? event.target.closest('button[data-testimonial-id]')
            : null;
        if (!button || !confirm('Remove this customer story from the website?')) return;

        button.disabled = true;
        try {
            await removeTestimonial(button.dataset.testimonialId);
            await renderAdmin();
            showStatus('Customer story removed from the website.');
        } catch (error) {
            console.error('Could not remove customer story:', error);
            showStatus(`Could not remove customer story. ${error.message}`, true);
            button.disabled = false;
        }
    });

    requestsTbody.addEventListener('click', async event => {
        const button = event.target instanceof Element
            ? event.target.closest('button[data-request-id]')
            : null;
        if (!button) return;

        button.disabled = true;
        try {
            await updateCustomRequestStatus(button.dataset.requestId, 'Contacted');
            await renderAdmin();
            showStatus('Custom request marked as contacted.');
        } catch (error) {
            console.error('Could not update custom request:', error);
            showStatus(`Could not update custom request. ${error.message}`, true);
            button.disabled = false;
        }
    });

    addProductForm.addEventListener('submit', async event => {
        event.preventDefault();
        const nameInput = document.getElementById('add-name');
        const priceInput = document.getElementById('add-price');
        const imageInput = document.getElementById('add-image');
        const name = nameInput.value.trim();
        const price = Number(priceInput.value);
        const image = imageInput.value.trim();
        const submitButton = addProductForm.querySelector('button[type="submit"]');

        if (!name || !image || !Number.isFinite(price) || price <= 0) {
            showStatus('Enter a product name, a valid image path, and a price greater than zero.', true);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Adding…';
        clearStatus();
        try {
            await addProduct({ name, price, image });
            addProductForm.reset();
            await renderAdmin();
            showStatus('Product added to the store.');
        } catch (error) {
            console.error('Could not add product:', error);
            showStatus(`Could not add product. ${error.message}`, true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Product';
        }
    });

    addFlowerForm.addEventListener('submit', async event => {
        event.preventDefault();
        const name = document.getElementById('add-flower-name').value.trim();
        const price = Number(document.getElementById('add-flower-price').value);
        const image = document.getElementById('add-flower-image').value.trim();
        const submitButton = addFlowerForm.querySelector('button[type="submit"]');

        if (!name || !image || !Number.isFinite(price) || price <= 0) {
            showStatus('Enter a flower name, a valid image path, and a price greater than zero.', true);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Adding…';
        clearStatus();
        try {
            await addCustomFlower({ name, price, image });
            addFlowerForm.reset();
            await renderAdmin();
            showStatus('Flower added to the custom bouquet choices.');
        } catch (error) {
            console.error('Could not add flower:', error);
            showStatus(`Could not add flower. ${error.message}`, true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Flower';
        }
    });

    addTestimonialForm.addEventListener('submit', async event => {
        event.preventDefault();
        const name = document.getElementById('testimonial-name').value.trim();
        const image = document.getElementById('testimonial-image').value.trim();
        const feedback = document.getElementById('testimonial-feedback').value.trim();
        const consentConfirmed = document.getElementById('testimonial-consent').checked;
        const submitButton = addTestimonialForm.querySelector('button[type="submit"]');

        if (!name || !image || !feedback || !consentConfirmed) {
            showStatus('Enter a display name, photo path, feedback, and confirm the customer gave permission.', true);
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Publishing…';
        clearStatus();
        try {
            await addTestimonial({ name, image, feedback, consentConfirmed });
            addTestimonialForm.reset();
            await renderAdmin();
            showStatus('Customer story published.');
        } catch (error) {
            console.error('Could not publish customer story:', error);
            showStatus(`Could not publish customer story. ${error.message}`, true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Publish Story';
        }
    });

    function showSignedOutState() {
        setDashboardVisible(false);
        clearStatus();
    }

    if (typeof db === 'undefined' || !db || typeof auth === 'undefined' || !auth) {
        showSignedOutState();
        loginBtn.disabled = true;
        const setupMessage = typeof firebaseInitializationError !== 'undefined'
            ? firebaseInitializationError.message
            : 'Firebase Authentication and Firestore must be configured to use the admin dashboard.';
        showLoginError(setupMessage);
        return;
    }

    auth.onAuthStateChanged(async user => {
        if (!user) {
            showSignedOutState();
            return;
        }

        try {
            const token = await user.getIdTokenResult();
            if (token.claims.admin !== true) {
                showLoginError('This account does not have administrator access.');
                await auth.signOut();
                return;
            }
            loginError.hidden = true;
            setDashboardVisible(true);
            await renderAdmin();
        } catch (error) {
            console.error('Could not verify administrator access:', error);
            setDashboardVisible(false);
            showLoginError(`Could not verify administrator access. ${error.message}`);
        }
    }, error => {
        console.error('Firebase authentication state error:', error);
        showSignedOutState();
        showLoginError(`Authentication is unavailable. ${error.message}`);
    });
});
