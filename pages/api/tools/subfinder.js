import fetch from "node-fetch";
import { API_KEY, CREATOR } from '../../../settings';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { text } = req.body;

    try {
      const result = await searchSubdomains(text);
      res.status(200).json({ status: true, creator: CREATOR, data: result });
    } catch (error) {
      res.status(500).json({ status: false, creator: CREATOR, error: error.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ status: false, creator: CREATOR, error: 'Method Not Allowed' });
  }
}

async function searchSubdomains(domain) {
    const url = `https://crt.sh/?q=${domain}&output=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const subdomains = data.map(entry => entry.name_value);
        const uniqueSubdomains = [...new Set(subdomains)];
        uniqueSubdomains.sort();
        
        return uniqueSubdomains;
    } catch (error) {
        console.error('Error fetching subdomains:', error);
        return null;
    }
}
