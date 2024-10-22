require('dotenv').config();
const puppeteer = require('puppeteer');
const config = require("../resources/config");
const selectors = require("../resources/selectors");


async function login(page) {
    await page.waitForSelector(selectors.loginPage.IdField);
    await page.type(selectors.loginPage.IdField, process.env.ID);
    await page.type(selectors.loginPage.PasswordField, process.env.PASSWORD);
    
    await Promise.all([
      await page.click(selectors.loginPage.submitBtn),
      page.waitForNavigation({ waitUntil: 'networkidle0' })  
    ]);
};

module.exports = { login };