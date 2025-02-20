import axios from "axios";
import * as cheerio from "cheerio";
import {  CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { query } = req.query;
    
    if (!query) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Query parameter is required",
        });
    }

    try {
        const data = await an1Search(query);
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

async function an1Search(query) {
    const url = `https://an1.com/tags/MOD/?story=${encodeURIComponent(query)}&do=search&subaction=search`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let results = [];

        $("body > div.page > div > div > div.app_list > div").each((i, el) => {
            let title = $(el).find("div.cont > div.data > div.name > a > span").text().trim() || "N/A";
            let dev = $(el).find("div.cont > div.data > div.developer.xsmf.muted").text().trim() || "N/A";
            let rating = $(el).find("div > ul > li.current-rating").text().trim() || "N/A";
            let thumb = $(el).find("div.img > img").attr("src") || "N/A";
            let link = $(el).find("div.cont > div.data > div.name > a").attr("href") || "N/A";

            results.push({ title, dev, rating, thumb, link });
        });

        return results;
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return [];
    }
      }
