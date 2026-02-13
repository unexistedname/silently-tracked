import axios from "axios";
import { chapter, metadata } from "./src/tracker/Mangadex";
let a: string = "https://mangadex.org/title/13ec3c49-9a27-4551-9ac4-4fffd530d69f/break-new-world";
const baseUrl = "https://api.mangadex.org/manga";
let title = a.split("/")[4];
console.log(title);
const baseUrlAuthor = "https://api.mangadex.org/author";
const baseUrlArtist = "https://api.mangadex.org/artist";
const baseUrlCover = "https://api.mangadex.org/cover";

(async () => {
    const b = await metadata(a);
    console.log(b);
    
    
})()

// (async () => {
//     const res = await axios.get("https://api.mangadex.org/author/025181d8-637b-4292-8995-2d8727509014")
//     console.log(res.data);
    
// })()