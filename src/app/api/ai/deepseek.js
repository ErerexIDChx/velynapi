import axios from "axios";
import FormData from "form-data";
import { CREATOR } from "../../../settings";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { prompt } = req.query;
    
    try {
        const data = await deepSeekThink.chat(prompt);
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
