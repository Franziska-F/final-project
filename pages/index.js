import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  function handleSearch() {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`)
      .then((res) =>
        res.json().then((response) => {
          const bookInfo = response.items[0].volumeInfo;
          console.log(response.items[0].volumeInfo);
          setResult(bookInfo);
        }),
      )
      .catch(() => {
        console.log('error');
      });
  }

  return (
    <div>
      <h1>Read, write, connect</h1>
      <div>
        <input
          placeholder="Search for a book"
          onChange={(event) => {
            const title = event.currentTarget.value;

            setBookTitle(title);
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {' '}
        <p>{result.title}</p>
        <p>{result.authors}</p>
        <img
          src={result.imageLinks ? result.imageLinks.thumbnail : '/'}
          alt={result.imageLinks ? 'bookcover' : 'No cover'}
        />
      </div>
      <br />
      <br />
      <br />
      <div>
        <Link href="/register">Register</Link>
      </div>
      <div>
        <button>Log in</button>
      </div>
      {/* }
      https://www.googleapis.com/books/v1/volumes?q=intitle:der%20fremd+inauthor:camus {*/}
    </div>
  );
}
