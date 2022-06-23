import { config } from 'dotenv';
import postgres from 'postgres';

config();
// Type needed for the connection function below
declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/issues/7811#issuecomment-715259370
function connectOneTimeToDatabase() {
  let sql;

  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
    // Heroku needs SSL connections but
    // has an "unauthorized" certificate
    // https://devcenter.heroku.com/changelog-items/852
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.postgresSqlClient) {
      globalThis.postgresSqlClient = postgres();
    }
    sql = globalThis.postgresSqlClient;
  }

  return sql;
}
const sql = connectOneTimeToDatabase();

export type User = {
  id: number;
  username: string;
};
type UserWithPasswordHash = User & { passwordHash: string };

export async function createUser(username: 'string', passwordHash: 'string') {
  const [user] = await sql<[User]>`INSERT INTO
users (username, password_hash)
VALUES
(${username}, ${passwordHash})
RETURNING
id,
username
`;
  return user;
}

type Session = {
  id: number;
  session_token: string;
};
export async function createSession(
  user_id: User['id'],
  session_token: 'string',
  // timestamp is created by default
) {
  const [session] = await sql<[Session]>`INSERT INTO
sessions (user_id, session_token)
VALUES
(${user_id}, ${session_token})
RETURNING
id,
session_token
`;
  return session;
}

export async function getUserByUserName(username: string) {
  if (!username) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
}

export async function getUserById(userId: number) {
  if (!userId) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${userId}
  `;
  return user;
}

// return full user from users (id, username, passwordHash)
export async function getUserWithPasswordHash(username: string) {
  if (!username) return undefined;
  const [user] = await sql<[User | undefined]>`
    SELECT
     *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
}
