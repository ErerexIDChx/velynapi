import axios from "axios";
import cheerio from "cheerio";
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
        const data = await Bsearch(query);
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

async function BSearch(query) {
   try {
      let { data: m } = await axios.get(`https://www.bilibili.tv/id/search-result?q=${encodeURIComponent(query)}`);
      let $ = cheerio.load(m);

      const results = [];
      $('li.section__list__item').each((index, element) => {
         const title = $(element).find('.highlights__text--active').text().trim();
         const videoLink = $(element).find('.bstar-video-card__cover-link').attr('href');
         const thumbnail = $(element).find('.bstar-video-card__cover-img source').attr('srcset');
         const views = $(element).find('.bstar-video-card__desc--normal').text().trim();
         const creatorName = $(element).find('.bstar-video-card__nickname').text().trim();
         const creatorLink = $(element).find('.bstar-video-card__nickname').attr('href');
         const duration = $(element).find('.bstar-video-card__cover-mask-text').text().trim();

         results.push({
            title,
            videoLink: `https://www.bilibili.tv${videoLink}`,
            thumbnail,
            views,
            creatorName,
            creatorLink: `https://www.bilibili.tv${creatorLink}`,
            duration
         });
      });

      return results
   } catch (error) {
      console.error("Error while fetching search results:", error);
   }
}
