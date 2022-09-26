import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Readable } from 'stream';
import { sessionOptions } from '../../lib/session';
import { isUserAllowed } from '../../utils/auth';
import { getObject } from '../../lib/storage';

export const config = {
  api: {
    responseLimit: false,
  },
};

const downloadPhotoHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const data = req.query;
  const { gallery, photo } = data;
  const { user } = req.session;
  if (!isUserAllowed(user, String(gallery))) {
    res.statusCode = 401;
    res.end();
  } else {
    const buffer = await getObject(String(photo), String(gallery), 'original');
    if (!buffer) {
      res.statusCode = 400;
      res.end();
    } else {
      const stream = Readable.from(buffer);
      res.writeHead(200, '', {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename=image.png',
      });
      stream.pipe(res);
    }
  }
};

export default withIronSessionApiRoute(downloadPhotoHandler, sessionOptions);
