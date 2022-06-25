import { NextApiRequest, NextApiResponse } from 'next';
import {
  createReview,
  getUserBySessionToken,
  getUserByUserName,
} from '../../util/database';

export type ReviewResponseBody = {
  errors: { message: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewResponseBody>,
) {
  if (typeof req.body.review !== 'string') {
    res.status(400).json({
      errors: [{ message: 'Your review is empty!' }],
    });
    return;
  }

  if (req.method === 'POST') {
    console.log(req.body);
    const newReview = await createReview(
      req.body.user_id,
      req.body.book_id,
      req.body.review,
    );
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
