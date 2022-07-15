// DELETE connection

import { deleteConnectionById, rejectConnection } from '../../../util/database';

export default async function handler(req, res) {
  const connectionId = req.query.connectionsId;
  if (req.method === 'DELETE') {
    const removeConnection = await deleteConnectionById(connectionId);

    return res.status(200).json(removeConnection);
  }

  if (req.method === 'PUT') {
    const rejectedConnection = await rejectConnection(connectionId);

    return res.status(200).json(rejectedConnection);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
