import { addToReadingList } from '../../util/database';

export default async function handler(req, res) {
  // TODO: add a fail case when id is not a valid animalId

  if (req.method === 'POST') {
    const addBook = await addToReadingList(
      req.body.user_id,
      req.body.book_id,
      req.body.book_title,
      req.body.book_author,
    );

    return res.status(200).json(addBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
