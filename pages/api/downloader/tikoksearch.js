import axios from 'axios'
import { API_KEY, CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

  const apiKey = req.headers['api_key'];
    if (!apiKey || !API_KEY.includes(apiKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { query } = req.query;
    
    try {
        const data = await tiktokss(query);
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

async function tiktokss(message) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
      },
      data: `keywords=${encodeURIComponent(message)}&count=10&cursor=0&HD=1`,
    });

    const videos = response.data.data.videos || [];
    if (videos.length === 0) {
      throw new Error("Tidak ada video ditemukan.");
    }
    const randomIndex = Math.floor(Math.random() * videos.length);
    const video = videos[randomIndex];
    return {
      author: video.author_name || "Tidak ada author",
      title: video.title || "Tidak ada judul",
      cover: video.cover || "",
      origin_cover: video.origin_cover || "",
      no_watermark: video.play || "",
      watermark: video.wmplay || "",
      music: video.music || "",
    };
  } catch (error) {
    throw new Error("Gagal mendapatkan hasil dari API TikTok: " + error.message);
  }
}
