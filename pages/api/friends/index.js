import {
  addToConnections,
  addToFriends,
  deleteAcceptedRequest,
  friendWithNames,
  getConnectedUserByUserId,
  getFriendsWithUsername,
  getFriendWithUsername,
  getReadersWithUsername,
  getUserById,
  getUserBySessionToken,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const pendingRequests = await getFriendsWithUsername(user.id);
    // const pendingRequests = await getConnectedUserByUserId(user.id);

    return res.status(200).json(pendingRequests);
  }

  if (req.method === 'POST') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

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
    // console.log('id', addFriendship[0].id);
    // get Username of friend
    const addedFriend = await getUserById(addFriendship[0].friend_id);

    // console.log('API', addFriendship);

    // console.log('new Friend', newFriend);

    return res.status(200).json(addedFriend);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
