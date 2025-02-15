import axios from "axios";
import cheerio from "cheerio";
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    // Ensure the request method is GET
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "URL is required",
        });
    }

    try {
        if (!isValidUrl(url)) {
            return res.status(400).json({
                status: false,
                creator: CREATOR,
                error: "Invalid URL format",
            });
        }

        const data = await downloadSnackVideo(url);
        return res.status(200).json({
            status: true,
            creator: CREATOR,
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}

function isValidUrl(url) {
    const regex = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
    return regex.test(url);
}

async function downloadSnackVideo(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let result = {
            metadata: {},
            download: null
        };
        
        const json = JSON.parse($("#VideoObject").text().trim());
        result.metadata.title = json.name || "Untitled";
        result.metadata.thumbnail = json.thumbnailUrl ? json.thumbnailUrl[0] : null;
        result.metadata.uploaded = json.uploadDate ? new Date(json.uploadDate).toLocaleString() : "Unknown";
        result.metadata.comment = json.commentCount || 0;
        result.metadata.watch = json.interactionStatistic[0]?.userInteractionCount || 0;
        result.metadata.likes = json.interactionStatistic[1]?.userInteractionCount || 0;
        result.metadata.share = json.interactionStatistic[2]?.userInteractionCount || 0;
        result.metadata.author = json.creator?.mainEntity?.name || "Unknown";
        result.download = json.contentUrl || null;

        return result;
    } catch (error) {
        throw new Error("Failed to parse video data: " + error.message);
    }
}
