import {
  addToReadingList,
  getlistedBookByIdAndUserId,
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

    if (await getlistedBookByIdAndUserId(user.id, req.body.book_id)) {
      res.status(400).json({
        errors: [{ message: 'This book is already on your readinglist' }],
      });
      return;
    }

    const addBook = await addToReadingList(
      user.id,
      req.body.book_id,
      book.volumeInfo.title,
      book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'undefined',
    );

    return res.status(200).json(addBook);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
