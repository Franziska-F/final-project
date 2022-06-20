import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState([]);

  function handleSearch() {
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:der%20fremd+inauthor:camus`,
    )
      .then((res) =>
        res.json().then((response) => {
          setResult(response);
          console.log(response);
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
        <input placeholder="Search for a book" />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <button>Register</button>
      </div>
      <button>Log in</button>
      {/* }
      https://www.googleapis.com/books/v1/volumes?q=intitle:der%20fremd+inauthor:camus {*/}
    </div>
  );
}
