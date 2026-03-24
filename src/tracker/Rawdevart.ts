import axios from "axios";
import type { metadata } from "./lib/Metadata.js";

export default async function Rawdevart(url: string) {
    const id = url.split("/ne")[1];
    const api = `https://rawdevart.art/spa/manga/${id}`; 
    const res = await axios.get(api);
    const data = res.data;

    console.log("[ RAWDEVART ] API response get.");
    

    // Metadata 
    const title = data.detail.manga_name;
    const altTitle = data.detail?.manga_others_name ?? "";
    const author = data.authors.author_name;
    const genre = data.tags.map((tag: { tag_name: string }) => tag.tag_name);
    const description = data.detail.manga_description;
    const cover = data.detail.manga_cover_img_full;

    const metadata: metadata = {
        title: title,
        altTitle: altTitle,
        author: author,
        genre: genre,
        descriptions: description,
        coverURL: cover,
        src: "rawdevart"
    };

    // Chapter
    const chapter = data.chapters.map((chapter: { chapter_number: number }) => String(chapter.chapter_number)).reverse();

    return {
        chapter: chapter,
        metadata: metadata
    };
    
    
}