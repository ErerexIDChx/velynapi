import axios from "axios";
import FormData from "form-data";
import { CREATOR } from "../../../../settings";  // Sesuaikan path settings.js

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get("input");

    if (!prompt) {
        return new Response(JSON.stringify({
            status: false,
            creator: CREATOR,
            error: "Missing input parameter"
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const data = await deepSeekThink.chat(prompt);
        return new Response(JSON.stringify({
            status: true,
            creator: CREATOR,
            data: data
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            status: false,
            creator: CREATOR,
            error: "Internal Server Error"
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

const deepSeekThink = {
    chat: async (question) => {
        let d = new FormData();
        d.append("content", `User: ${question}`);
        d.append("model", "@groq/deepseek-r1-distill-llama-70b");

        let head = {
            headers: {
                ...d.getHeaders()
            }
        };

        let { data: ak } = await axios.post("https://mind.hydrooo.web.id/v1/chat", d, head);

        let rep = ak.result.replace(/<think>\n\n<\/think>\n\n/g, "");

        return rep;
    }
};
