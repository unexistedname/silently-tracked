import {resolve, join} from 'path';
import announcer from '../../discord-bot/announcer.js';
import { readFileSync } from 'fs';
const img = resolve("./data/media");
const mangaData = JSON.parse(readFileSync('./data/data.json', 'utf8'));
// (async () => {
//     announcer("Kekob", "http://google.com", [12, 13, 14], "F:\\Document\\Codingan\\manga-tracker\\data\\media\\drawing.png")
// })();
console.log('\x1b[31mIni teks merah\x1b[0m');
console.log('\x1b[32mIni teks hijau\x1b[0m');
console.log('\x1b[33mIni teks kuning\x1b[0m');
console.log('\x1b[34mIni teks biru\x1b[0m');
console.log(`\x1b[32mSuccessfully save s update log\x1b[0m`)
        // for (let manga of mangaData) {
        // const title = Object.keys(manga);
        // console.log(manga[title]["Link"]);
        
        // }