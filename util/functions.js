export default function handleSearch() {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookTitle}`)
    .then((res) =>
      res.json().then((response) => {
        const bookInfo = response.items;

        setResult(bookInfo);
        console.log('this is the result', result);
      }),
    )
    .catch(() => {
      console.log('error');
    });
}
