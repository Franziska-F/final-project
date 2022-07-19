import { NextApiRequest, NextApiResponse } from 'next';
import { getUserBySessionToken } from '../../util/database';

// type of response is either object with an error property that contains an array of objects with messages or user id

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Get the cookie from the request

    const token = req.cookies.sessionToken;

    if (!token) {
      res.status(400).json({ errors: [{ message: 'No sessionToken passed' }] });
    }

    // Get the user from the token
    const user = await getUserBySessionToken(token);

    if (!user) {
      res.status(400).json({ errors: [{ message: 'User not found' }] });
    }
    // return the user

    res
      .status(200)

      .json({ user: { user } });
    return;
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
