import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../../lib/session';
import { createGallery, initializeDatabase } from '../../../lib/database';
import { isUserAdmin } from '../../../utils/auth';

const newGallery = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;
  const { user } = req.session;
  if (!isUserAdmin(user)) {
    res.statusCode = 401;
    res.end();
  } else {
    const database = await initializeDatabase();
    const result = await createGallery(database, data);
    if (!result) {
      res.statusCode = 400;
      res.end();
    } else {
      res.statusCode = 200;
      res.end();
    }
  }
};

export default withIronSessionApiRoute(newGallery, sessionOptions);
