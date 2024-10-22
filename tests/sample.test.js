require('dotenv').config();
const puppeteer = require('puppeteer');
const config = require("../resources/config");
const selectors = require("../resources/selectors");
const { login } = require("../resources/helper");

describe('Handesaim Tel-Aviv Sanity', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
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
      
      await Promise.all([
        await page.click(selectors.loginPage.submitBtn),
        page.waitForNavigation({ waitUntil: 'networkidle0' })  
      ]);

      const gradeExist = await page.waitForSelector(selectors.loginPage.gradeExistPath);
      expect(gradeExist).not.toBeNull();
    });

    test('Should fail with invalid ID or password', async () => {
      await page.waitForSelector(selectors.loginPage.IdField);
      await page.type(selectors.loginPage.IdField, process.env.INVALID_ID);
      await page.type(selectors.loginPage.PasswordField, process.env.PASSWORD);
      
      await Promise.all([
        await page.click(selectors.loginPage.submitBtn),
        page.waitForNavigation({ waitUntil: 'networkidle0' })  
      ]);

      const errorDialog = await page.waitForSelector(selectors.loginPage.incorrectCredentials);
      const errorDialogText = await errorDialog.evaluate(el => el.textContent);
      expect(errorDialogText).toBe("הסיסמה או תעודה הזהות שהוקלדה שגויה (קוד 6)  יש לשים לב, זוהי כניסת סטודנטלחץ back ונסה שנית");
    });
  });


  describe("Navigaton buttons tests", () => {
    test("Grades button", async () => {
      await login(page);

      Promise.all([
        await page.waitForSelector(selectors.mainPage.gradeBtnMain),
        await page.click(selectors.mainPage.gradeBtnMain),
        await page.waitForSelector(selectors.mainPage.gradeBtnSub),
        await page.click(selectors.mainPage.gradeBtnSub),
        await page.waitForNavigation({ waitUntil: "networkidle0"}),
        await page.waitForSelector(selectors.gradePage.confirmBtn),
        await page.click(selectors.gradePage.confirmBtn),
        await page.waitForNavigation({ waitUntil: "networkidle0"})
      ])

      await page.waitForSelector(selectors.gradePage.gradeHeader);
      
      const gradeHeaderText = await page.$eval(selectors.gradePage.gradeHeader, (val) =>  val.textContent.trim());
      expect(gradeHeaderText).toBe("גליון ציונים");
    });

    xtest("Exams button", async () => {

    });

    xtest("Schedule button", async () => {

    });

    xtest("Courses button", async () => {

    });

    xtest("Finances button", async () => {

    });

    xtest("General button", async () => {

    });

  });
});