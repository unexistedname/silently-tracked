import axios from "axios";
import * as cheerio from "cheerio";
import type { metadata } from "./lib/Metadata.js";

export async function chapter(url: string): Promise<String[]> {
  try {
    if (url.at(-1) === "/") {
      url = url.slice(0, -1); // Removes additional / if there's one
    }
    const res = await axios({
      method: "POST",
      url: `${url}/ajax/chapters`,
    });
    const $ = cheerio.load(res.data);

    const list = $(".wp-manga-chapter a")
      .map((_, el) => $(el).text().trim().split(" ")[1])
      .get();

    return list;
  } catch (error: unknown) {
    throw error;
  }
}

export async function metadata(url: string): Promise<metadata> {
  try {
    if (url.at(-1) === "/") {
      url = url.slice(0, -1); // Removes additional / if there's one
    }
    const res = await axios({
      method: "GET",
      url: url,
    });
    const $ = cheerio.load(res.data);

    const post_content: Record<string, string[] | string> = {};
    $(".post-content_item").each((_, el) => {
      const heading = $(el)
        .find(".summary-heading h5")
        .text()
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "");

      let content: string | string[] = $(el)
        .find(".summary-content a")
        .map((_, x) => $(x).text().trim())
        .get();
      if (content.length === 0) {
        content = $(el).find(".summary-content").text().trim();
      }

      post_content[heading] = content;
    });

    const title = $(".post-title").text().trim();
    const desc = $(".description-summary > .summary__content").text().trim();
    const img = $(".summary_image a img").attr("src");
    const alt = post_content["alternative"] ?? "";
    const author = post_content["authors"] ?? "";
    const artist = post_content["artists"] ?? "";
    const genre = post_content["genres"];
    return {
      title: title,
      altTitle: alt,
      author: author,
      artist: artist,
      genre: genre as string[],
      descriptions: desc,
      coverURL: img ?? null,
      src: "mangasushi",
    };
  } catch (error) {
    throw error;
  }
}
