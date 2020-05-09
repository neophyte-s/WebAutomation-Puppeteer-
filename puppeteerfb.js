let puppeteer = require("puppeteer");
let cFile = process.argv[2];
let fs = require("fs");
let pUrl = process.argv[3];
let nPost = process.argv[4];
(async function () {
  try {
    let data = await fs.promises.readFile(cFile);
    let { url, pwd, user } = JSON.parse(data);
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized", "--disable-notifications"]
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto(url, { waitUntil: "load" });
    await tab.waitForSelector("input[type=email]");
    await tab.type("input[type=email]", user, { delay: 120 });
    await tab.type("input[type=password]", pwd, { delay: 120 });
    await Promise.all([
      tab.click(".login_form_login_button"), tab.waitForNavigation({
        waitUntil: "load"
      })
    ])
    await tab.goto(pUrl, { waitUntil: "load" });
    await tab.waitForSelector("div[data-key=tab_posts]");
    await Promise.all([
      tab.click("div[data-key=tab_posts]"),
      tab.waitForNavigation({waitUntil:"load"})
    ])
    await tab.waitForNavigation({waitUntil:"load"});
     
    let idx = 0;
    do { 
      await tab.waitForSelector("#pagelet_timeline_main_column ._1xnd .clearfix.uiMorePager");

      let elements = await tab.$$("#pagelet_timeline_main_column ._1xnd > ._4-u2._4-u8") ;
      let post = elements[idx];
      await tab.waitForSelector("._666k ._8c74");
      let like = await post.$("._666k ._8c74");
      await like.click({delay:100});
      idx++;
      await tab.waitForSelector(".uiMorePagerLoader", { hidden: true })
    } while (idx < nPost)
    console.log("All posts liked!!");
  } catch (err) {
    console.log("Error is :"+err);
  }
})()
