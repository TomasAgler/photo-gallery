import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { AuthenticationType, User } from '../../types/user';

const logoutHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<User>,
) => {
  const user: User = {
    authType: AuthenticationType.None,
  };
  req.session.user = user;
  await req.session.save();
  res.json(user);
};

export default withIronSessionApiRoute(logoutHandler, sessionOptions);
