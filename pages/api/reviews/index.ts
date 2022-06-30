import { NextApiRequest, NextApiResponse } from 'next';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByBookId,
  getReviewsByUserId,
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
    //(req.method === 'GET')
    if (Object.keys(req.query).length !== 0) {
      const bookId = req.query;

      const allReviewsToBook = await getReviewsByBookId(bookId.bookid);

      return res.status(200).json(allReviewsToBook);
    }

    // GET-request to display all reviews of a user at first render in userProfile
    else {
      // if (req.method === 'GET') {
      const user = await getUserBySessionToken(req.cookies.sessionToken);
      //  const userId = req.query;
      
      const allReviewsOfUser = await getReviewsByUserId(user.id);

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
      req.body.book_id,
      book.volumeInfo.title,
      req.body.review,
    );
    return res.status(200).json(newReview);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
