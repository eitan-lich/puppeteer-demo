require('dotenv').config();
const puppeteer = require('puppeteer');
const config = require("../resources/config");
const selectors = require("../resources/selectors");
const { login, waitAndClick, waitAndType} = require("../resources/helper");

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
    test('Login successfully with valid ID and password', async () => {
      await login(page);
      const gradeExist = await page.waitForSelector(selectors.toolbar.grade);
      expect(gradeExist).not.toBeNull();
    });

    test('Login failure with invalid ID or password', async () => {
      await login(page, false);
      await page.waitForSelector(selectors.loginPage.incorrectCredentials);
      const errorDialogText = await page.$eval(selectors.loginPage.incorrectCredentials, (el) => el.textContent.trim());
      expect(errorDialogText).toBe("הסיסמה או תעודה הזהות שהוקלדה שגויה (קוד 6)  יש לשים לב, זוהי כניסת סטודנטלחץ back ונסה שנית");
    });
  });

  describe("Toolbar tests", () => {
    test("Grades", async () => {
      await login(page);
      await page.waitForSelector(selectors.toolbar.grade);
      await page.click(selectors.toolbar.grade);
      await page.waitForSelector(selectors.toolbar.gradeList);
      await page.click(selectors.toolbar.gradeList);
      await page.waitForSelector(selectors.gradePage.confirm);
      await page.click(selectors.gradePage.confirm);
      await page.waitForSelector(selectors.gradePage.header);
      
      const gradeHeaderText = await page.$eval(selectors.gradePage.header, (val) =>  val.textContent.trim());
      expect(gradeHeaderText).toBe("גליון ציונים");
    });

    test("Exams", async () => {
      await login(page);
      await waitAndClick(page, selectors.toolbar.exams);
      await waitAndClick(page, selectors.toolbar.examsBoard);
      await waitAndClick(page, selectors.examPage.confirm);

      const popup = await page.waitForSelector(selectors.examPage.modalPopup);
      expect(popup).not.toBeNull();
    });

    test("Schedule", async () => {
      await login(page);

      await waitAndClick(page, selectors.toolbar.schedule);
      const btnExist = await page.waitForSelector(selectors.schedulePage.nextMonth);
      expect(btnExist).not.toBeNull();
    });

    xtest("Courses", async () => {
      await login(page, true);
    });

    xtest("Finances", async () => {
      await login(page, true);
    });

    xtest("General", async () => {
      await login(page, true);
    });

  });
});