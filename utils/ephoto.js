import axios from "axios";
import cheerio from "cheerio";
import FormData from "form-data";

export async function ephoto(url, text) {
    try {
        // Step 1: Fetch the initial page to get the token and server details
        const { data, headers } = await axios.get(url, {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
            }
        });

        // Pastikan data adalah string HTML yang valid
        if (!data || typeof data !== "string") {
            throw new Error("Invalid HTML data received from the server.");
        }

        const $ = cheerio.load(data); // Gunakan data yang valid
        const token = $("input[name=token]").val();
        const build_server = $("input[name=build_server]").val();
        const build_server_id = $("input[name=build_server_id]").val();

        if (!token || !build_server || !build_server_id) {
            throw new Error("Failed to retrieve token or server data.");
        }

        // Step 2: Prepare the form data for the POST request
        const form = new FormData();
        form.append("text[]", text);
        form.append("token", token);
        form.append("build_server", build_server);
        form.append("build_server_id", build_server_id);

        // Step 3: Submit the form to get the JSON data
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                "Cookie": headers["set-cookie"]?.join("; ")
            }
        });

        // Pastikan response.data adalah string HTML yang valid
        if (!response.data || typeof response.data !== "string") {
            throw new Error("Invalid HTML data received from the server.");
        }

        const $$ = cheerio.load(response.data); // Gunakan response.data yang valid
        const jsonData = JSON.parse($$("input[name=form_value_input]").val() || "{}");

        if (!jsonData.text) {
            throw new Error("Failed to retrieve image data.");
        }

        // Step 4: Modify the JSON data to match the expected format
        jsonData["text[]"] = jsonData.text;
        delete jsonData.text;

        // Step 5: Submit the final request to create the image
        const { data: result } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(jsonData), {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                "Cookie": headers["set-cookie"]?.join("; ")
            }
        });

        // Step 6: Return the final image URL
        return { imageUrl: build_server + result.image };
    } catch (error) {
        console.error("Error in ephoto function:", error.message);
        return { error: error.message };
    }
}
