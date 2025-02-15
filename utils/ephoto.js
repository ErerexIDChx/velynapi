import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";

export async function ephoto(url, text) {
    try {
        
        const { data, headers } = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        let token = $("input[name=token]").val();
        let build_server = $("input[name=build_server]").val();
        let build_server_id = $("input[name=build_server_id]").val();

        if (!token || !build_server || !build_server_id) {
            throw new Error("Gagal mengambil token atau data server.");
        }

        
        let form = new FormData();
        form.append("text[]", text);
        form.append("token", token);
        form.append("build_server", build_server);
        form.append("build_server_id", build_server_id);

        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                "Cookie": headers["set-cookie"]?.join("; ")
            }
        });

        const $$ = cheerio.load(response.data);
        let jsonData = JSON.parse($$("input[name=form_value_input]").val() || "{}");

        if (!jsonData.text) {
            throw new Error("Gagal mendapatkan data gambar.");
        }

        jsonData["text[]"] = jsonData.text;
        delete jsonData.text;

        
        const { data: result } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(jsonData), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                "Cookie": headers["set-cookie"]?.join("; ")
            }
        });

        return { imageUrl: build_server + result.image };
    } catch (error) {
        console.error("Error pada ephoto:", error.message);
        return { error: error.message };
    }
}
