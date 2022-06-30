import {
  deleteReviewById,
  getReviewsByBookId,
  updateReview,
} from '../../../util/database';

export default async function handler(req, res) {
  //  res.status(200).json(req.query);

  if (req.method === 'GET') {
    const bookId = req.query;

    console.log(bookId);
    const allReviewsToBook = await getReviewsByBookId(bookId);
    return res.status(200).json(allReviewsToBook);
  }

  if (req.method === 'DELETE') {
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