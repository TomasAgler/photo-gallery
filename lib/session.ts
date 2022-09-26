// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { IncomingMessage } from 'http';
import type { IronSessionOptions } from 'iron-session';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { AuthenticationType, User } from '../types/user';

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'photo-gallery-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export const getUser = (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  },
) => {
  const { user } = req.session;
  if (!user) {
    return { authType: AuthenticationType.None };
  }
  return user;
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    user?: User;
  }
}
