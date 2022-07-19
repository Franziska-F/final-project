import {
  deleteReviewById,
  getReviewsByBookId,
  getUserBySessionToken,
  updateReview,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

    const bookId = req.query;

    const allReviewsToBook = await getReviewsByBookId(bookId);
    return res.status(200).json(allReviewsToBook);
  }

  if (req.method === 'DELETE') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

    const reviewId = req.query;

    const deleteById = await deleteReviewById(reviewId.reviewId);
    return res.status(200).json(deleteById);
  }

  if (req.method === 'PUT') {
    if (!req.body.review) {
      return res.status(400).json({
        error: `Please don't submit an emty review`,
      });
    }

    // TODO: add a fail case when id is not a valid animalId
    const reviewId = req.query;

    const updatedReview = await updateReview(
      reviewId.reviewId,
      req.body.review,
    );

    return res.status(200).json(updatedReview);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
