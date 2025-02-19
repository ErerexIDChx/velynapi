import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { prompt } = req.query;

    try {
        const data = await simSimi(prompt);
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

async function simSimi(text, language = 'id') {
  const { data } = await axios.post("https://api.simsimi.vn/v1/simtalk", new URLSearchParams({
    text,
    lc: language
  }).toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  })

  return data.message
}