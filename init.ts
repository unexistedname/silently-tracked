import { readFileSync, existsSync, writeFileSync } from "fs";
import scraper from "./tracker-server/tracker/scraper";

const path:string = "./data/data.json";
const baseLink:Record<string, string> = JSON.parse(readFileSync("./data/baseLink.json", "utf-8"));

if (!existsSync(path)) {
  //bikin klo gaada
  const x:Record<string, string> = {};
  writeFileSync(path, JSON.stringify(x, null, 2), "utf8");
  console.log("No data file detected, creating a new one...");
}
type mangaData = {
  "Original Title": string;
  "Link": string;
  "Description": string;
  "Image Directory": string;
  "Chapter List": number[];
}
type dataType = Record<string, mangaData>;

const mangaData: dataType = {};
(async () => {
  try {
    await scraper.initBrowser();
    for (let [a, b] of Object.entries(baseLink)) { //a: judul, b: link
      const chapter = await scraper.chapterScraper(b);
      const title = await scraper.titleScraper(b);
      const desc = await scraper.descScraper(b);
      const image = await scraper.coverScraper(b, a);

      mangaData[a] = {
          "Original Title": title.trim(),
          "Link": b,
          "Description": desc,
          "Image Directory": image,
          "Chapter List": [...chapter],
      };
      console.log(`${a} loaded`);
    }
    writeFileSync(path, JSON.stringify(mangaData, null, 2), "utf-8");
  } catch (error) {
    console.log(error);
  } finally {
    await scraper.closeBrowser();
  }
})();

// data = JSON.parse(fs.readFileSync(path, 'utf-8'));
// data.push(c)
// console.log(...data);
