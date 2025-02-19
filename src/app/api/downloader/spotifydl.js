import axios from 'axios';
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
        const data = await spotifydl(url);
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

async function spotifydl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const kemii = await axios.get(
                `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
                {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                        "sec-ch-ua": "\"Not)A;Brand\";v=\"24\", \"Chromium\";v=\"116\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-ch-ua-platform": "\"Android\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        Referer: "https://spotifydownload.org/",
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                    },
                }
            );

            if (!kemii.data || !kemii.data.result) {
                throw new Error("Data dari API tidak ditemukan.");
            }

            const kemi = await axios.get(
                `https://api.fabdl.com/spotify/mp3-convert-task/${kemii.data.result.gid}/${kemii.data.result.id}`,
                {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                        "sec-ch-ua": "\"Not)A;Brand\";v=\"24\", \"Chromium\";v=\"116\"",
                        "sec-ch-ua-mobile": "?1",
                        "sec-ch-ua-platform": "\"Android\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        Referer: "https://spotifydownload.org/",
                        "Referrer-Policy": "strict-origin-when-cross-origin",
                    },
                }
            );

            if (!kemi.data || !kemi.data.result) {
                throw new Error("Data konversi tidak ditemukan.");
            }

            const result = {
                success: true,
                title: kemii.data.result.name || "Unknown Title",
                type: kemii.data.result.type || "Unknown Type",
                artist: kemii.data.result.artists || "Unknown Artist",
                duration: kemii.data.result.duration_ms || 0,
                image: kemii.data.result.image || "No Image",
                download: "https://api.fabdl.com" + kemi.data.result.download_url || null,
            };

            resolve(result);

        } catch (error) {
            console.error("Error dalam proses pengambilan data:", error.message);
            reject({ success: false, message: "Gagal mengambil data dari link Spotify: " + error.message });
        }
    });
  }
