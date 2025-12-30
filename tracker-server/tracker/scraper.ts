import { chromium, Browser, Page } from 'playwright';
import axios from 'axios';
import { join } from 'path';
import { existsSync, mkdirSync, createWriteStream } from 'fs';

let browser: Browser;
let page: Page;

async function initBrowser(): Promise<void> {
    // Reuse browser/page if already initialized to avoid concurrent launches
    if (browser && page) {
        console.log("\x1b[33mBrowser already initialized\x1b[0m");
        return;
    }
    try {
        browser = await chromium.launch({ headless: true });
        console.log("Browser opened");
        page = await browser.newPage();
        console.log("New tab opened");
    } catch (error) {
        console.error("\x1b[31mError opening browser or new tab: \x1b[0m" + error, "\n");
        // ensure clean state
        browser = null;
        page = null;
        throw error;
    }
}
async function closeBrowser() {
    if (!browser) {
        console.log("\x1b[33mNo browser to close\x1b[0m");
        return;
    }
    try {
        await browser.close();
        console.log("Browser closed");
    } catch (error) {
        console.error("\x1b[31mError closing browser: \x1b[0m" + error, "\n");
    }
    // Kosongin variabel
    browser = null;
    page = null;
}
async function chapterScraper(url: string) {
    try {
        console.log("Going to url...");
        await page.goto(url);

        await page.waitForSelector('button[data-key="chapters"]')
        await page.click('button[data-key="chapters"]')
        await page.waitForTimeout(6000);

        const list = await page.$$eval('#chapter-list > div', x =>
            x.map(y => y.getAttribute('data-chapter-number')) //ngambil chapternya pke atribut
                .filter(Boolean)
                .map(Number));
        console.log(`Scraped ${list.length} chapters`);
        return list;
    } catch (error) {
        console.error("\x1b[31mError while scraping chapter: \x1b[0m", error, "\n");
        return null;
    }
}

// Only used on init
async function titleScraper(url) {
    try {
        await page.goto(url);
        await page.waitForSelector('h1[itemprop="name"]');
        console.log(`Title scraped`)
        return page.textContent('h1[itemprop="name"]');
    } catch (error) {
        console.error("\x1b[31mError while scraping title: \x1b[0m", error, "\n");
    }
}
async function descScraper(url) {
    try {
        await page.goto(url);
        await page.waitForSelector('#tabpanel-description');
        console.log(`Description scraped`)
        return page.textContent('#tabpanel-description div[itemprop="description"]:nth-child(2)');
    } catch (error) {
        console.error("\x1b[31mError while scraping description: \x1b[0m", error, "\n");
    }
}
async function coverScraper(url, title) { //Cmn ngambil url gambarnya doang, ngesavenya pake fungsi lain
    try {
        await page.goto(url);
        await page.waitForSelector('div[itemprop="image"]');
        const img = await page.$('div[itemprop="image"] img');
        const imgUrl = await img.getAttribute('src');
        console.log(`Image URL scraped`)

        const dirPath = join(__dirname, '..', '..', 'data', 'media');
        const fileName = `${title.replaceAll(' ', '').toLowerCase()}.png`;
        const filePath = join(dirPath, fileName);
        await saveCover(imgUrl, dirPath, filePath);
        return filePath;
    } catch (error) {
        console.error("\x1b[31mError while scraping cover: \x1b[0m", error, "\n");
    }
}
async function saveCover(url, dir, full) { //Jgn diapus fullnya wkwkwkw
    const res = await axios({
        method: "get",
        url: url,
        responseType: 'stream'
    });
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`\x1b[33mNo directory, created one\x1b[0m`);
    };
    if (!existsSync(full)) {
        const write = createWriteStream(full);
        await res.data.pipe(write);
        write.on('finish', () => {
            console.log("\x1b[32mImage saved in \x1b[0m", dir);
        });
    };
}
export {
    initBrowser,
    closeBrowser,
    chapterScraper,
    titleScraper,
    descScraper,
    coverScraper
}