import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { isUserAllowed } from '../../utils/auth';
import { getObject } from '../../lib/storage';
import { Readable } from 'stream';

const getContentHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.query;
  const { gallery, photo, size } = data;
  const { user } = req.session;
  if (!isUserAllowed(user, String(gallery))) {
    res.statusCode = 401;
    res.end();
  } else {
    const buffer = await getObject(String(photo), String(gallery), size as any);
    if (!buffer) {
      res.statusCode = 400;
      res.end();
    } else {
      const stream = Readable.from(buffer);
      res.writeHead(200, '', {
        'Content-Type': 'image/webp',
      });
      stream.pipe(res);
    }
  }
};

export default withIronSessionApiRoute(getContentHandler, sessionOptions);
