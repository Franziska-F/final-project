import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState([]);
  const [bookTitle, setBookTitle] = useState('');
  function handleSearch() {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`)
      .then((res) =>
        res.json().then((response) => {
          const bookInfo = response.items;

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
        <button onClick={() => handleSearch()}>Search</button>
      </div>
      <div>
        {result.map((item) => {
          return (
            <div key={item.id}>
              <a href={`/books/${item.id}`}>
                <p>{item.volumeInfo.title}</p>
                <p>{item.volumeInfo.authors}</p>
                <img
                  src={
                    item.volumeInfo.imageLinks !== undefined
                      ? item.volumeInfo.imageLinks.thumbnail
                      : ''
                  }
                  alt="bookcover"
                />{' '}
              </a>
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <br />
      <div>
        <Link href="/register">Register</Link>
      </div>
      <div>
        <Link href="/login">Login</Link>
      </div>
      {/* }
      https://www.googleapis.com/books/v1/volumes?q=intitle:der%20fremd+inauthor:camus {*/}
    </div>
  );
}
