import {
  addToConnections,
  getAllRequestsById,
  getReadersWithUsername,
  getUserBySessionToken,
} from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const pendingRequests = await getReadersWithUsername(user.id);
    // const pendingRequests = await getConnectedUserByUserId(user.id);


    return res.status(200).json(pendingRequests);
  }

  if (req.method === 'POST') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    const allRequests = await getAllRequestsById(user.id, req.body.connected_user_id);

    console.log(allRequests);

    if (allRequests) {
      res.status(400).json({
        errors: [{ message: 'You already made a request' }],
      });

      return;
    }

    const addConnection = await addToConnections(
      user.id,
      req.body.connected_user_id,
    );

    return res.status(200).json(addConnection);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
