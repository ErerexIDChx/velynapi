import axios from 'axios';
import qs from 'qs';
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

    const { url } = req.query;
    
    try {
        const data = await fb(url);
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

async function fb(vid_url) {
  try {
    const data = {
      url: vid_url
    };
    const searchParams = new URLSearchParams();
    searchParams.append('url', data.url);

    const response = await axios.post('https://facebook-video-downloader.fly.dev/app/main.php', searchParams.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    const responseData = response.data;
    return responseData;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw new Error('Failed to download the video.');
  }
}
