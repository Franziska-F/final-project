import { useEffect, useState } from 'react';
import { getUserById } from '../../util/database';

export default function Readers(props) {
  const [readerReviews, setReaderReviews] = useState([]);

  useEffect(() => {
    async function getReviewsByUserId() {
      const response = await fetch(`/api/reviews?userid=${props.reader.id}`);
      const reviews = await response.json();
      setReaderReviews(reviews);
      console.log(reviews);
    }
    getReviewsByUserId().catch(() => {
      console.log('Reviews request fails');
    });
  }, [props.reader.id]);

  async function makeRequest() {
    const response = await fetch(`../api/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connected_user_id: props.reader.id,
      }),
    });
  }

  return (
    <>
      <h3>This is {props.reader.username}'s profile</h3>

      <h2>{props.reader.username}'s reviews</h2>
      {readerReviews.map((listItem) => {
        return (
          <div key={listItem.id}>
            <div>
              <h3>{listItem.book_title}</h3>
              <p id="review" name="review">
                {listItem.review}
              </p>
            </div>
          </div>
        );
      })}
      <div>
        <button
          onClick={() =>
            makeRequest().catch(() => {
              console.log('Post request fails');
            })
          }
        >
          Connect with {props.reader.username}
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const reader = await getUserById(context.query.userId);
  //const responseReadingList = await getlistedBooksByUserId(user.id);

  // const readingList = await JSON.parse(JSON.stringify(responseReadingList));

  if (reader) {
    return {
      props: {
        reader: reader,
        // readingList: readingList,
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
