import { deleteBook } from '../../../util/database';

// DELETE book from reading list
export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const listedBookId = req.query.listedBookId;
    console.log(listedBookId);
    const removeBook = await deleteBook(listedBookId);

    return res.status(200).json(removeBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
