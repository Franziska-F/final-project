import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const registerResponseBody = await registerResponse.json();
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
      <div>
        <button onClick={() => registerHandler()}>Register</button>
      </div>
    </div>
  );
}
