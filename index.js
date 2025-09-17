import puppeteer from "puppeteer";
import fs from "fs";
// const fs = require("fs");

const fileName = 'data.json';

// Check if the file exists
if (!fs.existsSync(fileName)) {
  // If the file does not exist, create it with an empty array
  fs.writeFileSync(fileName, `{"data": []}`);
}

const data = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
// TODO: Now it's your turn to improve the scraper and make him get more data from the Quotes to Scrape website.
// Here's a list of potential improvements you can make:
// - Navigate between all pages using the "Next" button and fetch the quotes on all the pages
// - Fetch the quote's tags (each quote has a list of tags)
// - Scrape the author's about page (by clicking on the author's name on each quote)
// - Categorize the quotes by tags or authors (it's not 100% related to the scraping itself, but that can be a good improvement)

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  // https://libgen.rs/search.php?mode=last
  // 41995
  let quotes;

  for (let pageNo = 1; pageNo <= 10; pageNo++) {
    await page.goto(`https://libgen.is/search.php?mode=last&view=simple&phrase=1&res=100&timefirst=&timelast=&sort=def&sortmode=ASC&page=${pageNo}`, {
      waitUntil: "domcontentloaded",
    });

    // Get page data
    quotes = await page.evaluate(() => {
      // Fetch the first element with class "quote"
      // Get the displayed text and returns it
      const quoteList = Array.from(document.querySelectorAll(".c > tbody > tr")).slice(1);

      // Convert the quoteList to an iterable array
      // For each quote fetch the text and author
      return quoteList.map((quote) => {
        // Get the sub-elements from the previously fetched quote element
        const id = quote.querySelector("td:nth-of-type(1)").innerText;
        const author = quote.querySelector("td:nth-of-type(2)").innerText;
        const title = quote.querySelector("td:nth-of-type(3)").innerText;
        const publisher = quote.querySelector("td:nth-of-type(4)").innerText;
        const year = quote.querySelector("td:nth-of-type(5)").innerText;
        const pages = quote.querySelector("td:nth-of-type(6)").innerText;
        const language = quote.querySelector("td:nth-of-type(7)").innerText;
        const size = quote.querySelector("td:nth-of-type(8)").innerText;
        const extension = quote.querySelector("td:nth-of-type(9)").innerText;
        let link1 = quote.querySelector("td:nth-of-type(10) a");
        link1 = link1 ? link1.href : null;
        let link2 = quote.querySelector("td:nth-of-type(11) a").href;
        link2 = link2 ? link2.href : null;

        return { id, author, title, publisher, year, pages, language, size, extension, link1, link2 };
      });
    });

    // data.push(quotes);
    data.data.push(quotes);
  }

  // fs.writeFileSync('./data.json', JSON.stringify(data));
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2)); // null, 2 for pretty printing
  console.log('New data added to the file');

  // Display the quotes
  // console.log(quotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();
