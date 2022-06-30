import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import {
  getlistedBooksByUserId,
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

  useEffect(() => {
    async function getReviewsByUserId() {
      const response = await fetch(`../api/reviews/`);
      const reviews = await response.json();
      setUserReviews(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request fails');
    });
  }, []);

  // DELETE reviews // reviews/id
  async function deleteReviewById(id) {
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
  async function updateReview(id, editReview) {
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
      body: JSON.stringify({
        id: id,
      }),
    });
    const deletedBook = await response.json();

    console.log(deletedBook);

    // copy state
    // update copy of the state
    const newState = readingList.filter((item) => item.id !== deletedBook.id);
    // use setState func
    console.log(newState);
    setReadingList(newState);
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
      <div className="connected-readers">
        <h2>Connected Readers</h2>

        <div>
          <ul>
            <li>Reader 1</li>
            <li>Reader 2</li>
          </ul>
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

  if (user) {
    return {
      props: {
        user: user,
        readingList: readingList,
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
