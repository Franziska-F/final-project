import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import {
  getConnectedUserByUserId,
  getlistedBooksByUserId,
  getUserById,
  getUserBySessionToken,
  User,
} from '../../util/database';

type Props = {
  user?: User;
};
export default function UserProfil(props: Props) {
  const [userReviews, setUserReviews] = useState([]);
  const [aktiveId, setAktiveId] = useState(undefined);
  const [editReview, setEditReview] = useState('');
  const [readingList, setReadingList] = useState(props.readingList);
  const [connectedReaders, setConnectedReaders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function getReviewsByUserId() {
      const response = await fetch(`/api/reviews?userid=${props.user.id}`);
      const reviews = await response.json();
      setUserReviews(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request fails');
    });
    // GET connected readers
    async function getConnectedRedadersById() {
      const response = await fetch(`../api/connections`);
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

    // copy state
    // update copy of the state
    const newState = userReviews.filter((item) => item.id !== deletedReview.id);
    // use setState func
    setUserReviews(newState);
  }

  // Uptdate reviews
  async function updateReview(id: number, editReview) {
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

  async function deleteBookById(id) {
    const response = await fetch(`../api/listedBooks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedBook = await response.json();

    const newState = readingList.filter((item) => item.id !== deletedBook.id);

    setReadingList(newState);
  }

  // DELETE connected reader

  async function deleteFriendById(id) {
    const response = await fetch(`../api/friends/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const deletedConnection = await response.json();
    console.log('friend', friends);
    console.log('deletedConnection', deletedConnection);

    const newState = friends.filter((item) => item.id !== deletedConnection.id);

    setFriends(newState);
  }

  async function rejectRequest(id: number) {
    const response = await fetch(`../api/connections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const rejectionResponse = await response.json();

    console.log('request', requests);
    console.log('response', rejectionResponse);
    const newState = requests.filter(
      (item) => item.user_id !== rejectionResponse.user_id,
    );

    setRequests(newState);
  }

  // POST friend (accept request)

  async function acceptRequest() {
    const response = await fetch(`../api/friends`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connected_user_id: props.reader[0].user_id, // CHange this
      }),
    });

    const acceptRequestResponse = await response.json();
    console.log('response', acceptRequestResponse);
    console.log('friends', friends);

    const newState = [...friends, acceptRequestResponse];
    console.log(newState);
    setFriends(newState);
  }

  return (
    <div>
      <div className="book-list">
        <h1>Hallo, {props.user.username}</h1>
        <h2>Your reviews</h2>
        {userReviews.map((listItem) => {
          return listItem.id === aktiveId ? (
            <div key={listItem.id}>
              <div>
                <h3>{listItem.title}</h3>
                <label htmlFor="review">
                  <textarea
                    id="review"
                    name="review"
                    value={editReview}
                    onChange={(event) =>
                      setEditReview(event.currentTarget.value)
                    }
                  />
                </label>
              </div>
              <div>
                <button
                  onClick={() => {
                    setAktiveId(undefined);
                    setEditReview(listItem.review);
                    updateReview(listItem.id, editReview).catch(() => {
                      console.log('Put request fails');
                    });
                  }}
                >
                  Save
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    deleteReviewById(listItem.id).catch(() => {
                      console.log('Delete request fails');
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <div key={listItem.id}>
                <h3>{listItem.book_title}</h3>
                <label htmlFor="review">
                  <textarea
                    id="review"
                    name="review"
                    value={listItem.review}
                    disabled
                    onChange={(event) =>
                      setEditReview(event.currentTarget.value)
                    }
                  />
                </label>
              </div>

              <div>
                <button
                  onClick={() => {
                    setAktiveId(listItem.id);
                    setEditReview(listItem.review);
                  }}
                >
                  Edit
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    deleteReviewById(listItem.id).catch(() => {
                      console.log('Delete request fails');
                    });
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          );
        })}
      </div>
      {/*} friends {*/}
      <div className="connected-readers border border-black m-4 p-4 ">
        <h2>friends</h2>

        <div>
          {friends.length ? (
            friends.map((item) => {
              return (
                <div className="connectionsList" key={`connections-${item.id}`}>
                  <h4>{item.username}</h4>

                  <button
                    className="border border-black m-4 p-4"
                    onClick={() =>
                      deleteFriendById(item.id).catch(() => {
                        console.log('Delete request fails');
                      })
                    }
                  >
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <div>no friends yet </div>
          )}
        </div>
      </div>

      {/* }friendship requests {*/}
      <div className=" border border-black m-4 p-4 ">
        <h2>friendship requests</h2>

        <div>
          {requests.length ? (
            requests.map((item) => {
              return (
                <div className="connectionsList" key={`connections-${item.id}`}>
                  <h4>{item.username}</h4>

                  {/* } <button
                  onClick={() =>
                    deleteConnectionById(item.id).catch(() => {
                      console.log('Delete request fails');
                    })
                  }
                >
                  Delete
              </button>  {*/}
                  <button
                    className="border border-black rounded p-2 m-2"
                    onClick={() =>
                      rejectRequest(item.id).catch(() => {
                        console.log('Put request failed');
                      })
                    }
                  >
                    reject
                  </button>
                  <button
                    className="border border-black rounded p-2 m-2"
                    onClick={
                      () => acceptRequest() //.catch(() => {
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
            <div>No requests </div>
          )}
        </div>
      </div>

      {readingList.map((item) => {
        return (
          <div className="readingList" key={`readingList-${item.id}`}>
            <h2>Your reading list</h2>
            <h4>{item.book_title}</h4>
            <h4>{item.book_author}</h4>
            <button
              onClick={() =>
                deleteBookById(item.id).catch(() => {
                  console.log('Delete request fails');
                })
              }
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserBySessionToken(context.req.cookies.sessionToken);
  const responseReadingList = await getlistedBooksByUserId(user.id);

  const readingList = await JSON.parse(JSON.stringify(responseReadingList));

  const reader = await getConnectedUserByUserId(user.id);
console.log(reader);
  if (user) {
    return {
      props: {
        user: user,
        readingList: readingList,
        reader: reader,
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
