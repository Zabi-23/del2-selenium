
const axios = require('axios');

const BASE_URL = "https://fakestoreapi.com";

// === Test 1 get /products => status 200

async function getProductsTest() {

    const response = await axios.get(`${BASE_URL}/products`);
    if (response.status !== 200) {
        throw new Error("Get Products Test Failed");
    }

    console.log("Get Products Test Passed");

}
// === Test 2 kontrollera antal produkter

async function getProductsCountTest() {

    const response = await axios.get(`${BASE_URL}/products`);
    const products = response.data;
   
    if (!Array.isArray(products) || products.length !== 20) {
        throw new Error("Get Products Count Test Failed");
    }

    if (products.length === 0) {
        throw new Error("Get Products Count Test Failed - No products found");
    }

    console.log(`Get Products Count Test Passed (${products.length} products found)`);

}

// === test 3  kontrollera fält i produkt

async function testProductFields() {
    const response = await axios.get(`${BASE_URL}/products/1`);
    const product = response.data;

    if (!product.title || !product.price || !product.category) {
        throw new Error("Product is missing required fields");
    }

    console.log("Product fields (title, price, category) OK");
}

// ==== Test kontrollera produkt ID =====

async function testProductId() {
    const response = await axios.get(`${BASE_URL}/products/1`);
    const product = response.data;

    if (product.id !== 1) {
        throw new Error("Product ID is incorrect");
    }

    console.log("Product ID OK");
}
// ===== KÖR ALLA API-TESTER =====
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
