export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  return res.status(200).json({ status: 'OK', when: new Date().toISOString() });
}
