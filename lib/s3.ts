import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import internal from 'stream';
import { Database } from '../types/database';
import { streamToBuffer, streamToString } from '../utils/stream';
import { s3Client } from './s3client';

export const getJsonObject: <T>(key: string) => Promise<T | undefined> = async <
  T,
>(
  key: string,
) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };
  try {
    const response = await s3Client.send(new GetObjectCommand(input));
    const string = await streamToString(response.Body as internal.Readable);
    return JSON.parse(string) as T;
  } catch (e) {
    return undefined;
  }
};

export const openDatabase = async () => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: '_database.json',
  };
  try {
    const response = await s3Client.send(new GetObjectCommand(input));
    const string = await streamToString(response.Body as internal.Readable);
    return JSON.parse(string) as Database;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};

export const writeDatabase = async (database: Database) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: '_database.json',
    Body: JSON.stringify(database),
  };
  try {
    await s3Client.send(new PutObjectCommand(input));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};

export const writeFolder = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };
  try {
    await s3Client.send(new PutObjectCommand(input));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};

export const writeFile = async (key: string, data: Buffer) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: data,
  };
  try {
    await s3Client.send(new PutObjectCommand(input));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};

export const loadFile = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };
  try {
    const response = await s3Client.send(new GetObjectCommand(input));
    return await streamToBuffer(response.Body as internal.Readable);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};

export const deleteFile = async (key: string) => {
  const input = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  };
  try {
    await s3Client.send(new DeleteObjectCommand(input));
    return true;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    }
    return undefined;
  }
};
