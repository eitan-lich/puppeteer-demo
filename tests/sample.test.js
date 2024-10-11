const puppeteer = require('puppeteer');
const config = require("../resources/config")

const baseURL = config.baseURL;

describe('Puppeteer Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false });
    //page = await browser.newPage();
  });

  beforeEach(async () => {
    await page.goto(baseURL);
  })

  afterAll(async () => {
    await browser.close();
  });

  test('should load the page and check the title', async () => {
    const title = await page.title();
    expect(title).toBe('YouTube');
  });

  test('should find an element and click it', async () => {
    await page.click('a'); 

    await page.waitForNavigation();
    const newUrl = page.url();
    expect(newUrl).toBe('https://www.iana.org/domains/reserved');
  });

  test('should check the content of an element', async () => {
    const content = await page.$eval('h1', (element) => element.textContent);
    expect(content).toBe('Example Domain');
  });
});