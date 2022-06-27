import { GetServerSidePropsContext } from 'next';
import { useEffect, useState } from 'react';
import { getUserBySessionToken, User } from '../../util/database';

type Props = {
  user?: User;
};
export default function UserProfil(props: Props) {
  const [userReviews, setUserReviews] = useState([]);

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

  if (!props.user) {
    return <h1>User not found!</h1>;
  }
  return (
    <div>
      <div className="book-list">
        <h1>Hallo, {props.user.username}</h1>
        <h2>Your reviews</h2>
        {userReviews.map((listItem) => {
          return (
            <div key={listItem.id}>
              <div>
                <h3>{listItem.book_id}</h3>
                <p>{listItem.review}</p>
              </div>
              <div>
                <button>Edit</button>
              </div>
              <div>
                <button
                  onClick={() => {
                    console.log(listItem.book_id);
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
