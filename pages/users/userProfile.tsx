import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { getUserBySessionToken, User } from '../../util/database';

type Props = {
  user?: User;
};
export default function UserProfil(props: Props) {
  const [userReviews, setUserReviews] = useState([]);
  const [aktiveId, setAktiveId] = useState(undefined);
  const [editReview, setEditReview] = useState('');

  useEffect(() => {
    async function getReviewsByUserId() {
      const response = await fetch(`../api/reviews/`);
      const reviews = await response.json();
      setUserReviews(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request failed');
    });
  }, []);

  // Delte reviews
  async function deleteReviewById(bookId, id) {
    const response = await fetch(`../api/reviews/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const deletedReview = await response.json();

    // copy state
    // update copy of the state
    const newState = userReviews.filter((item) => item.id !== deletedReview.id);
    // use setState func
    setUserReviews(newState);
  }

  // Uptdate reviews
  async function updateReview(bookId, id, editReview) {
    const response = await fetch(`../api/reviews/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
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
                    updateReview(
                      listItem.book_id,
                      listItem.id,
                      editReview,
                    ).catch(() => {
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
                    console.log(listItem.id);
                    deleteReviewById(listItem.book_id, listItem.id).catch(
                      () => {
                        console.log('Delete request fails');
                      },
                    );
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
                    console.log(listItem.id);
                    deleteReviewById(listItem.book_id, listItem.id).catch(
                      () => {
                        console.log('Delete request fails');
                      },
                    );
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
      <div className="readingList">
        <h2>Your reading list</h2>

        <div>
          <h4>Title</h4>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  if (user) {
    return {
      props: {
        user: user,
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
