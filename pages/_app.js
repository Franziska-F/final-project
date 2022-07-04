import '../styles/globals.css';
import { css, Global } from '@emotion/react';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  const displayUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/userDisplay');

    const profileResponseBody = await profileResponse.json();

    if (!('errors' in profileResponseBody)) {
      setUser(profileResponseBody.user);
    } else {
      profileResponseBody.errors.forEach((error) => console.log(error.message));
      setUser(undefined);
    }
  }, []);

  useEffect(() => {
    displayUserProfile().catch(() => console.log('fetch api failed'));
  }, [displayUserProfile]);

  return (
    <>
      {' '}
      <Global
        styles={css`
          html,
          body {
            padding: 0;
            margin: 0;
          }
          * {
            box-sizing: border-box;
          }
        `}
      />
      <Layout user={user}>
        <Component {...pageProps} displayUserProfile={displayUserProfile} />
      </Layout>
    </>
  );
}

export default MyApp;
