import axios from "axios";
import * as cheerio from "cheerio";
import { metadata } from "./lib/metadata";

// ------ CHAPTER SCRAPING ----------
export async function chapter(html: string) {
    try {
        const $ = cheerio.load(html);
    } catch (error: unknown) {
        throw error;
    }
}

// ----- METADATA SCRAPING ---------
export async function metadata(html: string) {
    try {
        const $ = cheerio.load(html);
    } catch (error: unknown) {
        throw error;
    }
}