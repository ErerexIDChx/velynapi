import axios from 'axios';
import cheerio from 'cheerio';
import { URL } from 'url';
import { API_KEY, CREATOR } from '../../../settings';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, url } = req.body;

    const apiKey = req.headers['api_key'];
    if (!apiKey || !API_KEY.includes(apiKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const result = await submitAnswer(text, url);
      res.status(200).json({status: true, creator: CREATOR, data: result});
    } catch (error) {
      res.status(500).json({status: false, creator: CREATOR, error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({status: false, creator: CREATOR, error: 'Method Not Allowed' });
  }
}

async function submitAnswer(question, urlString) {
  const parsedUrl = new URL(urlString);
  const username = parsedUrl.pathname.split('/').filter(Boolean).pop();

  const postData = {
    username: username,
    question: question,
    deviceId: '',
    gameSlug: '',
    referrer: ''
  };

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
      'Referer': urlString
    }
  };

  try {
    const response = await axios.post('https://ngl.link/api/submit', new URLSearchParams(postData).toString(), axiosConfig);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}
