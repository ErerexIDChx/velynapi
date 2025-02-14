import axios from "axios";
import cheerio from "cherioo";
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
        const data await downloadSnackVideo(url);
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

async function downloadSnackVideo(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            let result = {
                metadata: {},
                download: null
            };
            const json = JSON.parse($("#VideoObject").text().trim());
            result.metadata.title = json.name;
            result.metadata.thumbnail = json.thumbnailUrl[0];
            result.metadata.uploaded = new Date(json.uploadDate).toLocaleString();
            result.metadata.comment = json.commentCount;
            result.metadata.watch = json.interactionStatistic[0].userInteractionCount;
            result.metadata.likes = json.interactionStatistic[1].userInteractionCount;
            result.metadata.share = json.interactionStatistic[2].userInteractionCount;
            result.metadata.author = json.creator.mainEntity.name;
            result.download = json.contentUrl;
            resolve(result);
        } catch (error) {
            reject({ msg: error.message });
        }
    });
}
