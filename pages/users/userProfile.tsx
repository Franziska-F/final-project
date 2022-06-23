import { GetServerSidePropsContext } from 'next';
import { getUserBySessionToken, User } from '../../util/database';

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
  const user = await getUserBySessionToken(context.req.cookies.sessionToken);

  if (user) {
    return {
      props: {
        user: user,
      },
    };
  }
  return {
    redirect: {
      destination: `/login?returnTo=/users/userProfile`,
      permanent: false,
    },
  };
}
