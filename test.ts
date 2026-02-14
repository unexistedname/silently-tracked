import axios from "axios";

const baseUrl = 'https://api.mangadex.org';
const mangaID = '05a56be4-26ab-4f50-8fc0-ab8304570258';
const languages = ['en'];
(async () => {
    const resp = await axios({
        method: 'GET',
        url: `${baseUrl}/manga/${mangaID}/feed`,
        params: {
            translatedLanguage: languages
        }
    });

    console.log(resp.data.data.map(chapter => chapter.attributes));
})()