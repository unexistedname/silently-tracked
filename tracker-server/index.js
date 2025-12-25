import { resolve, basename } from 'path';
import { readFileSync } from 'fs';
import tracker from './tracker/tracker.js';
import updater from './updater.js';
import announcer from '../discord-bot/announcer.js';
import "dotenv/config";
const dataPath = resolve('./data/data.json');
const updateLogPath = resolve('./data/updateLog.json');
const mangaData = JSON.parse(readFileSync(dataPath, 'utf8'));

// Nampilin file asal log
const trackerLog = console.log;
console.log = (...args) => {
    const stackLine = new Error().stack.split("\n")[2].trim();
    const match = stackLine.match(/\((.*):\d+:\d+\)$/);
    const filePath = match ? match[1] : stackLine;
    trackerLog(`[${basename(filePath)}]`, ...args);
};

/* 
- memulai tracking tiap x menit \\ done
- if tracker != 0, announce bot + write file //donbe
*/
setInterval(
    async () => {
        console.log("\x1b[34mScraping started... \x1b[0m");
        
        for (let manga of mangaData) {
            const title = [...Object.keys(manga)];
            const results = await tracker(...title, dataPath, updateLogPath);
            
            if (results.length != 0 && Array.isArray(results)) {
                await announcer(title, manga[title]["Link"], results, manga[title]["Image Directory"]);
            }
        };
        await updater(dataPath, updateLogPath);
        console.log("\x1b[34mScraping ended! Next scrape in", process.env.interval, "\x1b[34mMinutes\x1b[0m");  
    }, 30 * 60000);


/* For debugging 
(async () => {
    console.log("\x1b[34mScraping started... \x1b[0m");
    
    for (let manga of mangaData) {
        const title = [...Object.keys(manga)];
        const results = await tracker(...title, dataPath, updateLogPath);
        console.log(results.length);
        
        if (results.length != 0 && Array.isArray(results)) {
            await announcer(title, manga[title]["Link"], results, manga[title]["Image Directory"]);
        }
    };
    await updater(dataPath, updateLogPath);
    console.log("\x1b[34mScraping ended! Next scrape in ", process.env.interval, "\x1b[34mMinutes\x1b[0m");  
})();
*/

// Tracking manga tiap 30 mnt (edit intervalny di .env)
console.log("It'll start in 30 min :)");

