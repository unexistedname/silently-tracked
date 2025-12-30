import { readFileSync, existsSync, writeFileSync } from 'fs';
import { chapterScraper, initBrowser, closeBrowser } from './scraper.js';
import { format } from 'date-and-time';

// Bandingin chapter
async function tracker(title, dir, saveDir) {
    const data = JSON.parse(readFileSync(dir, 'utf-8'));
    await initBrowser()
    try {
        console.log(`Processing: \x1b[34m${title}\x1b[0m`);

        const entry = await data.find(item => Object.prototype.hasOwnProperty.call(item, title)); //chatgpt ass shit idk
        if (!entry) {
            console.error('\x1b[31mTitle not found in data:\x1b[0m', title);
            await closeBrowser();
            return 0;
        }
        const manga = entry[title];
        // Bikin baru klo gaada
        manga["Chapter List"] ? manga["Chapter List"] : [].then(() => console.log("Entry empty, creating new one..."));
        const oldList = manga["Chapter List"];
        console.log(`Found ${oldList.length} chapter(s) in ${title} from data.`);

        const newList = await chapterScraper(manga["Link"]);
        const update = Array.isArray(newList) ? newList.filter(x => !oldList.includes(x)) : 0; //Filter bedanya newList sama oldList. Klo ada, taro di update
        console.log(`Found ${update === 0 ? "\x1b[31m(Error)\x1b[0m" : update.length} new chapter(s).`)

        await closeBrowser();
        await updateLog(saveDir, title, update);
        return update;
    } catch (error) {
        console.error("\x1b[31mError in tracker function: \x1b[0m", error);
        await closeBrowser();
        return 0;
    }
}
// Bikin log cache
async function updateLog(dir, title, update) {
    try {
        if (!existsSync(dir)) {
            //bikin klo gaada
            const x = {};
            writeFileSync(dir, JSON.stringify(x, null, 2), "utf8");
            console.log("\x1b[33mNo log file detected, creating a new one...\x1b[0m");
        }
        let log = JSON.parse(readFileSync(dir, 'utf-8'));
            log[title] = {
                "Latest": Array.isArray(update) ? update : (log[title]?.Latest || []),
                "Time": format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
                "Status": update === 0 ? "Error" : "Active"
            }
        writeFileSync(dir, JSON.stringify(log, null, 2))
        console.log(`\x1b[32mSuccessfully save ${title}'s update log\x1b[0m`)
    } catch (error) {
        console.error(error);   
    }
}

export default tracker;