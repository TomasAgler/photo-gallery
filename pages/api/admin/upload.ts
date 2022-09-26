import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import formidable, { IncomingForm } from 'formidable';
import { sessionOptions } from '../../../lib/session';
import { initializeDatabase, uploadImage } from '../../../lib/database';
import { isUserAdmin } from '../../../utils/auth';

// disable next.js' default body processing
export const config = {
  api: {
    bodyParser: false,
  },
};

const asyncParse: (
  req: NextApiRequest,
) => Promise<{ fields: formidable.Fields; files: formidable.Files }> = (
  req: NextApiRequest,
) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = req.session;
  if (!isUserAdmin(user)) {
    res.statusCode = 401;
    res.end();
  } else {
    try {
      const database = await initializeDatabase();
      const result = await asyncParse(req);
      Object.keys(result.files).forEach(async (key) => {
        const file = result.files[key] as formidable.File;
        const filenameSplit = String(file.originalFilename).split('.');
        const filename = filenameSplit.join('-');
        const databaseResult = await uploadImage(
          database,
          String(result.fields?.gallery),
          file.filepath,
          filename,
        );
        if (!databaseResult) {
          res.statusCode = 400;
          res.end();
        } else {
          res.statusCode = 200;
          res.json(databaseResult);
          res.end();
        }
      });
    } catch (e) {
      console.log(e);
      res.statusCode = 400;
      res.end();
    }
  }
};

export default withIronSessionApiRoute(uploadHandler, sessionOptions);
