import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { prompt } = req.query;

    if (!prompt) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Bad Request: Missing 'prompt' parameter",
        });
    }

    try {
        const data = await magicStudio(prompt);
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

function getTimestamp() {
    return (Date.now() / 1000).toFixed(3);
}

async function magicStudio(prompt = "watercolour painting of a valley with house next to a river") {
    try {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("output_format", "bytes");
        formData.append("user_profile_id", "2531352");
        formData.append("anonymous_user_id", "bb3f74a9-fb9c-4e7d-b2ea-3b7f3fa5b606");
        formData.append("request_timestamp", getTimestamp());
        formData.append("user_is_subscribed", "false");
        formData.append("client_id", "pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o");

        const response = await axios.post("https://ai-api.magicstudio.com/api/ai-art-generator", formData, {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "multipart/form-data",
                Origin: "https://magicstudio.com",
                Referer: "https://magicstudio.com/ai-art-generator/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
            },
            responseType: "arraybuffer"
        });

        return response.data;
    } catch (error) {
        throw new Error("Error generating image: " + error.message);
    }
}
