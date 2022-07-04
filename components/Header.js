import { css } from '@emotion/react';
import Link from 'next/link';

export default function Header(props) {
  return (
    <header>
      <div className="flex flex-row items-center text-base py-4 px-4">
        <div className="basis-1/4 text-2xl">the bookclub</div>
        <nav className="flex justify-between basis-3/4">
          <div>
            <ul>
              <li>
                <Link href="/" className="text-base px-6">
                  search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <ul className="flex justify-around items-center px-4">
              <li>
                {' '}
                {props.user && (
                  <a href="/users/userProfile" className="text-base">
                    {props.user.user.username}
                  </a>
                )}{' '}
              </li>
              {props.user ? (
                <li>
                  <a href="/logout" className="text-base ">
                    logout
                  </a>
                </li>
              ) : (
                <>
                  <li>
                    {' '}
                    <Link href="/login" className="text-base">
                      login
                    </Link>
                  </li>
                  <li>
                    <div className="px-4">|</div>
                  </li>
                  <li>
                    <Link href="/register" className="text-base ">
                      register
                    </Link>
                  </li>{' '}
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
