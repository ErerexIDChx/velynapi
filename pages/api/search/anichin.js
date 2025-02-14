import { anichinSearch } from "../../../utils/function";
import { API_KEY, CREATOR } from "../../settings";

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
        const data = await anichinSearch(query);
        res.status(200).json({
            status: true,
            creator: CREATOR,
            data,
        });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}
