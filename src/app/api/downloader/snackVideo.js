import axios from "axios";
import cheerio from "cheerio";
import { API_KEY, CREATOR } from "../../../settings";
export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
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
        console.error("Error:", error.message);
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
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        const $ = cheerio.load(response.data);
        let result = {
            metadata: {},
            download: null
        };
        const videoData = $("#VideoObject").text().trim();
        if (!videoData) throw new Error("Video data not found!");
        const json = JSON.parse(videoData);
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
        console.error("Download Error:", error.message);
        throw new Error("Failed to parse video data: " + error.message);
    }
}
