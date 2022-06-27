import { getReviewsByBookId, getReviewsByUserId } from '../../../util/database';

export default async function handler(req, res) {
  const bookId = req.query.bookId;

  if (req.method === 'GET') {
    {
      /* } if (userId) {
      console.log(req.query);
      const allReviewsOfUser = await getReviewsByUserId(1);
      return res.status(200).json(allReviewsOfUser);
    }
  { */
    }
    if (bookId) {
      console.log(req.query);
      const allReviewsToBook = await getReviewsByBookId(bookId);
      return res.status(200).json(allReviewsToBook);
    }








  }
}
