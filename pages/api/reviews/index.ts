import { NextApiRequest, NextApiResponse } from 'next';
import {
  createReview,
  getReviewsByUserId,
  getReviewsWithUsername,
  getUserBySessionToken,
} from '../../../util/database';

export type ReviewResponseBody = {
  errors: { message: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewResponseBody>,
) {
  // get all reviews for one book

  if (req.method === 'GET') {
    const bookId = req.query.bookid;
    const userId = req.query.userid;
    // (req.method === 'GET')
    if (
      // (Object.keys(req.query).length !== 0) {
      bookId
    ) {
      // const allReviewsToBook = await getReviewsByBookId(bookId);

      // return res.status(200).json(allReviewsToBook);

     
      const allReviewsWithUsername = await getReviewsWithUsername(bookId);

      return res.status(200).json(allReviewsWithUsername);
    }

    // GET-request to display all reviews // of a user at first render in userProfile
    if (userId) {
      // if (req.method === 'GET') {
      // const user = await getUserBySessionToken(req.cookies.sessionToken);

      const allReviewsOfUser = await getReviewsByUserId(userId);

      return res.status(200).json(allReviewsOfUser);
    }
  }

  if (typeof req.body.review !== 'string') {
    res.status(400).json({
      errors: [{ message: 'Your review is empty!' }],
    });
    return;
  }

  // POST-method for new user-reviews

  if (req.method === 'POST') {
    // check for sessionToken!

    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const bookResponse = await fetch(
      `https://books.googleapis.com/books/v1/volumes/${req.body.book_id}`,
    );
    const book = await bookResponse.json();

    const newReview = await createReview(
      user.id,
      req.body.book_id, // how to get the bookId?
      book.volumeInfo.title,
      req.body.review,
    );
    return res.status(200).json(newReview);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
