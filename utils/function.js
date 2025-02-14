import axios from "axios";
import cheerio from "cheerio";

export async function anichinSearch(query) {
    try {
        const { data } = await axios.get(`https://anichin.lol/?s=${encodeURIComponent(query)}`, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        const $ = cheerio.load(data);
        let result = [];

        $(".listupd .bsx").each((i, el) => {
            let title = $(el).find("a").attr("title")?.trim();
            let link = $(el).find("a").attr("href");
            let episode = $(el).find(".bt .epx").text().trim();
            let type = $(el).find(".typez").text().trim();
            let image = $(el).find("img").attr("data-lazy-src") || $(el).find("img").attr("src");

            if (title && link) {
                result.push({ title, episode, type, image, link });
            }
        });

        return result;
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return [];
    }
}
