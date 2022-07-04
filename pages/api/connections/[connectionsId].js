// DELETE connection

import { deleteConnectionById } from '../../../util/database';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const connectionId = req.query.connectionsId;

    const removeConnection = await deleteConnectionById(connectionId);

    return res.status(200).json(removeConnection);
  } else {
    res.status(405).json({ errors: [{ message: 'Method not allowed' }] });
  }
}
