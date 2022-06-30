import { deleteBook } from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const removeBook = await deleteBook(req.body.id);

    return res.status(200).json(removeBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
