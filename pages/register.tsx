import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

type Props = { displayUserProfile: () => Promise<void> };
export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        country: country,
        city: city,
      }),
    });
    const registerResponseBody: RegisterResponseBody =
      await registerResponse.json();

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return;
    }

    // redirect user to home

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await router.push(returnTo);
    } else {
      // redirect user to user profile
      // if you want to use userProfile with username redirect to /users/username
      // await router.push(`/users/${loginResponseBody.user.id}`);
      await props.displayUserProfile();
      await router.push(`/`);
    }
  }

  return (
    <div className="mb-20">
      <Head>
        <title> the bookclub || register </title>
        <meta name="description" content="a social network for book lovers" />
      </Head>{' '}
      <h2 className="text-center text-2xl my-10 md:my-14">register</h2>
      <div className="flex items-center flex-col">
        <label htmlFor="username">please choose a username</label>
        <input
          className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
          id="username"
          placeholder="username"
          value={username}
          onChange={(event) => {
            setUsername(event.currentTarget.value);
          }}
        />{' '}
      </div>
      <div className="flex items-center flex-col">
        <label htmlFor="password">please choose a password </label>{' '}
        <input
          className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
          id="password"
          placeholder="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
          }}
        />
        
      </div>
      <div className="flex items-center flex-col">
        <label htmlFor="location">location</label>
        <input
          className="border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
          id="location"
          placeholder="location"
          value={city}
          onChange={(event) => {
            setCity(event.currentTarget.value);
          }}
        />
      </div>
      <div className="flex items-center flex-col">
        <label htmlFor="country">country</label>
        <input
          className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
          id="country"
          placeholder="country"
          value={country}
          onChange={(event) => {
            setCountry(event.currentTarget.value);
          }}
        />
      </div>
      <div className="flex items-center flex-col">
        <label htmlFor="mail">email</label>
        <input
          className=" border border-black rounded focus:border-blue-400 py-2 px-3 w-1/3 m-4"
          id="mail"
          placeholder="email"
          value={email}
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
        />
      </div>
      <div className="flex items-center flex-col">
        <button
          className="bg-black w-1/4 text-sm p-2 mt-4 text-white rounded"
          onClick={() => registerHandler()}
        >
          register
        </button>
        {errors.length
          ? errors.map((error) => (
              <span key={`error-${error.message}`}>{error.message}</span>
            ))
          : ''}
      </div>
    </div>
  );
}
