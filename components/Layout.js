import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header />
      {props.children} {/* all the content of the page */}
    </div>
  );
}
