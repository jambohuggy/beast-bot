export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).send('Lambda pinged successfully!');
    } else {
      res.status(405).send('Method not allowed');
    }
  }