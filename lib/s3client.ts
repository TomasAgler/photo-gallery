// Create service client module using ES6 syntax.
import { S3Client } from '@aws-sdk/client-s3';
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: process.env.AMAZON_REGION,
  credentials: {
    accessKeyId: String(process.env.AMAZON_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AMAZON_SECRET_ACCESS_KEY),
  },
});
export { s3Client };
