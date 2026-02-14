import axios from "axios";
import type { metadata } from "./lib/Metadata.js";

const baseUrl = "https://api.mangadex.org/manga";
const baseUrlAuthor = "https://api.mangadex.org/author";
const baseUrlCover = "https://api.mangadex.org/cover";
const baseCover = "https://mangadex.org/covers"

const targetLanguages: string[] = ['en'];
const rating: string[] = ["safe", "suggestive", "erotica", "pornographic"];
// format url : idmanga/coverid.png
// ------ CHAPTER SCRAPING ----------
export async function chapter(url: string): Promise<string[]> { // Fuck yeah its done
    try {
        const id = url.split("/")[4];
        url = `${baseUrl}/${id}/feed`;
        const res = await axios({
            method: 'GET',
            url: `${baseUrl}/${id}/feed`,
            params: {
                translatedLanguage: targetLanguages,
                includeFuturePublishAt: 0,
                limit: 499,
                offset: 0,
                "order[chapter]": "desc",
            }

        });
        if (res.data.result != "ok") {
            throw new Error("[ MANGADEX.CHAPTER ] Error status: ", res.data.errors?.status);
        }
        const data = res.data.data;
        console.log("[ MANGADEX.CHAPTER ] Chapter list API get.");
        const chapters = data
            .map((ch: any) => ch.attributes?.chapter) // Only takes the chapter number
            .reverse()
        console.log("[ MANGADEX.CHAPTER ] Chapter list obtained.");
        return chapters;
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

        if (res.data.result != "ok") {
            throw new Error("[ MANGADEX.METADATA ] Error status: ", res.data.errors?.status);
        }

        const data = res.data.data.attributes;
        const rel = res.data.data.relationships;

        const authorID = rel
            .find((auth: any) => auth.type === 'author')
            .id;
        const artistID = rel
            .find((auth: any) => auth.type === 'artist')
            .id;
        const coverID = rel
            .find((cover: any) => cover.type === 'cover_art')
            .id;

        const authorAPI = `${baseUrlAuthor}/${authorID}`;
        const coverAPI = `${baseUrlCover}/${coverID}`;
        const authorRes = await axios.get(authorAPI);
        const coverRes = await axios.get(coverAPI);
        let artistRes;
        if (authorID != artistID) {
            const artistAPI = `${baseUrlAuthor}/${artistID}`;
            artistRes = await axios.get(artistAPI);
        }

        console.log("[ RAWKUMA.METADATA ] Metadata obtained.");
        const title = data.title['ja-ro'];
        const altTitle = data.altTitles[0].id ?? data.altTitles[0].en ?? data.altTitles[0].ja ?? null;
        const author = authorRes.data.data.attributes.name ?? "";
        const artist = artistRes?.data.data.attributes.name ?? author;
        const genre = data.tags.map((tag: any) => tag.attributes?.name?.en).filter(Boolean).toLowerCase();
        const description = data.description.en ?? data.description.ja ?? "";
        const cover = `${baseCover}/${id}/${coverRes.data.data.attributes.fileName}`;
        return {
            title: title,
            altTitle: altTitle,
            author: author,
            artist: artist,
            genre: genre,
            descriptions: description,
            coverURL: cover,
            src: 'mangadex'
        }
    } catch (error: unknown) {
        throw error;
    }
}