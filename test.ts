import "dotenv/config";
import { resolve } from "path";
import axios from "axios";
import { readFileSync, existsSync, writeFileSync } from "fs";
const baseDataPath = resolve("./data/baselink.json");
const baseData = JSON.parse(readFileSync(baseDataPath, "utf-8"));

let link = "https://mangadex.org/title/845df2de-c537-4f87-806b-22e0f2054613/muteki-no-ansatsu-madoushi-last-boss-musume-to-tabi-o-suru-comic";
let a = link.split("/")[2];
let prefix = "mangadex.org";
console.log(a == prefix);
