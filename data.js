// data.js - Firebase Firestore Database Integration

const firebaseConfig = {
    apiKey: "AIzaSyDPDYQl13tyIiYbc-MgME8h6SyWjDxSUJM",
    authDomain: "petalea-2c2a1.firebaseapp.com",
    projectId: "petalea-2c2a1",
    storageBucket: "petalea-2c2a1.firebasestorage.app",
    messagingSenderId: "692225315937",
    appId: "1:692225315937:web:701bbcf7a13dc12514c620",
    measurementId: "G-XLNKPTYL82"
};

let db = null;
let auth = null;
let firebaseInitializationError = null;

try {
    const configValues = Object.values(firebaseConfig);
    const configIsComplete = configValues.every(value =>
        typeof value === 'string' &&
        value.length > 0 &&
        !value.includes('YOUR_') &&
        value !== 'MESSAGING_ID' &&
        value !== 'APP_ID'
    );

    if (!configIsComplete) {
        throw new Error('Firebase is not configured. Add your Firebase web app settings in data.js.');
    }
    if (typeof firebase === 'undefined') {
        throw new Error('The Firebase SDK could not be loaded. Check your internet connection and script URL.');
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    db = firebase.firestore();
    if (firebase.auth) {
        auth = firebase.auth();
    }
} catch (error) {
    firebaseInitializationError = error;
    console.error('Firebase initialization failed:', error);
}

function requireFirestore() {
    if (!db) {
        throw firebaseInitializationError || new Error('Firestore is unavailable.');
    }
    return db;
}

function requireFirebaseAuth() {
    if (!auth) {
        throw firebaseInitializationError || new Error('Firebase Authentication is unavailable.');
    }
    return auth;
}

// -------------------------------------
// FIREBASE ASYNC CRUD OPERATIONS
// -------------------------------------

async function getProducts() {
    const firestore = requireFirestore();
    const snapshot = await firestore.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addProduct(product) {
    const firestore = requireFirestore();
    await firestore.collection('products').add(product);
}

async function removeProduct(id) {
    const firestore = requireFirestore();
    await firestore.collection('products').doc(id).delete();
}

async function getCustomFlowers() {
    const firestore = requireFirestore();
    const snapshot = await firestore.collection('customFlowers').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addCustomFlower(flower) {
    const firestore = requireFirestore();
    await firestore.collection('customFlowers').add(flower);
}

async function removeCustomFlower(id) {
    const firestore = requireFirestore();
    await firestore.collection('customFlowers').doc(id).delete();
}

async function getTestimonials() {
    const firestore = requireFirestore();
    const snapshot = await firestore.collection('testimonials').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addTestimonial(testimonial) {
    const firestore = requireFirestore();
    const savedTestimonial = {
        ...testimonial,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toLocaleString()
    };
    await firestore.collection('testimonials').add(savedTestimonial);
}

async function removeTestimonial(id) {
    const firestore = requireFirestore();
    await firestore.collection('testimonials').doc(id).delete();
}

async function getOrders() {
    const firestore = requireFirestore();
    const snapshot = await firestore.collection('orders').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addOrder(order) {
    const firestore = requireFirestore();
    const savedOrder = {
        ...order,
        total: Number(order.total),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toLocaleString()
    };
    await firestore.collection('orders').add(savedOrder);
}

async function getCustomRequests() {
    const firestore = requireFirestore();
    const snapshot = await firestore.collection('customRequests').orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addCustomRequest(request) {
    const firestore = requireFirestore();
    const savedRequest = {
        ...request,
        deliveryAddress: request.fulfillment === 'Delivery' ? request.deliveryAddress : '',
        status: 'New',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toLocaleString()
    };
    await firestore.collection('customRequests').add(savedRequest);
}

async function updateCustomRequestStatus(id, status) {
    const firestore = requireFirestore();
    await firestore.collection('customRequests').doc(id).update({ status });
}
