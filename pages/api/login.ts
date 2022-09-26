import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { AuthenticationType, User } from '../../types/user';
import { getGalleryPassword, initializeDatabase } from '../../lib/database';

const loginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<User>,
) => {
  const { password, gallery } = await req.body;
  const database = await initializeDatabase();
  const galleryPassword = getGalleryPassword(database, gallery);
  let authType = AuthenticationType.None;
  let authGallery = gallery;
  if (password === process.env.ADMIN_PASSWORD) {
    authType = AuthenticationType.Admin;
    authGallery = undefined;
  } else if (password === process.env.GENERAL_PASSWORD) {
    authType = AuthenticationType.General;
    authGallery = undefined;
  } else if (galleryPassword && password === galleryPassword) {
    authType = AuthenticationType.Gallery;
    authGallery = gallery;
  }
  const user = { authType, gallery: authGallery };
  req.session.user = user;
  await req.session.save();
  res.json(user);
};

export default withIronSessionApiRoute(loginHandler, sessionOptions);
