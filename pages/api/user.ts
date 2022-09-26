import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { AuthenticationType, User } from '../../types/user';

const userHandler = async (req: NextApiRequest, res: NextApiResponse<User>) => {
  if (!req.session.user) {
    req.session.user = { authType: AuthenticationType.None };
    await req.session.save();
  }
  const { user } = req.session;
  res.json(user);
};

export default withIronSessionApiRoute(userHandler, sessionOptions);
