import { GetServerSidePropsContext } from 'next';
import { getUserById, User } from '../../util/database';

type Props = {
  user?: User;
};
export default function UserProfil(props: Props) {
  console.log(props);
  if (!props.user) {
    return <h1>User not found!</h1>;
  }
  return (
    <div>
      <div className="book-list">
        <h1>Hallo, {props.user.username}</h1>
        <h2>Your books</h2>

        <div>
          <h3>Book 1</h3>
          <p>
            Es war, als hätte der Himmel die Erde still geküsst, so dass sie nun
            im Blütenschimmer von ihm träumen müsst.{' '}
          </p>
        </div>

        <div>
          <h3>Book 2</h3>
          <p>
            Es war, als hätte der Himmel die Erde still geküsst, so dass sie nun
            im Blütenschimmer von ihm träumen müsst.{' '}
          </p>
        </div>
      </div>
      <div className="connected-readers">
        <h2>Connected Readers</h2>

        <div>
          <ul>
            <li>Reader 1</li>
            <li>Reader 2</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // getting userId from url

  const userIdFromUrl = context.query.userId;

  if (!userIdFromUrl || Array.isArray(userIdFromUrl)) {
    return { props: {} };
  }

  const user = await getUserById(parseInt(userIdFromUrl));

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }
  return {
    props: {
      user: user,
    },
  };
}
