import axios from "axios";
import {  CREATOR } from "../../../settings";

export default async function handler(req, res) {
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
            error: "Parameter 'url' diperlukan",
        });
    }

    try {
        const screenshotBuffer = await fetchScreenshot(url);
        res.setHeader("Content-Type", "image/png");
        return res.send(screenshotBuffer);
    } catch (error) {
        console.error("Error fetching screenshot:", error);
        return res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}
// Apikey dari amad sikma 
async function fetchScreenshot(targetUrl) {
    try {
        const apiUrl = `https://api.screenshotmachine.com?key=44733b&url=${encodeURIComponent(targetUrl)}&dimension=1024x768`;
        const { data } = await axios.get(apiUrl, {
            headers: {
                "DNT": 1,
                "Upgrade-Insecure-Requests": 1
            },
            responseType: "arraybuffer",
            timeout: 10000
        });

        return data;
    } catch (error) {
        throw new Error("Gagal mengambil screenshot.");
    }
}
