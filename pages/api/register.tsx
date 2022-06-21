import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUserName } from '../../util/database';

// type of response is either object with an error property that contains an array of objects with messages or user id
export type RegisterResponseBody =
  | {
      errors: { message: string }[];
    }
  | { user: { id: number } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponseBody>,
) {
  if (
    typeof req.body.username !== 'string' ||
    typeof req.body.password !== 'string' ||
    !req.body.username ||
    !req.body.password // checking for emtpy string
  ) {
    res.status(400).json({
      errors: [{ message: 'Please choose a username and a password' }],
    });
    return;
  }
  // check method, only POST allowed

  if (req.method === 'POST') {
    if (await getUserByUserName(req.body.username)) {
      res.status(400).json({
        errors: [
          { message: 'username alredy exist, please choose different name' },
        ],
      });
      return;
    }
    // get request body

    const user = req.body;

    // get user name

    const username = user.username;
    console.log(req.body.username);

    // hash the password

    const passwordHash = await bcrypt.hash(req.body.password, 12);

    // create new user in DB
    const newUser = await createUser(req.body.username, passwordHash);

    console.log(newUser);
    res.status(200).json({
      user: {
        id: newUser.id,
      },
    });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
