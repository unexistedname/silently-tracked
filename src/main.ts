import { resolve, join } from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";
const now: Date = new Date();
import dotenv from "dotenv";
dotenv.config();

// Type aliases and enum
import { DOMAIN } from "./tracker/lib/Domain.js";
import type { metadata } from "./tracker/lib/Metadata.js";

// Libraries for scraping
import * as Rawkuma from "./tracker/Rawkuma.js";
import * as Mangadex from "./tracker/Mangadex.js";
import * as Mangasushi from "./tracker/Mangasushi.js";
import Rawdevart from "./tracker/Rawdevart.js";

// data: For storing updated data
// baseData: For storing list of manga to be updated
// Change the content in baseData if you want to add/remove manga(s)
function createNewFile(path: string, fileName: string): {} {
  writeFileSync(path, "{}", "utf-8");
  console.log(`No ${fileName} file detected, creating a new one...`);
  return {};
}

const dir = process.env["DATA_DIRECTORY"];
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

        let chapterScrape: string[] = []; // For storing new scraped chapters
        let dataScrape: Partial<metadata> = {}; // For storing new scraped metadata
        const domain: string = baseData[key].split("/")[2]; // Getting the domain name

        switch (domain) { // Start scraping here 
          case DOMAIN.Rawkuma: {
            console.log("[ MAIN ] Getting from rawkuma");
            dataScrape = await Rawkuma.metadata(baseData[key]); 
            chapterScrape = await Rawkuma.chapter(baseData[key]);
            break;
          }

          case DOMAIN.Mangadex: {
            console.log("[ MAIN ] Getting from mangadex");
            dataScrape = await Mangadex.metadata(baseData[key]);
            chapterScrape = await Mangadex.chapter(baseData[key]);
            break;
          }

          case DOMAIN.Mangasushi: {
            console.log("[ MAIN ] Getting from mangasushi");
            dataScrape = await Mangasushi.metadata(baseData[key]);
            chapterScrape = await Mangasushi.chapter(baseData[key]);
            break;
          }

          case DOMAIN.Rawdevart: {
            console.log("[ MAIN ] Getting from mangasushi");
            const res = await Rawdevart(baseData[key]);

            dataScrape = res.metadata;
            chapterScrape = res.chapter;
            break;
          }
          default:
            throw new Error("Couldn't find domain name: " + domain);
            break;
        } // end switch
        if (dataScrape.title === "") {
          throw new Error(`[ MAIN ] Title doesn't exist!`);
          
        }
        console.log(`[ MAIN ] Scraping complete! working on local data...`);
        const oldChapter: string[] = chapterStored[id]?.chapter ?? [];
        let newChapter: string[] = chapterScrape.filter(
          (x) => !oldChapter.includes(x),
        );
        if (newChapter.length === 0) {
          newChapter = chapterStored[id]?.newChapter; // Keeps the old newChapter value if there's no update
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
    } // end if
  } //end for

  console.log(
    `[ MAIN ] Tracking done! Saving data into local file (please do not close it yet)...`,
  );
  writeFileSync(chapterPath, JSON.stringify(chapterStored, null, 2), "utf-8");
  writeFileSync(dataPath, JSON.stringify(dataStored, null, 2), "utf-8");

  console.log(`[ MAIN | ${now.toLocaleTimeString()} ] Saving complete!`);
  process.exit(0);
})();
