import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Friend,
  getlistedBooksByUserId,
  getUserBySessionToken,
  ReadingList,
  Request,
  User,
  UserReview,
} from '../../util/database';

type Props = {
  user: User;
  readingList?: ReadingList[];
};

export default function UserProfil(props: Props) {
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [aktiveId, setAktiveId] = useState<User['id'] | undefined>(undefined);
  const [editReview, setEditReview] = useState('');
  const [readingList, setReadingList] = useState(props.readingList);

  const [requests, setRequests] = useState<Request[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    async function getReviewsByUserId() {
      const response = await fetch(`/api/reviews?userid=${props.user.id}`);
      const reviews = await response.json();
      setUserReviews(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request fails');
    });
    // GET requests
    async function getConnectedRedadersById() {
      const response = await fetch(`../api/requests`);
      const readers = await response.json();

      setRequests(readers);
    }
    getConnectedRedadersById().catch(() => {
      console.log('Reader request fails');
    });

    // GET friends
    async function getFriends() {
      const response = await fetch(`../api/friends`);
      const newState = await response.json();
      setFriends(newState);
    }

    getFriends().catch(() => {
      console.log('GET request fails');
    });
  }, [props.user.id, friends]);

  // DELETE reviews // reviews/id
  async function deleteReviewById(id: number) {
    const response = await fetch(`../api/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedReview = await response.json();
    console.log('userReviews', userReviews);
    // copy state
    // update copy of the state
    const newState = userReviews.filter((item) => item.id !== deletedReview.id);
    // use setState func
    setUserReviews(newState);
  }

  // Uptdate reviews
  async function updateReview(id: number) {
    const response = await fetch(`../api/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review: editReview,
      }),
    });
    const updatedReview = await response.json();

    // copy state
    // update copy of the state
    const newState = userReviews.map((item) => {
      if (item.id === updatedReview.id) {
        return updatedReview;
      } else {
        return item;
      }
    });

    // use setState func
    setUserReviews(newState);
  }

  // DELETE books from the reading list

  async function deleteBookById(id: number) {
    const response = await fetch(`../api/listedBooks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedBook = await response.json();
    if (readingList !== undefined) {
      const newState = readingList.filter((item) => item.id !== deletedBook.id);

      setReadingList(newState);
    } else {
      setReadingList([]);
    }
  }

  // DELETE friend

  async function deleteFriendById(id: number) {
    const response = await fetch(`../api/friends/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedConnection = await response.json();

    const newState = friends.filter((item) => item.id !== deletedConnection.id);

    setFriends(newState);
  }

  // Reject Request

  async function rejectRequest(id: number) {
    const response = await fetch(`../api/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const rejectionResponse = await response.json();

    const newState = requests.filter(
      (item) => item.user_id !== rejectionResponse.user_id,
    );

    setRequests(newState);
  }

  // POST friend (accept request)

  async function acceptRequest(connected_user_id: number) {
    await fetch(`../api/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connected_user_id: connected_user_id,
      }),
    });

    // const acceptRequestResponse = await response.json();

    setFriends([...friends]);
  }

  return (
    <div>
      <Head>
        <title> the bookclub || your profile </title>
        <meta name="description" content="a social network for book lovers" />
      </Head>
      <h1 className="p-2 text-2xl text-center mt-20">
        hello, {props.user.username}
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-20 mt-10">
        <div>
          <img
            src="../img/book_stack.jpg"
            alt="drawing of a stack of books"
            className="w-full"
          />
        </div>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-4 gap-y-8 px-8 items-center max-h-96 overflow-auto">
            <h2 className="text-center text-2xl pt-10">your bookstack</h2>
            {!readingList
              ? null
              : readingList.map((item) => {
                  return (
                    <div
                      className="grid justify-items-center"
                      key={`readingList-${item.id}`}
                    >
                      <h4 className="font-semibold">{item.book_title}</h4>
                      <h4>{item.book_author}</h4>
                      <button
                        className="bg-black w-1/5 text-sm px-1 text-white rounded"
                        onClick={() =>
                          deleteBookById(item.id).catch(() => {
                            console.log('Delete request fails');
                          })
                        }
                      >
                        delete
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>
      {/* } reviews {*/}
      <section className="my-20">
        <h2 className="text-center text-2xl">your reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 px-20 mt-14">
          {userReviews.map((listItem) => {
            return listItem.id === aktiveId ? (
              <div className="text-center flex justify-center flex-col items-center">
                <div key={listItem.id}>
                  <h3 className="text-center my-4">{listItem.book_title}</h3>
                  <div>
                    <label htmlFor="review">
                      <textarea
                        className="border border-black h-4/5 w-full mx-4 my-2"
                        id="review"
                        name="review"
                        value={editReview}
                        onChange={(event) =>
                          setEditReview(event.currentTarget.value)
                        }
                      />
                    </label>

                    <button
                      className="bg-black w-1/4 text-sm px-1 m-1 text-white rounded"
                      onClick={() => {
                        setAktiveId(undefined);
                        setEditReview(listItem.review);
                        updateReview(listItem.id).catch(() => {
                          console.log('Put request fails');
                        });
                      }}
                    >
                      save
                    </button>

                    <button
                      className="bg-black w-1/4 text-sm px-1 m-1 text-white rounded"
                      onClick={() => {
                        deleteReviewById(listItem.id).catch(() => {
                          console.log('Delete request fails');
                        });
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center flex justify-center flex-col items-center">
                <div key={listItem.id}>
                  <h3 className="text-center my-4">{listItem.book_title}</h3>
                  <div>
                    <label htmlFor="review">
                      <textarea
                        className=" h-4/5 w-full mx-4 my-2"
                        id="review"
                        name="review"
                        value={listItem.review}
                        disabled
                        onChange={(event) =>
                          setEditReview(event.currentTarget.value)
                        }
                      />
                    </label>

                    <button
                      className="bg-black w-1/4 text-sm px-1 m-1 text-white rounded"
                      onClick={() => {
                        setAktiveId(listItem.id);
                        setEditReview(listItem.review);
                      }}
                    >
                      edit
                    </button>

                    <button
                      className="bg-black w-1/4 text-sm px-1 m-1 text-white rounded"
                      onClick={() => {
                        deleteReviewById(listItem.id).catch(() => {
                          console.log('Delete request fails');
                        });
                      }}
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mt-20">
        {/* } friends {*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-20">
          <div>
            <h2 className="text-2xl text-center mb-10">your friends</h2>
            <div>
              {friends.length ? (
                friends.map((item) => {
                  return (
                    <div
                      className="flex flex-col items-center"
                      key={`connections-${item.id}`}
                    >
                      <div className="mt-1 ">
                        <Link href={`/readers/${item.user_id}`}>
                          {item.username}
                        </Link>
                      </div>

                      <button
                        className="bg-black w-1/5 text-sm px-1 m-1 text-white rounded"
                        onClick={() =>
                          deleteFriendById(item.id).catch(() => {
                            console.log('Delete request fails');
                          })
                        }
                      >
                        delete
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center  m-4  p-4 ">no friends yet </div>
              )}
            </div>
          </div>
          <div className="mb-20">
            {/* }friendship requests {*/}
            <h2 className="text-2xl text-center mb-8 ">friendship requests</h2>
            <h3 className="text-center mb-1">
              your location and email address will be visible to accepted
              friends
            </h3>
            <div>
              <div>
                {requests.length ? (
                  requests.map((item) => {
                    return (
                      <div
                        className="flex flex-col items-center"
                        key={`connections-${item.id}`}
                      >
                        <h4>{item.username}</h4>

                        <button
                          className="bg-black w-1/5 text-sm px-1 m-1 text-white rounded"
                          onClick={() =>
                            rejectRequest(item.id).catch(() => {
                              console.log('Put request failed');
                            })
                          }
                        >
                          reject
                        </button>
                        <button
                          className="bg-black w-1/5 text-sm px-1 text-white rounded"
                          onClick={
                            () => acceptRequest(item.user_id) // .catch(() => {
                            // console.log('Post request fails');
                            // })
                          }
                        >
                          accept
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center m-4  p-4 ">no requests </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  if (user) {
    const responseReadingList = await getlistedBooksByUserId(user.id);

    const readingList = await JSON.parse(JSON.stringify(responseReadingList));

    return {
      props: {
        user: user,
        readingList: readingList,
        // usersFriends: usersFriends,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/users/userProfile`,
      permanent: false,
    },
  };
}
