
const axios = require("axios");

// 🔴 FakeStore blockerar ibland CI → hoppa över i CI
if (process.env.CI === "true") {
    console.log("ℹ️ API-tester hoppas över i CI (FakeStore API blockerar CI)");
    process.exit(0);
}

const api = axios.create({
    baseURL: "https://fakestoreapi.com",
    headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    }
});

// === Test 1: GET /products → status 200 ===
async function getProductsTest() {
    const response = await api.get("/products");

    if (response.status !== 200) {
        throw new Error("GET /products did not return status 200");
    }

    console.log("GET /products status 200 OK");
}

// === Test 2: kontrollera antal produkter ===
async function getProductsCountTest() {
    const response = await api.get("/products");
    const products = response.data;

    if (!Array.isArray(products) || products.length === 0) {
        throw new Error("No products returned");
    }

    console.log(`Product count OK (${products.length} products)`);
}

// === Test 3: kontrollera fält ===
async function testProductFields() {
    const response = await api.get("/products/1");
    const product = response.data;

    if (!product.title || !product.price || !product.category) {
        throw new Error("Missing required product fields");
    }

    console.log("Product fields OK");
}

// === Test 4: kontrollera produkt-ID ===
async function testProductId() {
    const response = await api.get("/products/1");
    const product = response.data;

    if (product.id !== 1) {
        throw new Error("Incorrect product ID");
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
