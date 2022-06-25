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
      {' '}
      <h2>Login</h2>
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
      <div>
        <button onClick={() => loginHandler()}>Login</button>
        {errors.length
          ? errors.map((error) => (
              <span key={`error-${error.message}`}>{error.message}</span>
            ))
          : ''}
      </div>
    </div>
  );
}
