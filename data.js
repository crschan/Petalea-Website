// data.js - Mock Database using LocalStorage

const defaultProducts = [
    { id: 1, name: 'Golden Sunflower', price: 450, image: 'assets/product_sunflower_1771732964722.png' },
    { id: 2, name: 'Blush Tulip Bouquet', price: 1200, image: 'assets/product_tulips_1771732979670.png' },
    { id: 3, name: 'Pastel Dream Mixed', price: 2500, image: 'assets/hero_bouquet_1771732940523.png' }
];

function initDB() {
    if (!localStorage.getItem('petalea_products')) {
        localStorage.setItem('petalea_products', JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem('petalea_orders')) {
        localStorage.setItem('petalea_orders', JSON.stringify([]));
    }
}

function getProducts() {
    return JSON.parse(localStorage.getItem('petalea_products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('petalea_products', JSON.stringify(products));
}

function addProduct(product) {
    const products = getProducts();
    product.id = Date.now();
    products.push(product);
    saveProducts(products);
}

function removeProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
}

function getOrders() {
    return JSON.parse(localStorage.getItem('petalea_orders')) || [];
}

function saveOrders(orders) {
    localStorage.setItem('petalea_orders', JSON.stringify(orders));
}

function addOrder(order) {
    const orders = getOrders();
    order.id = Date.now();
    order.date = new Date().toLocaleString();
    orders.push(order);
    saveOrders(orders);
}

// Initialize on script load
initDB();
