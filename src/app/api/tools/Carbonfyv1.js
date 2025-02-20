import fetch from 'node-fetch';
import {  CREATOR } from '../../../settings';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    try {
      const result = await CarbonifyV1(text);
      res.status(200).json({ status: true, creator: CREATOR, data: result });
    } catch (error) {
      res.status(500).json({ status: false, creator: CREATOR, error: error.message || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ status: false, creator: CREATOR, error: 'Method Not Allowed' });
  }
}

async function CarbonifyV1(input) {
  let Blobs = await fetch("https://carbonara.solopov.dev/api/cook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: input,
    }),
  }).then((response) => response.blob());
  let arrayBuffer = await Blobs.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  return buffer;
}
