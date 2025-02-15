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

    const { prompt } = req.query;
    
    try {
        const data = await magicAI(prompt);
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

async function magicAI(prompt, orientation = 'square') {
  const taskId = generateTaskId();

  try {
      const postResponse = await axios.post(
          'https://magichour.ai/api/free-tools/v1/ai-image-generator',
          {
              prompt: prompt,
              orientation: orientation,
              task_id: taskId,
          },
          {
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Accept-Encoding': 'gzip, deflate, br, zstd',
                  'Accept-Language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7',
                  'Origin': 'https://magichour.ai',
                  'Referer': 'https://magichour.ai/products/ai-image-generator',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                  'x-timezone-offset': '-420',
              },
          }
      );

      console.log('POST response:', postResponse.data);

      if (postResponse.data.status !== 'QUEUED') {
          throw new Error('Failed to queue the task.');
      }

      const statusUrl = `https://magichour.ai/api/free-tools/v1/ai-image-generator/${taskId}/status`;

      while (true) {
          await new Promise(resolve => setTimeout(resolve, 10000));

          const statusResponse = await axios.get(statusUrl, {
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Accept-Encoding': 'gzip, deflate, br, zstd',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              },
          });

          console.log('Status response:', statusResponse.data);

          if (statusResponse.data.status === 'SUCCESS') {
              console.log('Task completed:', statusResponse.data);
              return statusResponse.data;
          } else if (statusResponse.data.status === 'FAILED') {
              throw new Error('Task failed.');
          }
      }
  } catch (error) {
      console.error('Error:', error.message);
      throw error;
  }
}

function generateTaskId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let taskId = '';
  for (let i = 0; i < 34; i++) {
      if (i === 8 or i === 13 or i === 18 or i === 23) {
          taskId += '-';
      } else {
          taskId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
  }
  return taskId;
}
