//Run "npm install csv" to install the full csv module or run npm install csv-parse 
//if you are only interested by the CSV parser.
import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect, Page } from '@playwright/test';
//const assert = require('assert')
import { parse } from 'csv-parse/sync';
//Read the CSV file and convert to JS object in terms of JSON

type WebOrderRecord = {
  uname: string;
  pass: string;
  Exp_Result: string;
  [key: string]: any;
};

const records: WebOrderRecord[] = parse (readFileSync ('./tests/TestData/webOrder_Login_all_Scenarioc.csv'),
 {
  columns: true,
  skip_empty_lines: true
});

// const records = parse(readFileSync(join('./tests/TestData', 'WebOrder_Login_All_Scenario.csv')), {
//   columns: true,
//   skip_empty_lines: true
// });

//const orders = JSON.parse(records.toString());
test.describe('WebOrder All Test Scenario', () => {
  let page: Page;
  //Page can be directly used in test not in hooks, in hooks we can use browser and assign new page to page
  test.beforeAll(async ({ browser }) => {
    //const browser = await chromium.launch();
    page = await browser.newPage();

    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  })

  test('WebOrder App', async () => {
    for (const record of records) {
      //console.log(records)
      //console.log(record.uname, record.pass);
      await page.locator('input[name="ctl00\\$MainContent\\$username"]').clear();
      await page.fill('input[name="ctl00\\$MainContent\\$username"]', record.uname);
      await page.locator('input[name="ctl00\\$MainContent\\$password"]').clear();
      // Fill input[name="ctl00\$MainContent\$password"]
      await page.fill('input[name="ctl00\\$MainContent\\$password"]', record.pass);

      // Click text=Login
      await page.click('text=Login');
      if ('List of All Orders' == record.Exp_Result) {

        await expect(page.locator("div[class='content'] h2")).toContainText(record.Exp_Result)
        await page.click('text=Logout');
        await page.waitForLoadState(); // The promise resolves after 'load' event.
       //} else if ('Invalid Login or Password.' == record.Exp_Result) {
      //   const name = await page.$eval("#ctl00_MainContent_status", el => el.textContent.trim())
        // const name = await page.locator("#ctl00_MainContent_status")
      } 
      else 
        // Check that the locator has the expected text
        await expect(page.locator("span[id='ctl00_MainContent_status']")).toHaveText(record.Exp_Result)


      }

   })
  })