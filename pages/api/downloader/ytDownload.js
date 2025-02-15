import { API_KEY, CREATOR } from "../../../settings";
import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            creator: CREATOR,
            error: "Method Not Allowed",
        });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({
            status: false,
            creator: CREATOR,
            error: "URL is required",
        });
    }

    try {
        const ytdl = new YTDL();
        const data = await ytdl.download(url);
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

class YTDL {
  constructor() {
    this.headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Referer': 'https://id.ytmp3.mobi/',
    };
    this.urlPattern = /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)(([\w-]{11}))[\?&#]?/;
  }

  async #fetchInit() {
    const { data } = await axios.get(
      `https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`,
      { headers: this.headers }
    );
    if (!data.convertURL) throw new Error('Invalid init response');
    return data.convertURL;
  }

  async #fetchConvert(initURL, id, format) {
    const { data } = await axios.get(
      `${initURL}&v=${id}&f=${format}&_=${Math.random()}`,
      { headers: this.headers }
    );
    return data;
  }

  async #trackProgress(progressURL) {
    let progress = 0, title;
    while (progress < 3) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const { data } = await axios.get(progressURL, { headers: this.headers });
      if (data.error) throw new Error(data.error);
      progress = data.progress;
      title = data.title;
    }
    return title;
  }

  async download(url) {
    try {
      const match = url.match(this.urlPattern);
      if (!match) throw new Error('Invalid YouTube URL');
      const id = match[2];

      const processFormat = async (format) => {
        try {
          const initURL = await this.#fetchInit();
          const convertData = await this.#fetchConvert(initURL, id, format);
          const title = await this.#trackProgress(convertData.progressURL);
          return { format, url: convertData.downloadURL, title };
        } catch (error) {
          return { format, error: error.message };
        }
      };

      const results = await Promise.all([
        processFormat('mp3'),
        processFormat('mp4')
      ]);

      const output = { status: true };
      results.forEach(result => {
        output[result.format === 'mp3' ? 'audio' : 'video'] = result.url || null;
        if (result.title && !output.title) output.title = result.title;
        if (result.error) output[`${result.format}_error`] = result.error;
      });

      return output;

    } catch (error) {
      return {
        status: false,
        error: error.message,
        audio: null,
        video: null
      };
    }
  }
}
