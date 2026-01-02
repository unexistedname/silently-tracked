import axios from "axios";
import * as cheerio from "cheerio";

(async () => {
  const res = await axios.get(`https://myanimelist.net/manga/144180/Gachiakuta`);
  const $ = cheerio.load(res.data);

  const artist = $(".author a:nth-child(1)").text().trim();
  const author = $(".author a:nth-child(2)").text().trim() || artist;
  
  console.log(author)
})();