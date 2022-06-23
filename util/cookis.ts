import cookie from 'cookie';

export function serializedSessionTokenCookie(token: string) {
  // in production or in development?
  const isProduction = process.env.NODE_ENV === 'production';

  const maxAge = 60 * 60 * 24; // 24 hour

  return cookie.serialize('sessionToken', token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge + 1000),

    httpOnly: true,
    secure: isProduction,
    path: '/',
    // Be explicit about new default behavior
    // in browsers
    // https://web.dev/samesite-cookies-explained/
    sameSite: 'lax', // no cookies to other sides!
  });
}
