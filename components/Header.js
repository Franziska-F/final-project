import Link from 'next/link';

function Anchor({ children, ...restProps }) {
  // using a instead of Link  to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  return (
    <header className="sticky top-0 bg-white">
      <div className="flex flex-row items-center text-base pt-4 px-4 border-b border-black">
        <h1 className="basis-1/4 text-2xl hidden md:flex">the bookclub</h1>

        <img
          className=" md:hidden"
          src="/img/icon.jpg"
          alt="black and white drawing of an upright standing book with the letters b and c at the cover"
        />

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
                  <Link href="/users/userProfile" className="text-base">
                    {props.user.user.username}
                  </Link>
                )}{' '}
              </li>
              <li>
                <div className="px-4">|</div>
              </li>
              {props.user ? (
                <li>
                  <Anchor href="/logout" className="text-base">
                    logout
                  </Anchor>
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
