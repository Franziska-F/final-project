import {
  addToConnections,
  getReadersWithUsername,
  getUserBySessionToken,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const reader = await getReadersWithUsername(user.id);

    return res.status(200).json(reader);
  }

  if (req.method === 'POST') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);
    console.log(req.body.connected_user_id);
    const addBook = await addToConnections(user.id, req.body.connected_user_id);

    return res.status(200).json(addBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
