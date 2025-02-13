import { API_KEY, CREATOR } from "../../../settings";
import cheerio from "cherioo";
import axios from "axios";

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
        const data = await jktNews(query);
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

async function jktNews(lang = "id") {
   let { data } = await axios.get(`https://jkt48.com/news/list?lang=${lang}`);
   let $ = cheerio.load(data);

   const news = [];
   
   $(".entry-news__list").each((index, element) => {
      const title = $(element).find("h3 a").text();
      const link = $(element).find("h3 a").attr("href");
      const date = $(element).find("time").text();

      news.push({ title, link: "https://jkt48.com" + link, date });
   });

   return news;
}