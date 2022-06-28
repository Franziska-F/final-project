import {
  deleteReview,
  getReviewsByBookId,
  updateReview,
} from '../../../util/database';

export default async function handler(req, res) {
  const bookId = req.query.bookId;

  if (req.method === 'GET') {
    if (bookId) {
      console.log(req.query);
      const allReviewsToBook = await getReviewsByBookId(bookId);
      return res.status(200).json(allReviewsToBook);
    }
  }

  if (req.method === 'DELETE') {
    const reviewId = req.body.id;
    const deleteById = await deleteReview(reviewId);
    return res.status(200).json(deleteById);
  }

  if (req.method === 'PUT') {
    const reviewId = req.body.id;
    if (!req.body.review) {
      return res.status(400).json({
        error: `Please don't submit an emty review`,
      });
    }

    // TODO: add a fail case when id is not a valid animalId

    const updatedReview = await updateReview(reviewId, req.body.review);

    return res.status(200).json(updatedReview);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
