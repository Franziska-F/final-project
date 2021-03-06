import 'material-react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'material-react-toastify';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import {
  getReviewsWithUsername,
  getUserBySessionToken,
} from '../../util/database';

toast.configure();
export default function BookDetails(props) {
  const [review, setReview] = useState('');
  const [reviewsList, setReviewsList] = useState(props.allReviews);

  // Notification when book added to book-stack

  const addedNotification = () => {
    toast.dark('Added to your bookstack!', {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 4000,
    });
  };

  // Notification when book is already on boock-stack

  const notAddedNotification = () => {
    toast.dark('This book is already on your bookstack!', {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 4000,
    });
  };
  // GET all reviews to one book

  // POST a  review to a book

  async function createReviewHandler() {
    const reviewResponse = await fetch('../api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: props.book.id,

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

    if (addBookResponse.status === 400) {
      notAddedNotification();
    } else {
      addedNotification();
    }
  }
  if (!props.book) {
    return <h1>Book not found</h1>;
  }
  return (
    <div>
      <Head>
        <title> the bookclub || book </title>
        <meta name="description" content="a social network for book lovers" />
      </Head>
      <section>
        {' '}
        <h2 className="p-2 text-2xl text-center mt-20">
          {props.book.volumeInfo.title}
        </h2>
        <h3 className="p-2 text-xl text-center">
          {props.book.volumeInfo.authors
            ? props.book.volumeInfo.authors[0]
            : 'Unknowen'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8 px-20 mt-2 items-center">
          <div>
            <img
              src="/img/choosing_books.jpg"
              alt="drawing of a woman choosing books from a bookshelf"
            />{' '}
          </div>
          <div className="flex flex-col justifiy-center items-center">
            <img
              className="rounded max-w-fit h-1/3 max-h-full m-8"
              src={
                props.book.volumeInfo.imageLinks !== undefined
                  ? props.book.volumeInfo.imageLinks.thumbnail
                  : ''
              }
              alt="bookcover"
            />{' '}
            <div>
              <button
                className="bg-black w-full p-2 text-white rounded"
                onClick={() => {
                  addBookHandler().catch(() => {
                    console.log('Post request fails');
                  });
                }}
              >
                put on your bookstack
              </button>
              <ToastContainer />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="text-center flex justify-center flex-col items-center">
          <h2 className="p-2 text-2xl mt-20">do you know this book? </h2>
          <h3 className="p-2 mb-10 text-lg">share your thoughts</h3>
          <div className="m-4 w-2/3 ">
            {props.user ? (
              <>
                {' '}
                <label htmlFor="review">
                  <textarea
                    className="border border-black h-64 w-full mx-4 "
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
                    className=" bg-black w-1/2 p-2 text-white rounded mt-10"
                    onClick={() => {
                      createReviewHandler().catch(() => {
                        console.log('Put request failed');
                      });
                      setReview('');
                    }}
                  >
                    submit
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p>
                  please{' '}
                  <span className="underline">
                    <Link href={`/login?returnTo=/books/${props.book.id}`}>
                      log in
                    </Link>{' '}
                  </span>
                  or
                  <span className="underline">
                    {' '}
                    <Link href="/register">register</Link>{' '}
                  </span>{' '}
                  to write a review
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="flex justify-evenly items-center mb-20">
        <div>
          <h2 className="p-2 my-14 text-2xl text-center">
            {' '}
            see what other readers wrote about this book{' '}
          </h2>
          {props.user ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 px-8 ">
              {[...reviewsList]
                .reverse()

                .map((listItem) => {
                  return (
                    <div
                      className="m-8 p-4 text-center text-md"
                      key={`review-${listItem.review_timestamp}`}
                    >
                      <Link href={`/readers/${listItem.review_user_id}`}>
                        {listItem.username}
                      </Link>
                      <p className="mt-4">{listItem.review}</p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p>
              please{' '}
              <span className="underline">
                <Link href={`/login?returnTo=/books/${props.book.id}`}>
                  log in
                </Link>{' '}
              </span>
              or
              <span className="underline">
                <Link href="/register"> register</Link>
              </span>{' '}
              to see what other readers think about this book
            </p>
          )}

          {/* } {!props.user ? (
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
          )} {*/}
        </div>
      </section>
    </div>
  );
}

// direct not loged in user to log in and than returned to this page

export async function getServerSideProps(context) {
  const bookId = context.query.bookId;

  const bookResponse = await fetch(
    `https://books.googleapis.com/books/v1/volumes/${bookId}`,
  );

  const book = await bookResponse.json();

  const reviewsResponse = await getReviewsWithUsername(bookId);

  const allReviews = await JSON.parse(JSON.stringify(reviewsResponse));

  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  if (user) {
    return {
      props: {
        user: user,
        book: book,
        allReviews: allReviews,
      },
    };
  }

  return {
    props: {
      book: book,
    },
  };
}
