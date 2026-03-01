import axios from "axios";
import * as cheerio from "cheerio";
import type { metadata } from "./lib/Metadata.js";
// Type Definition

// ---------------------------------------
export async function chapter(html: string): Promise<string[]> {
  try {
    const $ = cheerio.load(html);
    const list_url = $("#chapter-list").attr("hx-get");
    if (typeof list_url !== "string") {
      console.log("Chapter URL unexpected data type: ", typeof list_url);
      return [];
    }
    console.log("[ RAWKUMA.CHAPTER ] Chapter list API get.");

    const chapter_url_res = await axios.get(list_url);

    console.log(
      "[ RAWKUMA.CHAPTER ] Successfully executed GET request into chapter API.",
    );
    const $$ = cheerio.load(chapter_url_res.data);
    const list = $$("div#chapter-list div")
      .map((_, ch) => $$(ch).attr("data-chapter-number"))
      .get()
      .reverse();
    console.log("[ RAWKUMA.CHAPTER ] Chapter list obtained.");
    return list;
  } catch (error: unknown) {
    throw error;
  }
}

export function metadata(html: string): metadata {
  // Scrapes from rawkuma, doesn't get author & artist name
  try {
    const $ = cheerio.load(html);

    const title = $("h1[itemprop='name']").text().trim();
    const genre = $("a[itemprop='genre']")
      .map((_, el) => $(el).text().trim().toLowerCase())
      .get();
    const descriptions = $("div[itemprop='description'][data-show='false']")
      .text()
      .trim();
    const cover = $("div[itemprop='image'] img").attr("src");
    console.log("[ RAWKUMA.METADATA ] Metadata obtained.");

    return {
      title: title,
      descriptions: descriptions,
      coverURL: cover ? cover : null,
      genre: genre,
      src: "rawkuma",
    };
  } catch (error: unknown) {
    throw error;
  }
}

// ---------- METADATA RAWKUMA------------
// export async function metadataMAL(id: number): Promise<metadata> {
//   // Scrapes from MAL, requires manga ID.
//   try {
//     const res = await axios.get(`https://myanimelist.net/manga/${id}`);
//     const $ = cheerio.load(res.data);

//     const title = $("span.h1-title span")
//       .contents()
//       .filter((_, el) => el.type === "text")
//       .first()
//       .text()
//       .trim();
//     const alt = $("span.h1-title span.title-english").text().trim();
//     const descriptions = $("[itemprop='description']").text().trim();
//     const artist = $(".author a:nth-child(1)").text().trim();
//     const author = $(".author a:nth-child(2)").text().trim() || artist;
//     const genre = $("[itemprop='genre']")
//       .map((_, el) => $(el).text().toLowerCase())
//       .get();
//     const cover = $("[itemprop='image']").attr("data-src")?.toString()

//     return {
//       title: title,
//       altTitle: alt,
//       artist: artist,
//       author: author,
//       genre: genre,
//       descriptions: [descriptions],
//       coverURL: cover ? cover : null,
//       src: "mal"
//     }

//   } catch (error: unknown) {
//     throw error;
//   }
// }
