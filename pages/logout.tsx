import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { deleteSession } from '../util/database';

export default function Logout() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token) {
    await deleteSession(token);

    context.res.setHeader(
      'Set-Cookie',
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    );
  }

  return {
    redirect: {
      destination: `/`,
      permanent: false,
    },
  };
}
