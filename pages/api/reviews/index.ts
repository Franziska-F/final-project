import { NextApiRequest, NextApiResponse } from 'next';
import {
  createReview,
  getReviewsByUserId,
  getUserBySessionToken,
} from '../../../util/database';

export type ReviewResponseBody = {
  errors: { message: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // get all reviews for one book

  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

    const id = req.query.userid as string;

    const userId = Number(id);

    if (userId) {
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

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

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
