import { deleteFriendById } from '../../../util/database';

// DELETE friend from friends
export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const friendId = req.query.friendId;

    const removeFriend = await deleteFriendById(friendId);
   

    return res.status(200).json(removeFriend);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
