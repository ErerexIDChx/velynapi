import axios from "axios";
import cheerio from "cheerio";

export async function anichinSearch(query) {
    try {
        const { data } = await axios.get(`https://anichin.xyz/?s=${encodeURIComponent(query)}`);
        const $ = cheerio.load(data);

        let result = [];
        $(".listupd .bsx a").each((i, el) => {
            const title = $(el).attr("title");
            const link = $(el).attr("href");
            const episode = $(el).find(".bt .epx").text().trim();
            const type = $(el).find(".typez").text().trim();
            const image = $(el).find("img").attr("data-lazy-src") || $(el).find("img").attr("src");

            result.push({ title, episode, type, image, link });
        });

        return result;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return [];
    }
}
