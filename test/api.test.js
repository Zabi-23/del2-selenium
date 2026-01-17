const axios = require("axios");

const api = axios.create({
    baseURL: "https://fakestoreapi.com",
    headers: {
        "User-Agent": "Mozilla/5.0 (CI Integration Test)"
    }
});

// === Test 1: GET /products → status 200 ===
async function getProductsTest() {
    const response = await api.get("/products");

    if (response.status !== 200) {
        throw new Error("Get Products Test Failed");
    }

    console.log("Get Products Test Passed");
}

// === Test 2: kontrollera antal produkter ===
async function getProductsCountTest() {
    const response = await api.get("/products");
    const products = response.data;

    if (!Array.isArray(products) || products.length === 0) {
        throw new Error("Get Products Count Test Failed");
    }

    console.log(`Get Products Count Test Passed (${products.length} products found)`);
}

// === Test 3: kontrollera fält ===
async function testProductFields() {
    const response = await api.get("/products/1");
    const product = response.data;

    if (!product.title || !product.price || !product.category) {
        throw new Error("Product is missing required fields");
    }

    console.log("Product fields OK");
}

// === Test 4: kontrollera produkt-ID ===
async function testProductId() {
    const response = await api.get("/products/1");
    const product = response.data;

    if (product.id !== 1) {
        throw new Error("Product ID incorrect");
    }

    console.log("Product ID OK");
}

// === Kör alla API-tester ===
(async function runApiTests() {
    try {
        await getProductsTest();
        await getProductsCountTest();
        await testProductFields();
        await testProductId();

        console.log("✅ Alla API-tester passerade");
    } catch (error) {
        console.error("❌ API-test misslyckades:", error.message);
        process.exit(1);
    }
})();
