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

    const { url } = req.query;

    try {
        const data = await krakenfiles(url);
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

async function krakenfiles(url) {
    return new Promise(async(resolve, reject) => {
         if (!/krakenfiles.com/.test(url)) return new Error("Input Url from Krakenfiles !")
          let { data } = await axios.get(url, {     
              headers: {
                 "User-Agent": "Posify/1.0.0",
                 "Referer": url,
                 "Accept": "*/*"
               },
           }).catch((e) => e.response);
           let $ = cheerio.load(data);
           let result = {
              metadata: {},
              buffer: null
          }
          result.metadata.filename = $(".coin-info .coin-name h5").text().trim();
          $(".nk-iv-wg4 .nk-iv-wg4-overview li").each((a, i) => {
          let name = $(i).find(".sub-text").text().trim().split(" ").join("_").toLowerCase()
          let value = $(i).find(".lead-text").text()
              result.metadata[name] = value
          })
         $(".nk-iv-wg4-list li").each((a, i) => {
          let name = $(i).find("div").eq(0).text().trim().split(" ").join("_").toLowerCase()
          let value = $(i).find("div").eq(1).text().trim().split(" ").join(",")
              result.metadata[name] = value
         })  
         if ($("video").html()) {
             result.metadata.thumbnail = "https:" + $("video").attr("poster");
             } else if ($(".lightgallery").html()) {
             result.metadata.thumbnail = "https:" + $(".lightgallery a").attr("href");
            } else {
            result.metadata.thumbnail = "N\A"
         }
         let downloads = ""
         if ($("video").html()) {
              downloads = "https:" + $("video source").attr("src")
            } else {
              downloads = "https:" + $(".lightgallery a").attr("href");
          }
         const res = await axios.get(downloads, {     
              headers: {
               "User-Agent": "Posify/1.0.0",
               "Referer": url ,
               "Accept": "*/*",
               "token": $("#dl-token").val()
             },
           responseType: "arraybuffer"
         }).catch((e) => e.response);
           if (!Buffer.isBuffer(res.data)) return new Error("Result is Not a buffer !")
           result.buffer = res.data
           resolve(result)
    })
}