import { css } from '@emotion/react';
import Link from 'next/link';

const header = css`
  background-color: #333333;
  display: flex;
  justify-content: space-between;
  color: #f1f0e3;

  .links ul {
    display: flex;

    justify-content: space-evenly;
    list-style: none;
  }
  .links ul li {
    margin: 4px 8px;
  }
  .links ul a {
    cursor: pointer;
    color: #f1f0e3;
  }

  .roles {
    margin-right: 30px;
  }
  .roles ul {
    list-style: none;
    display: flex;
    justify-content: space-evenly;
  }
  .roles ul li {
    margin: 4px 8px;
  }

  .roles ul li a {
    cursor: pointer;
    color: #f1f0e3;
  }
`;

export default function Header() {
  return (
    <header css={header}>
      <div className="links">
        <ul>
          <li>
            <Link href="/">Search </Link>
          </li>
        </ul>
      </div>

      <div className="roles">
        <ul>
          <li>
            {' '}
            <Link href="/login">Login</Link>
          </li>
          <li>
            {' '}
            <Link href="/login">Logout</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/users/userProfile">Profil</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}