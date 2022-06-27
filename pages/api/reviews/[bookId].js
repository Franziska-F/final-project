import { deleteReview, getReviewsByBookId } from '../../../util/database';

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
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
