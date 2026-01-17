// test/login.test.js

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let driver;

async function startBrowser() {
    const options = new chrome.Options();

    // 👇 Krävs för CI (och funkar lokalt)
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.get("https://www.saucedemo.com/");
}

async function stopBrowser() {
    if (driver) {
        await driver.quit();
    }
}

// ===== TEST 1: RÄTT ANVÄNDARNAMN =====
async function loginSuccessTest() {
    await startBrowser();

    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();

    await driver.wait(
        until.urlIs("https://www.saucedemo.com/inventory.html"),
        5000
    );

    console.log("Login Success Test Passed");

    // ⛔ sleep används bara lokalt – CI bryr sig inte
    await sleep(3000);

    await stopBrowser();
}

// ===== TEST 2: FEL ANVÄNDARNAMN =====
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

    await sleep(2000);
    await stopBrowser();
}

// ===== TEST 3: FEL LÖSENORD =====
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

    await sleep(2000);
    await stopBrowser();
}

// ===== KÖR ALLA TESTER =====
(async function runAllTests() {
    try {
        await loginSuccessTest();
        console.log("✅ Test 1 OK");

        await loginWrongUsernameTest();
        console.log("✅ Test 2 OK");

        await loginFailTest();
        console.log("✅ Test 3 OK");
    } catch (error) {
        console.error("❌ Ett test misslyckades:", error.message);
        process.exit(1);
    }
})();

