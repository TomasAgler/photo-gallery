import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import formidable, { IncomingForm } from 'formidable';
import * as fs from 'fs';
import { sessionOptions } from '../../../lib/session';
import {
  getGalleryDetail,
  initializeDatabase,
  uploadImage,
} from '../../../lib/database';
import { isUserAdmin } from '../../../utils/auth';
import { User } from '../../../types/user';
import { ItemType } from '../../../types/database';

// disable next.js' default body processing
export const config = {
  api: {
    bodyParser: false,
  },
};

const massUploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path, gallery } = req.query;
  const { user } = req.session;
  if (!isUserAdmin(user)) {
    res.statusCode = 401;
    res.end();
  } else {
    try {
      const database = await initializeDatabase();
      const galleryData = await getGalleryDetail(
        database,
        user as User,
        String(gallery),
      );
      if (!galleryData) {
        res.statusCode = 400;
        res.end();
      }
      if (!fs.existsSync(String(path))) {
        res.statusCode = 400;
        res.end();
      }
      const existingFileNames =
        galleryData?.items
          ?.filter((x) => x.type === ItemType.Photo)
          .map((x) => String(x.photo?.fileName)) || [];
      const files = fs
        .readdirSync(String(path))
        .filter((x) => x.endsWith('.jpg'));

      for (let i = 0; i < files.length; i++) {
        const fileName = files[i];
        const normalized = fileName.split('.').join('-');
        if (existingFileNames.includes(normalized)) {
          continue;
        }
        console.log(fileName);
        await uploadImage(
          database,
          String(gallery),
          `${path}\\${fileName}`,
          normalized,
        );
      }
    } catch (e) {
      console.log(e);
      res.statusCode = 400;
      res.end();
    }
  }
};

export default withIronSessionApiRoute(massUploadHandler, sessionOptions);
