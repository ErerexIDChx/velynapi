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

    const { text, fontSize = "100", blurLevel = "5" } = req.query;

    if (!text) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'text' wajib diisi",
        });
    }

    try {
        const data = await bratImage(text, fontSize, blurLevel);
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

async function bratImage(prompt, font_text, blur_level) {
    return new Promise(async (resolve, reject) => {
        const url = 'https://www.bestcalculators.org/wp-admin/admin-ajax.php';

        const headers = {
            'authority': 'www.bestcalculators.org',
            'accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://www.bestcalculators.org',
            'referer': 'https://www.bestcalculators.org/online-generators/brat-text-generator/',
            'user-agent': 'Postify/1.0.0',
            'x-requested-with': 'XMLHttpRequest',
        };

        const data = new URLSearchParams({
            'action': 'generate_brat_text',
            'text': prompt,
            'fontSize': font_text,
            'blurLevel': blur_level,
        });

        try {
            const response = await axios.post(url, data.toString(), { headers });
            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            resolve({
                text: prompt,
                fontSize: font_text,
                blurLevel: blur_level,
                image: `data:image/png;base64,${response.data}`,
            });

        } catch (error) {
            console.error('Error fetching brat image:', error);
            reject({ success: false, message: "Gagal membuat brat image: " + error.message });
        }
    });
                  }
