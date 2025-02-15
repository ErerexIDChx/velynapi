 import { ephoto } from "../../../utils/ephoto";
import { API_KEY, CREATOR } from "../../../settings";

const effectLinks = {
    glitchtext: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
    writetext: "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html",
    advancedglow: "https://en.ephoto360.com/advanced-glow-effects-74.html",
    typographytext: "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html",
    pixelglitch: "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html",
    neonglitch: "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html",
    flagtext: "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html",
    flag3dtext: "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html",
    deletingtext: "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html",
    blackpinkstyle: "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html",
    glowingtext: "https://en.ephoto360.com/create-glowing-text-effects-online-706.html",
    underwatertext: "https://en.ephoto360.com/3d-underwater-text-effect-online-682.html",
    logomaker: "https://en.ephoto360.com/free-bear-logo-maker-online-673.html",
    cartoonstyle: "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html",
    papercutstyle: "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html",
    watercolortext: "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html",
    effectclouds: "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html",
    blackpinklogo: "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html",
    gradienttext: "https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html",
    summerbeach: "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html",
    luxurygold: "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html",
    multicoloredneon: "https://en.ephoto360.com/create-multicolored-neon-light-signatures-591.html",
    sandsummer: "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html",
    galaxywallpaper: "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html",
    "1917style": "https://en.ephoto360.com/1917-style-text-effect-523.html",
    makingneon: "https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html",
    royaltext: "https://en.ephoto360.com/royal-text-effect-online-free-471.html",
    freecreate: "https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html",
    galaxystyle: "https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html",
    lighteffects: "https://en.ephoto360.com/create-light-effects-green-neon-online-429.html"
};

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { command, text } = req.query;
    if (!command || !text) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "Parameter 'command' dan 'text' diperlukan!",
        });
    }

    const link = effectLinks[command.toLowerCase()];
    if (!link) {
        return res.status(404).json({
            status: false,
            creator: CREATOR,
            error: "Command tidak ditemukan!",
        });
    }

    try {
        const result = await ephoto(link, text);
        
        if (result.error) {
            return res.status(500).json({
                status: false,
                creator: CREATOR,
                error: "Gagal membuat efek!",
            });
        }

        res.status(200).json({
            status: true,
            creator: CREATOR,
            data: result,
        });
    } catch (error) {
        console.error("Ephoto Error:", error);
        res.status(500).json({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error",
        });
    }
}
