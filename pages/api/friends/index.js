import {
  addToFriends,
  deleteAcceptedRequest,
  getFriendsWithUsername,
  getUserById,
  getUserBySessionToken,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);



     if (!user) {
       return res.status(400).json({
         error: 'Session token not valid',
       });
     }

    const pendingRequests = await getFriendsWithUsername(user.id);
   

    return res.status(200).json(pendingRequests);
  }

  if (req.method === 'POST') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

       if (!user) {
         return res.status(400).json({
           error: 'Session token not valid',
         });
       }

    const addFriendship = await addToFriends(
      user.id,
      req.body.connected_user_id,
    );

    console.log(addFriendship);
    const deleteUser = await deleteAcceptedRequest(
      // delete accepted requests
      req.body.connected_user_id,
      user.id,
    );

    // get Username of friend
    const addedFriend = await getUserById(addFriendship[0].friend_id);


    return res.status(200).json(addedFriend);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
