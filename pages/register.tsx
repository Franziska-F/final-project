import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { useState } from 'react';
import { RegisterResponseBody } from './api/register';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
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

      await router.push(`/`);
  }

  return (
    <div>
      {' '}
      <h2>Register</h2>
      <div>
        <label>
          <input
            placeholder="username"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      <div>
        <label>
          <input
            placeholder="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      {/* }   <div>
        <label>
          <input
            placeholder="First Name"
            value={firstName}
            onChange={(event) => {
              setFirstName(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      <div>
        <label>
          <input
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => {
              setLastName(event.currentTarget.value);
            }}
          />
        </label>{' '}
          </div> {*/}
      <div>
        <label>
          <input
            placeholder="Location"
            value={city}
            onChange={(event) => {
              setCity(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      <div>
        <label>
          <input
            placeholder="country"
            value={country}
            onChange={(event) => {
              setCountry(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      <div>
        <label>
          <input
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
            }}
          />
        </label>{' '}
      </div>
      <div>
        <button onClick={() => registerHandler()}>Register</button>
        {errors.length
          ? errors.map((error) => (
              <span key={`error-${error.message}`}>{error.message}</span>
            ))
          : ''}
      </div>
    </div>
  );
}
