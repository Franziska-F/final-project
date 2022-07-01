import {
  addToReadingList,
  getUserBySessionToken,
} from '../../../util/database';

export default async function handler(req, res) {
  // Add a book to readinglist
  if (req.method === 'POST') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const bookResponse = await fetch(
      `https://books.googleapis.com/books/v1/volumes/${req.body.book_id}`,
    );
    const book = await bookResponse.json();

    const addBook = await addToReadingList(
      user.id,
      req.body.book_id,
      book.volumeInfo.title,
      book.volumeInfo.authors[0],
    );

    return res.status(200).json(addBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
