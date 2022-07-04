import { css } from '@emotion/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUserBySessionToken } from '../../util/database';

const wrapper = css`
  margin: 0 auto;
  width: 600px;
`;
// GET all reviews to one book

export default function BookDetails(props) {
  const [review, setReview] = useState('');
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    async function getReviewsWithUsernames() {
      const response = await fetch(`/api/reviews?bookid=${props.book.id}`); // ../api/reviews?bookId=zwfWnAEACAAJ

      const reviews = await response.json();
      setReviewsList(reviews);
    }
    getReviewsWithUsernames().catch(() => {
      console.log('Reviews request failed');
    });
  }, [props.book.id]);

  // POST a  review to a book

  async function createReviewHandler() {
    const reviewResponse = await fetch('../api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: props.book.id, // better using query here?

        review: review,
      }),
    });

    const reviewResponseBody = await reviewResponse.json();

    const username = { username: props.user.username };
    const newReviewObject = { ...username, ...reviewResponseBody };
    const newState = [...reviewsList, newReviewObject];

    setReviewsList(newState);
  }
  // add book to the readinglist

  async function addBookHandler() {
    const addBookResponse = await fetch(`../api/listedBooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: props.book.id,
      }),
    });

    const addBookResponseBody = await addBookResponse.json();
  }
  if (!props.book) {
    return <h1>Book not found</h1>;
  }
  return (
    <section css={wrapper}>
      {' '}
      <div>
        <p>{props.book.volumeInfo.title}</p>
        <p>
          {props.book.volumeInfo.authors
            ? props.book.volumeInfo.authors[0]
            : 'Unknowen'}
        </p>
        <img
          src={
            props.book.volumeInfo.imageLinks !== undefined
              ? props.book.volumeInfo.imageLinks.thumbnail
              : ''
          }
          alt="bookcover"
        />{' '}
      </div>
      <br />
      <div>
        {' '}
        <button
          onClick={() =>
            addBookHandler().catch(() => {
              console.log('Post request fails');
            })
          }
        >
          Add to your reading list
        </button>
      </div>
      <div>
        <h2> Write a review </h2>
        <div>
          {props.user ? (
            <>
              {' '}
              <label htmlFor="review">
                <textarea
                  id="review"
                  name="review"
                  value={review}
                  onChange={(event) => {
                    setReview(event.currentTarget.value);
                  }}
                />
              </label>
              <div>
                <button
                  onClick={() => {
                    createReviewHandler();
                    setReview('');
                  }}
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <div>
              <p>Please log in or register to write a review</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2> See other Reviews </h2>
        {props.user ? (
          <div>
            {reviewsList.map((listItem) => {
              return (
                <div key={`review-${listItem.review_timestamp}`}>
                  <Link href={`/readers/${listItem.review_user_id}`}>
                    {listItem.username}
                  </Link>
                  <p>{listItem.review}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>
            There is <span>1</span> review, please log in or register to read id
          </p>
        )}

        {!props.user ? (
          <div>
            <div>
              {' '}
              <Link href={`/login?returnTo=/books/${props.book.id}`}>
                Log in
              </Link>{' '}
            </div>
            <div>
              <Link href="/register">Register</Link>{' '}
            </div>
          </div>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}

// direct not loged in user to log in and than returned to this page

export async function getServerSideProps(context) {
  const bookId = context.query.bookId;

  const bookResponse = await fetch(
    `https://books.googleapis.com/books/v1/volumes/${bookId}`,
  );

  const book = await bookResponse.json();

  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  if (user) {
    return {
      props: {
        user: user,
        book: book,
      },
    };
  }

  return {
    props: {
      book: book,
    },
  };
}
