// DELETE connection

import {
  deleteConnectionById,
  getUserBySessionToken,
  rejectConnection,
} from '../../../util/database';

export default async function handler(req, res) {
  const requestId = req.query.requestsId;

  if (req.method === 'DELETE') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }
    const removeConnection = await deleteConnectionById(requestId);

    return res.status(200).json(removeConnection);
  }

  if (req.method === 'PUT') {
    const user = await getUserBySessionToken(req.cookies.sessionToken);

    if (!user) {
      return res.status(400).json({
        error: 'Session token not valid',
      });
    }

    const rejectedConnection = await rejectConnection(requestId);

    return res.status(200).json(rejectedConnection);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
