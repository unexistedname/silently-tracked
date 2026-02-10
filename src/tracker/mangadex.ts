import axios from "axios";
import * as cheerio from "cheerio";
import { metadata } from "./lib/metadata";

const baseUrl = "https://api.mangadex.org/manga";

// ------ CHAPTER SCRAPING ----------
export async function chapter(url: string) {
    try {
        const id = url.split("/")[4];
        url = `${baseUrl}/${id}/feed`;
        const res = await axios.get(url);
        const data = res.data.data;
        const chapters = data[0]
            .filter((ch: any) => ['en', 'id']
                .some((lang) => lang in (ch.attributes.translatedLanguages ?? {})
                ))
            .map((ch: any) => ch.attributes.chapter.toString());
    } catch (error: unknown) {
        throw error;
    }
}

// ----- METADATA SCRAPING ---------
export async function metadata(url: string): Promise<metadata> {
    try {
        const id = url.split("/")[4];
        url = `${baseUrl}/${id}`;
        const res = await axios.get(url);
        const data = res.data.data.attributes;
        const genre = data.tags.map((tag: any) => tag.attributes?.name?.en).filter(Boolean);

        return {
            title: data.title['ja-ro'],
            altTitle: data.title['id'] ?? data.title['en'] ?? data.title['ja'] ?? null,
            author:,
            artist:,
            genre: genre,
            descriptions: data.description.en ?? data.description.ja ?? "",
            coverURL,
            src: 'mangadex'

            // todo
        }
    } catch (error: unknown) {
        throw error;
    }
}