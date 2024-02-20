import puppeteer from "puppeteer";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });  

  const page = await browser.newPage();

    await page.goto(`https://libgen.rs/search.php?req=%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%BE%E0%A6%A6%E0%A6%A8%E0%A6%BE%20%E0%A6%85%E0%A6%A8%E0%A6%BF%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%A3%20%E0%A6%AE%E0%A7%81%E0%A6%96%E0%A7%8B%E0%A6%AA%E0%A6%BE%E0%A6%A7%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A7%9F&column[]=author`, {
      waitUntil: "domcontentloaded",
    });

  const quotes = await page.evaluate(() => {
    const quoteList = document.querySelectorAll(".c > tbody > tr");

    return Array.from(quoteList).map((quote) => {
      const link1 = quote.querySelector("td:nth-of-type(10) a");

      return link1 ? link1.href : null;
      // return link1.href;
    });
  });
    
  console.log(quotes);

  await browser.close();
};

getQuotes();