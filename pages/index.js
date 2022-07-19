import Head from 'next/head';
import Image from 'next/image';
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
      <Head>
        <title> the bookclub || welcome </title>
        <meta name="description" content="a social network for book lovers" />
      </Head>
      <h1 className="text-3xl font-bold font-main my-10 text-center">
        read, write, connect
      </h1>
      <section className="py-10 flex justify-center flex-nowrap">
        <div className="py-2 flex flex-nowrap w-2/3">
          <input
            className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-2/3 mx-8"
            placeholder="Search for a book"
            onChange={(event) => {
              const title = event.currentTarget.value;

              setBookTitle(title);
            }}
          />
          <button
            className=" bg-black w-1/3 text-white rounded"
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>
      </section>
      <section className="py-10 px-8 flex justify-evenly">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8 px-8 ">
          {result.map((item) => {
            return (
              <div
                className="flex justify-center items-center py-4"
                key={item.id}
              >
                <a href={`/books/${item.id}`}>
                  <div className="flex justify-center items-center">
                    <img
                      className="rounded"
                      src={
                        item.volumeInfo.imageLinks !== undefined
                          ? item.volumeInfo.imageLinks.thumbnail
                          : ''
                      }
                      alt="bookcover"
                    />{' '}
                  </div>
                  <div className="my-4 text-center">
                    <p>{item.volumeInfo.title}</p>
                    <p>
                      {item.volumeInfo.authors
                        ? item.volumeInfo.authors[0]
                        : 'Unknowen'}
                    </p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </section>
      <section className="pb-10 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-3xl font-bold  my-10 ">read</p>
            <p>search for books and put them on your bookstack</p>
          </div>
          <div>
            <Image
              src="/img/reading.jpeg"
              alt="drawing of a reading person"
              width="750"
              height="750"
            />
          </div>
          <div>
            <img
              src="/img/write.jpeg"
              alt="drawing of a person writing on a notebook"
            />
          </div>
          <div>
            <p className="text-3xl font-bold  my-10 text-center ">write</p>
            <p className="text-center">
              loved a book? impressed? didn't like it? write your thoughts down
              and share them with other readers.{' '}
            </p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold font-main my-10 ">connect</p>
            <p>
              find other readers who love the same book as you and connect with
              them{' '}
            </p>
          </div>
          <div>
            <img src="/img/connect.jpeg" alt="drawing of two people taking" />
          </div>
        </div>
      </section>
    </div>
  );
}
