const puppeteer = require('puppeteer');
const config = require("../resources/config")

const baseURL = config.baseURL;

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
    await page.goto(baseURL);
  })

  afterEach(async () => {
    await page.screenshot({ path: 'screenshots/login_success.png', fullPage: true })
  })

  afterAll(async () => {
    await browser.close();
  });

  test('should load the page and check the title', async () => {
    const title = await page.title();
    expect(title).toBe('הנדסאים תל אביב תחנת מידע לסטודנטים ולסטודנטיות');
  });

  test('should login successfully with a valid ID and password', async () => {
    const IdField = "#R1C1";
    const PasswordField = "#R1C2";
    const submitBtn = "#loginbtn";
    const gradeExistPath = "xpath/.//button/span[contains(text(), 'ציונים')]";

    await page.waitForSelector(IdField)
    await page.type(IdField, "209850684");
    await page.type(PasswordField, "Fabio1965!");
    await page.click(submitBtn);

    const gradeExist = await page.$$(gradeExistPath)
    expect(gradeExist).not.toBeNull();
  });
});