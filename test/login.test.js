
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const {Builder, By, until} = require('selenium-webdriver');

let driver;

async function startBrowser() {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://www.saucedemo.com/");
}

async function stopBrowser() {
    if (driver) {
        await driver.quit();
    }
}

// Test 1: Rätt användernamn och lösenord

async function loginSuccessTest() {
    await startBrowser();

    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(until.urlIs("https://www.saucedemo.com/inventory.html"), 5000);

    console.log("Login Success Test Passed");

    await sleep(12000); 

    await stopBrowser();
}



// test 2: felakt användernamn

async function loginWrongUsernameTest() {
    await startBrowser();

    await driver.findElement(By.id("user-name")).sendKeys("wrong_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();

    const errorMessage = await driver
        .findElement(By.css(".error-message-container"))
        .getText();

    if (!errorMessage.includes("Epic sadface")) {
        throw new Error("Login Wrong Username Test Failed");
    }

    console.log("Login Wrong Username Test Passed");

    // 👉 Visa felmeddelandet i 5 sek
    await sleep(5000);

    await stopBrowser();
}

// Test 3: fel lösenord

async function loginFailTest() {
    await startBrowser();

    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("wrong_password");
    await driver.findElement(By.id("login-button")).click();

    const errorMessage = await driver
        .findElement(By.css(".error-message-container"))
        .getText();

    if (!errorMessage.includes("Epic sadface")) {
        throw new Error("Login Fail Test Failed");
    }

    console.log("Login Fail Test Passed");

    // 👉 Visa felmeddelandet i 5 sek
    await sleep(5000);

    await stopBrowser();
}



// ===== KÖR ALLA TESTER =====
(async function runAllTests() {
    try {
        await loginSuccessTest();
        console.log("✅ Test 1 (lyckad inloggning) OK");

        await loginWrongUsernameTest();
        console.log("✅ Test 2 (fel användarnamn) OK");

        await loginFailTest();
        console.log("✅ Test 3 (fel lösenord) OK");
    } catch (error) {
        console.error("❌ Ett test misslyckades:", error.message);
        process.exit(1);
    }
})();
