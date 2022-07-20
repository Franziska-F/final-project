import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LoginResponseBody } from './api/login';

type Props = { displayUserProfile: () => Promise<void> };
export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const loginResponseBody: LoginResponseBody = await loginResponse.json();

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return;
    }
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.displayUserProfile();
      await router.push(returnTo); // home
    } else {
      // redirect user to user profile
      // if you want to use userProfile with username redirect to /users/username
      await props.displayUserProfile();
      await router.push(`/users/userProfile`);
    }
  }

  return (
    <div>
      <Head>
        <title> the bookclub || login </title>
        <meta name="description" content="a social network for book lovers" />
      </Head>{' '}
      <h2 className="text-center text-2xl my-10 md:my-14 ">login</h2>
      <div>
        <div className="flex items-center flex-col">
          <label htmlFor="username" className="block">
            username{' '}
          </label>
          <input
            id="username"
            className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
            placeholder="username"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
          <label htmlFor="password">password </label>
          <input
            id="password"
            className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
            placeholder="password"
            value={password}
            type="password"
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />

          <button
            className="bg-black w-1/4 text-sm p-2 mt-4 text-white rounded"
            onClick={() => loginHandler()}
          >
            login
          </button>

          {errors.length
            ? errors.map((error) => (
                <span key={`error-${error.message}`}>{error.message}</span>
              ))
            : ''}
        </div>
      </div>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  // Redirect from HTTP to HTTPS on Heroku
  if (
    context.req.headers.host &&
    context.req.headers['x-forwarded-proto'] &&
    context.req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return {
      redirect: {
        destination: `https://${context.req.headers.host}/login`,
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
