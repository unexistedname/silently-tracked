import { resolve, join } from "path";
import axios from "axios";
import { readFileSync, existsSync, writeFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

import * as Scraper from "./tracker/scraper.js";
const now: Date = new Date();

// data: For storing updated data
// baseData: For storing list of manga to be updated
// Change the content in baseData if you want to add/remove manga(s)
function createNewFile(path: string, fileName: string): string {
  writeFileSync(path, "{}", "utf-8");
  console.log(`No ${fileName} file detected, creating a new one...`);
  return "{}";
}
const dir = process.env.DATA_DIRECTORY;
if (!dir) {
  throw new Error("DATA_DIRECTORY is not defined!");
}
const baseDir = resolve(dir);
const baseDataPath = resolve("./data/baselink.json");
const dataPath = join(baseDir, "data.json");
const chapterPath = join(baseDir, "chapter.json");
const baseData = JSON.parse(readFileSync(baseDataPath, "utf-8"));
const dataStored = existsSync(dataPath)
  ? JSON.parse(readFileSync(dataPath, "utf-8") || "{}")
  : createNewFile(dataPath, "data");
const chapterStored = existsSync(chapterPath)
  ? JSON.parse(readFileSync(chapterPath, "utf-8") || "{}")
  : createNewFile(chapterPath, "chapter");

// ----main stuff----
(async () => {
  console.log(`[ MAIN | ${now.toLocaleTimeString()} ] Scraping started...`);
  for (let key in baseData) {
    if (baseData.hasOwnProperty(key)) {
      try {
        console.log(`[ MAIN ] Processing ${key}...`);
        const id: string = key.toLowerCase().replace(/\s+/g, "");
        const res = await axios.get(baseData[key]);

        console.log(`[ MAIN ] Successfully executed GET request for ${key}...`);
        const dataScrape = Scraper.metadataRK(res.data);
        const chapterScrape = await Scraper.chapter(res.data);

        console.log(`[ MAIN ] Scraping complete! working on local data...`);
        const oldChapter: string[] = chapterStored[id]?.chapter ?? [];
        let newChapter: string[] = chapterScrape.filter(
          (x) => !oldChapter.includes(x),
        );
        if (newChapter.length === 0) {
          newChapter = chapterStored[id]?.newChapter;
        }

        console.log(
          `[ MAIN ] New data has been stored to temporary variables. Stopping the program before the iteration ends will delete all progress.`,
        );
        dataStored[id] = { ...dataScrape, link: baseData[key] };
        chapterStored[id] = {
          chapter: chapterScrape,
          newChapter: newChapter,
          lastUpdate: new Date().toISOString(),
        };
      } catch (error: unknown) {
        console.error(error);
      }
    }
  }
  console.log(
    `[ MAIN ] Tracking done! Saving data into local file (please do not close it yet)...`,
  );
  writeFileSync(chapterPath, JSON.stringify(chapterStored, null, 2), "utf-8");
  writeFileSync(dataPath, JSON.stringify(dataStored, null, 2), "utf-8");

  console.log(`[ MAIN | ${now.toLocaleTimeString()} ] Saving complete!`);
  process.exit(0);
})();
