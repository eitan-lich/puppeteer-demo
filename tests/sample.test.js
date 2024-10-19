require('dotenv').config();
const puppeteer = require('puppeteer');
const config = require("../resources/config");
const selectors = require("../resources/selectors");

describe('Handesaim Tel-Aviv Sanity', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"]
    });
    page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto(config.baseURL);
  })

  afterEach(async () => {
    await page.screenshot({ path: config.screenshotPath, fullPage: true })
  })

  afterAll(async () => {
    await browser.close();
  });

  describe("Login tests", () => {
    test('Should load the page and check the title', async () => {
      const title = await page.title();
      expect(title).toBe('הנדסאים תל אביב תחנת מידע לסטודנטים ולסטודנטיות');
    });

    test('Should login successfully with a valid ID and password', async () => {
      await page.waitForSelector(selectors.loginPage.IdField);
      await page.type(selectors.loginPage.IdField, process.env.ID);
      await page.type(selectors.loginPage.PasswordField, process.env.PASSWORD);
      await page.click(selectors.loginPage.submitBtn);

      const gradeExist = await page.waitForSelector(selectors.loginPage.gradeExistPath);
      expect(gradeExist).not.toBeNull();
    });
  });
});