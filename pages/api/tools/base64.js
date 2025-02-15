import { API_KEY, CREATOR } from "../../../settings";

function encodeBase64(text) {
    return Buffer.from(text, 'utf-8').toString('base64');
}

function decodeBase64(base64) {
    try {
        return Buffer.from(base64, 'base64').toString('utf-8');
    } catch (error) {
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { input } = req.query;
    if (!input) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'input' tidak boleh kosong",
        });
    }

    // Cek apakah input dalam format Base64 yang valid
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    const isBase64 = base64Regex.test(input) && input.length % 4 === 0;
    const result = isBase64 ? decodeBase64(input) : encodeBase64(input);

    if (result === null) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Format Base64 tidak valid",
        });
    }

    return res.status(200).json({
        status: true,
        creator: CREATOR,
        input: input,
        output: result,
    });
}
