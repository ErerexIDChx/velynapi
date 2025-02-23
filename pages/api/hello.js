export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Halo, ini API Velyn!' });
  } else if (req.method === 'POST') {
    const { name } = req.body;
    res.status(200).json({ message: `Halo!` });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Tidak Diizinkan`);
  }
}
