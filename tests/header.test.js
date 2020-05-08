const puppeteer = require('puppeteer');
const timeout = 120000;
describe("Blogster Test Suite", () => {

    let page;
    let browser;

    test('adds two numbers', () => {
        const sum = 1+2;
        expect(sum).toEqual(3);
    });

    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: false
        })

        page = await browser.newPage();
        await page.goto('localhost:3000');
        
    }, timeout)

    test("Title should be blogster", async () => {
        
        const text = await page.$eval('a.brand-logo', el => el.innerHTML);
        expect(text).toEqual("Blogster");
        
    }) ;
    

    test("Clicking login starts login workflow.",  async () => {
          
         await page.click('.right a' );
          let url = await page.url();
          console.log(url);  

          //match the url on a fuzzy match.
          expect(url).toMatch(/accounts\.google\.com/);  
    });


    afterEach(async () => {
       await browser.close();
    });

})

