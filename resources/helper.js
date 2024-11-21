require('dotenv').config();
const puppeteer = require('puppeteer');
const config = require("../resources/config");
const selectors = require("../resources/selectors");


async function login(page, validLogin = true) {
    await page.waitForSelector(selectors.loginPage.id);

    if(validLogin) {
        await page.type(selectors.loginPage.id, process.env.ID);
        await page.type(selectors.loginPage.password, process.env.PASSWORD);
    } else {
        await page.type(selectors.loginPage.id, process.env.INVALID_ID);
        await page.type(selectors.loginPage.password, process.env.PASSWORD);
    }
    await page.click(selectors.loginPage.submit);
}

async function waitAndClick(page, selector) {
    await page.waitForSelector(selector);
    await page.click(selector);
}

async function waitAndType(page, selector, text) {
    await page.waitForSelector(selector);
    await page.type(selector, text);
}

module.exports = { login, waitAndClick, waitAndType };