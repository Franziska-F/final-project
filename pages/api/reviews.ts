import { NextApiRequest, NextApiResponse } from 'next';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReviewsByBookId,
  getReviewsByUserId,
  getUserBySessionToken,
} from '../../util/database';

export type ReviewResponseBody = {
  errors: { message: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewResponseBody>,
) {
  // GET-request to display all reviews at first render
  const user = await getUserBySessionToken(req.cookies.sessionToken);
  if (req.method === 'GET') {
    const allReviewsOfUser = await getReviewsByUserId(user.id);

    return res.status(200).json(allReviewsOfUser);
  }

  /* const allReviewsForBook = await getAllReviews();

    return res.status(200).json(allReviewsForBook); */

  if (typeof req.body.review !== 'string') {
    res.status(400).json({
      errors: [{ message: 'Your review is empty!' }],
    });
    return;
  }

  // POST-method for new user-reviews

  if (req.method === 'POST') {
    const newReview = await createReview(
      req.body.user_id,
      req.body.book_id,
      req.body.book_title,
      req.body.review,
    );
    return res.status(200).json(newReview);
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
