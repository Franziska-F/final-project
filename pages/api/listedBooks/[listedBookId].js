import { deleteBook, getUserBySessionToken } from '../../../util/database';

// DELETE book from reading list
export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

    const listedBookId = req.query.listedBookId;
    console.log(listedBookId);
    const removeBook = await deleteBook(listedBookId);

    return res.status(200).json(removeBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
