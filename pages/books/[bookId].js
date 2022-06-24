export default function BookDetails(props) {
  if (!props.book) {
    return <h1>Book not found</h1>;
  }
  return (
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
  );
}

export async function getServerSideProps(context) {
  const bookId = context.query.bookId;

  const bookResponse = await fetch(
    `https://books.googleapis.com/books/v1/volumes/${bookId}`,
  );

  const book = await bookResponse.json();
  console.log(book);

  return {
    props: {
      book: book,
    },
  };
}
