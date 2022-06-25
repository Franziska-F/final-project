import Header from './Header';

export default function Layout(props) {
  return (
    <div>
      <Header user={props.user} displayUserProfile={props.displayUserProfile} />
      {props.children} {/* all the content of the page */}
    </div>
  );
}
