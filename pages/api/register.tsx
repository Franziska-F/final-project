import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

// type of response is either object with an error property that contains an array of objects with messages or user id
type RegisterResponseBody =
  | {
      errors: { message: string }[];
    }
  | { user: { id: number } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  // check method, only POST allowed

  if (req.method === 'POST') {
    // get request body

    const user = req.body;
    console.log('req.body', user);

    // get user name

    const username = user.username;
    console.log(req.body.username);

    // hash the password
    console.log(req.body.password);
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    console.log(passwordHash);
    res.status(200).json({ user: { id: 1 } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
