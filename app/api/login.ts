// pages/api/login.ts
import { authenticateUser } from '@/utils/sessions';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body; // Assurez-vous que ces noms correspondent aux données envoyées

    try {
      // Utilisez 'username' et 'password' ici
      await authenticateUser(name, password);
      res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
