document.addEventListener('DOMContentLoaded', () => {
    const productsTbody = document.getElementById('products-tbody');
    const ordersTbody = document.getElementById('orders-tbody');
    const addProductForm = document.getElementById('add-product-form');
    
    // Stats
    const totalSalesEl = document.getElementById('total-sales');
    const totalOrdersEl = document.getElementById('total-orders');
    const totalProductsEl = document.getElementById('total-products');

    function renderAdmin() {
        const products = getProducts();
        const orders = getOrders();
        
        // Render Stats
        totalProductsEl.textContent = products.length;
        totalOrdersEl.textContent = orders.length;
        const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        totalSalesEl.textContent = `₱${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Render Products
        productsTbody.innerHTML = '';
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image}" alt="${p.name}"></td>
                <td><strong>${p.name}</strong></td>
                <td>₱${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><button class="btn btn-small btn-danger" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i> Remove</button></td>
            `;
            productsTbody.appendChild(tr);
        });

        // Render Orders
        ordersTbody.innerHTML = '';
        if (orders.length === 0) {
            ordersTbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#999;padding:2rem;">No orders yet.</td></tr>`;
        }
        orders.forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${o.id}</td>
                <td>${o.date}</td>
                <td>
                    <strong>${o.customerName}</strong><br>
                    <small style="color:#666">${o.email}</small>
                </td>
                <td>
                    <img src="${o.image}" alt="Product" style="width:30px;height:30px;border-radius:4px;vertical-align:middle;margin-right:8px">
                    ${o.productName} <br>
                    <strong style="color:var(--color-accent)">₱${o.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </td>
                <td><span style="color:var(--color-accent);font-weight:600;"><i class="fas fa-circle" style="font-size:0.6rem;margin-right:4px;"></i> Pending</span></td>
            `;
            ordersTbody.appendChild(tr);
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('add-name').value;
            const price = parseFloat(document.getElementById('add-price').value);
            const image = document.getElementById('add-image').value;

            addProduct({ name, price, image });
            addProductForm.reset();
            renderAdmin();
            alert('Product added successfully!');
        });
    }

    // Make delete globally available for onclick
    window.deleteProduct = function(id) {
        if (confirm('Are you sure you want to remove this product?')) {
            removeProduct(id);
            renderAdmin();
        }
    };

    renderAdmin();
});
