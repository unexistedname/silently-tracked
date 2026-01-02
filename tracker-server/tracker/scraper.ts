import axios from "axios";
import * as cheerio from "cheerio";
import { join } from "path";
import { existsSync, mkdirSync, createWriteStream, futimes } from "fs";

// Type Definition
export type metadata = {
  title: string;
  altTitle?: string;
  author?: string;
  artist?: string;
  genre?: string[];
  descriptions: string[];
  coverURL: string | null;
};

// ---------------------------------------
export async function chapter(html: string): Promise<number[]> {
  try {
    const $ = cheerio.load(html);
    const list_url = $("#chapter-list").attr("hx-get");
    if (typeof list_url !== "string") {
      console.log("Chapter URL unexpected data type: ", typeof list_url);
      return [];
    }

    const chapter_url_res = await axios.get(list_url);
    const $$ = cheerio.load(chapter_url_res.data);
    const list = $$("div#chapter-list div")
      .map((_, ch) => $$(ch).attr("data-chapter-number"))
      .get()
      .reverse();
    return list;
  } catch (error: unknown) {
    throw error;
  }
}

export async function metadataExt(id: number): metadata {
  // Scrapes from MAL, requies manga ID.
  try {
    const res = await axios.get(`https://myanimelist.net/manga/${id}`);
    const $ = cheerio.load(res.data);

    const title = $("span.h1-title span")
      .contents()
      .filter((_, el) => el.type === "text")
      .first()
      .text()
      .trim();
    const alt = $("span.h1-title span.title-english").text().trim();
    const desc = $("[itemprop='description']").text().trim();
    const artist = $(".author a:nth-child(1)").text().trim();
    const author = $(".author a:nth-child(2)").text().trim() || artist;
    
    
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
    const descriptions = $("div[itemprop='description'][data-show='false'] p")
      .map((_, par) => $(par).text().trim().toString())
      .get();
    const cover = $("div[itemprop='image'] img").attr("src");

    return {
      title: title,
      descriptions: descriptions,
      coverURL: cover ? cover : null,
      genre: genre,
    };
  } catch (error: unknown) {
    throw error;
  }
}
