import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { serializedSessionTokenCookie } from '../../util/cookies';
import { createSession, getUserWithPasswordHash } from '../../util/database';

// type of response is eithr object with an error property that contains an array of objects with messages or user id
export type LoginResponseBody =
  | {
      errors: { message: string }[];
    }
  | { user: { id: number } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponseBody>,
) {
  if (req.method === 'POST') {
    if (
      typeof req.body.username !== 'string' ||
      typeof req.body.password !== 'string' ||
      !req.body.username ||
      !req.body.password // checking for emtpy string
    ) {
      res.status(400).json({
        errors: [{ message: 'Please enter username and password!' }],
      });
      return;
    }

    // this const contains the password hash and should not be exposed!
    const userWithPasswordHash = await getUserWithPasswordHash(
      req.body.username,
    );
    // when username not found :
    if (!userWithPasswordHash) {
      res.status(401).json({
        errors: [{ message: 'Username or password are wrong!' }],
      });
      return;
    }
    console.log(userWithPasswordHash);

    // cehck if entered password matches the password hash

    const passwordMatches = await bcrypt.compare(
      req.body.password,
      userWithPasswordHash.password_hash,
    );

    if (!passwordMatches) {
      res.status(401).json({
        errors: [{ message: 'Username or password are wrong!' }],
      });
      return;
    }

    const userId = userWithPasswordHash.id;

    // TODO: create a session for this user
    const sessionToken = crypto.randomBytes(80).toString('base64');

    const session = await createSession(userId, sessionToken);

    const serializedCookie = await serializedSessionTokenCookie(
      session.session_token,
    );

    // tells browser to create die cookie
    res
      .status(200)
      .setHeader('set-Cookie', serializedCookie)
      .json({ user: { id: userId } });
  } else {
    res.status(405).json({ errors: [{ message: 'method not allowed' }] });
  }
}
