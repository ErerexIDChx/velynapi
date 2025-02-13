import axios from "axios";
import * as cheerio from "cheerio";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { query } = req.query;
    
    try {
        const data = await anichinSearch(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

async function anichinSearch(query) => {
      try {
         let { data } = await axios.get(`https://anichin.xyz/?s=${encodeURIComponent(query)}`);
         let $ = cheerio.load(data);

         let result = [];
         $(".listupd .bsx a").each((i, el) => {
            let title = $(el).attr("title");
            let link = $(el).attr("href");
            let episode = $(el).find(".bt .epx").text().trim();
            let type = $(el).find(".typez").text().trim();
            let image = $(el).find("img").attr("data-lazy-src") || $(el).find("img").attr("src");

            result.push({ title, episode, type, image, link });
         });

         return result;
      } catch (error) {
         console.error("Gagal mengambil data:", error);
         return [];
    }
}
