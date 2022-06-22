import { useState } from 'react';
import { LoginResponseBody } from './api/login';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

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
