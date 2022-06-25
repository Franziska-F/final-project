import { css } from '@emotion/react';
import Link from 'next/link';
import { getUserBySessionToken } from '../../util/database';

const wrapper = css`
  margin: 0 auto;
  width: 600px;
`;

export default function BookDetails(props) {
  if (!props.book) {
    return <h1>Book not found</h1>;
  }
  return (
    <div css={wrapper}>
      {' '}
      <div>
        <p>{props.book.volumeInfo.title}</p>
        <p>{props.book.volumeInfo.authors}</p>
        <img
          src={
            props.book.volumeInfo.imageLinks !== undefined
              ? props.book.volumeInfo.imageLinks.thumbnail
              : ''
          }
          alt="bookcover"
        />{' '}
      </div>
      <div>
        <h2> Write a review </h2>
        <div>
          {props.user ? (
            <form>
              <label htmlFor="review">
                <textarea id="review" name="review" rows="10" cols="33">
                  Write your review here:
                </textarea>
              </label>
              <div>
                <input type="submit" value="Submit" />
              </div>
            </form>
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
            <div>
              <p>Es war, als hätte der Himmel die Erde still geküsst</p>
            </div>
          </div>
        ) : (
          <p>
            There is <span>1</span> review, please log in or register to read id
          </p>
        )}
      </div>
      <div>
        <h2> Readers </h2>
        {props.user ? (
          <div>
            <h4>Ada</h4>
          </div>
        ) : (
          <p>Please log in or register to see other readers</p>
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

// return {
//   props: {
//     book: book,
//    },
//  };
