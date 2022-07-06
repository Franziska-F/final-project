import {
  addToConnections,
  addToFriends,
  deleteAcceptedRequest,
  getConnectedUserByUserId,
  getFriendsWithUsername,
  getReadersWithUsername,
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
    console.log(req.body.connected_user_id);
    const addFriend = await addToFriends(user.id, req.body.connected_user_id);

    const deleteUser = await deleteAcceptedRequest(
      req.body.connected_user_id,
  
      user.id,
    );

    console.log('API', addFriend);

    return res.status(200).json(addFriend);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
