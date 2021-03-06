import { config } from 'dotenv';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './setPostgresDefaultsOnHeroku';

setPostgresDefaultsOnHeroku();
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
type UserWithPasswordHash = User & { password_hash: string };

export async function createUser(username: string, passwordHash: string) {
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
  session_token: string,
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

export async function deleteSession(token: string) {
  const [session] = await sql<[Session]>`
  DELETE FROM
sessions
WHERE

sessions.session_token = ${token}

RETURNING *`;

  return session;
}

export async function deleteExpiredSessions() {
  const [session] = await sql<[Session[]]>`
  DELETE FROM
sessions
WHERE

sessions.expiry_timestamp < now()

RETURNING *`;

  return session;
}

type UserProfile = {
  id: number;
  session_token: string;
  email: string;
  country: string;
  city: string;
};
export async function createUserProfile(
  user_id: User['id'],
  email: string,
  country: string,
  city: string,
  // timestamp is created by default
) {
  const [userProfil] = await sql<[UserProfile]>`INSERT INTO
userProfiles (user_id, email, country, city)
VALUES
(${user_id}, ${email}, ${country}, ${city})
RETURNING
id,
email,
country,
city
`;
  return userProfil;
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
  const [user] = await sql<[UserWithPasswordHash | undefined]>`
    SELECT
     *
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
}

export async function getUserBySessionToken(sessionToken: string) {
  if (!sessionToken) return undefined;

  const [user] = await sql<[User | undefined]>`
  SELECT
  users.id,
  users.username
  FROM
  users, sessions
  WHERE sessions.session_token = ${sessionToken} AND sessions.user_id = users.id AND sessions.expiry_timestamp > now();`;

  await deleteExpiredSessions();

  return user;
}

export type UserReview = {
  id: number;
  book_id: string;
  review: string;
  book_title: string;
};

// reviews

export async function createReview(
  user_id: User['id'],
  book_id: string,
  book_title: string,
  review: string,

  // timestamp is created by default
) {
  const [userReview] = await sql<[UserReview]>`INSERT INTO
reviews (user_id, book_id, book_title, review)
VALUES
(${user_id}, ${book_id}, ${book_title}, ${review})
RETURNING
id,
book_id,
book_title,
review

`;
  return userReview;
}

export async function getAllReviews() {
  const reviews = await sql<UserReview[]>`
  SELECT * FROM reviews`;
  return reviews;
}

export async function getReviewsByBookId(bookId: string) {
  if (!bookId) return undefined;
  const reviews = await sql`
    SELECT
    *
    FROM
      reviews
    WHERE
      book_id = ${bookId}
  `;
  return reviews;
}

export async function getReviewsByUserId(userId: number) {
  if (!userId) return undefined;
  const reviewsOfUser = await sql`
    SELECT
    *
    FROM
      reviews
    WHERE
      user_id = ${userId}
  `;
  return reviewsOfUser;
}

// Get reviews and the usernames of the authors

export async function getReviewsWithUsername(bookId: string) {
  if (!bookId) return undefined;
  const reviewsWithUsernames = await sql`
    SELECT
    reviews.user_id AS review_user_id,
    reviews.book_id AS book_id,
    reviews.review AS review,
    reviews.created_timestamp AS review_timestamp,
    users.username AS username,
    users.id AS user_id

    FROM
      reviews,
      users
    WHERE
    reviews.book_id = ${bookId} AND
    users.id = reviews.user_id



  `;
  return reviewsWithUsernames;
}

// Delete single review by review id

export async function deleteReviewById(id: number) {
  const [review] = await sql`
  DELETE FROM
    reviews
  WHERE
    reviews.id = ${id}
  RETURNING *
  `;

  return review;
}

// Edit single review by review id

export async function updateReview(id: number, review: string) {
  const [updatedReview] = await sql`
  UPDATE
  reviews
SET
review = ${review}
WHERE
id = ${id}
RETURNING
*
   `;
  return updatedReview;
}

// Adding a book to the readinglist

export type ReadingList = {
  id: number;
  user_id: number;
  book_id: string;
  book_title: string;
  book_author: string;
};

export async function addToReadingList(
  user_id: User['id'],
  book_id: string,
  book_title: string,
  book_author: string,

  // timestamp is created by default
) {
  const readingList = await sql<[ReadingList]>`INSERT INTO
readingList (user_id, book_id, book_title, book_author)
VALUES
(${user_id}, ${book_id}, ${book_title}, ${book_author})
RETURNING
id,
user_id,
book_id,
book_title,
book_author
`;
  return readingList;
}

// Get the all books of one user

export async function getlistedBooksByUserId(userId: number) {
  if (!userId) return undefined;
  const readingList = await sql<[User | undefined]>`
    SELECT
      *
    FROM
      readingList
    WHERE
      user_id = ${userId}
  `;
  return readingList;
}

// Check is Book already exist in Reading list by userId and bookId

export async function getlistedBookByIdAndUserId(
  userId: number,
  bookId: string,
) {
  if (!userId) return undefined;
  const [book] = await sql`


     SELECT
      *
    FROM
      readingList
    WHERE
      user_id = ${userId} AND book_id = ${bookId}
  `;
  return book;
}
// DELETE book from readingList

export async function deleteBook(id: number) {
  const [review] = await sql`
  DELETE FROM
    readingList
  WHERE
    readingList.id = ${id}
  RETURNING *
  `;

  return review;
}

// Add new user pair to connections

export async function addToConnections(
  user_id: User['id'],
  connected_user_id: number,

  // timestamp is created by default
) {
  const newConnection = await sql`INSERT INTO
connections (user_id, connected_user_id, current_status)
VALUES
(${user_id}, ${connected_user_id}, 'pen')
RETURNING

*

`;
  return newConnection;
}

export async function getConnectedUserByUserId(userId: number) {
  if (!userId) return undefined;
  const connectedUser = await sql<[User | undefined]>`
    SELECT
      id, user_id, connected_user_id, current_status
    FROM
      connections
    WHERE
      connected_user_id = ${userId} AND current_status = 'pen'
  `;
  return connectedUser;
}

// check if user made already request

export async function RequestByIds(userId: number, connectedUserId: number) {
  if (!userId) return undefined;
  const [isRequest] = await sql<[User | undefined]>`
    SELECT
      id, user_id, connected_user_id, current_status
    FROM
      connections
    WHERE
      (user_id = ${userId} AND
      connected_user_id = ${connectedUserId}) AND
      (current_status = 'pen' OR
      current_status = 'rej')
  `;
  await deleteExpiredRequests();

  return isRequest;
}

// get friends and their names

export type Request = {
  connected_id: number;
  username: string;
  user_id: number;
  id: number;
};

export async function getReadersWithUsername(userId: number) {
  if (!userId) return undefined;
  const readersWithNames = await sql`
    SELECT

    connections.connected_user_id AS connected_id,
    users.username AS username,
    users.id AS user_id,
    connections.id AS id

    FROM
     connections,
    users
    WHERE
    connections.connected_user_id = ${userId} AND
    users.id = connections.user_id AND
    current_status = 'pen'



  `;
  return readersWithNames;
}

// Delete friend

export async function deleteFriendById(id: number) {
  if (!id) return undefined;
  const [deletedConnection] = await sql`
  DELETE FROM
  friends
  WHERE
   id = ${id}
  RETURNING
  *
  `;

  sql`
  DELETE FROM
  friends
  WHERE
  user_id = deletedConnectionfriend_id AND
  friend_id = user_id`;

  return deletedConnection;
}

// UPDATE friendship request from pending to reject

export async function rejectConnection(id: number) {
  const [rejected] = await sql`
  UPDATE
  connections
SET
current_status = 'rej'
WHERE
id = ${id}
RETURNING
id,
user_id,
connected_user_id,
current_status`;
  return rejected;
}

// Add user as friend

export async function addToFriends(
  user_id: User['id'],
  connected_user_id: number,
) {
  const newFriend = await sql`INSERT INTO
friends (user_id, friend_id)


VALUES
(${user_id}, ${connected_user_id})


RETURNING
*

`;

  return newFriend;
}

// get friends with username

export type Friend = {
  friend_id: number;
  user_id: number;
  username: string;
  id: number;
};

export async function getFriendsWithUsername(userId: number) {
  if (!userId) return undefined;
  const friendsWithNames = await sql`


    SELECT

    friends.friend_id AS friend_id,
    users.username AS username,
    users.id AS user_id,
    friends.id AS id


    FROM
    friends,
    users
    WHERE
    (friends.user_id = ${userId} OR
  friends.friend_id = ${userId})
  AND
  (users.id = friends.user_id OR
  users.id = friends.friend_id) AND
  users.id != ${userId}
  `;
  return friendsWithNames;
}

// Get friends connected to an id

export async function getFriendsById(userId: number, friendId: number) {
  if (!userId || !friendId) return undefined;
  const friendsById = await sql<[Friend | undefined]>`

    SELECT
    *

    FROM
    friends

    WHERE
    (user_id = ${userId} AND
  friend_id = ${friendId})
  OR
  (user_id = ${friendId} AND
  friend_id = ${userId})`;

  return friendsById;
}

// Delete accepted request

export async function deleteAcceptedRequest(id: number, connected_id: number) {
  if (!id) return undefined;
  const deletedConnection = await sql`
 DELETE FROM
  connections
  WHERE
  user_id = ${id} AND
  connected_user_id = ${connected_id}
  AND
  current_status = 'pen'
  RETURNING
  *`;
  return deletedConnection;
}

// Delete expired requests (rejected or not answered requests will expire after 14 days)

export async function deleteExpiredRequests() {
  const [request] = await sql`
  DELETE FROM
connections
WHERE

connections.expiry_timestamp < now()

RETURNING *`;

  return request;
}

export async function getContactsByUserId(userId: number) {
  if (!userId) return undefined;
  const [contacts] = await sql`
  SELECT
   email,
  country,
  city
   FROM
  userProfiles
  WHERE
  user_id = ${userId}`;

  return contacts;
}
