import * as fs from 'fs';
import sharp from 'sharp';
import {
  Database,
  EmptyDatabase,
  Gallery,
  Item,
  ItemType,
} from '../types/database';
import { User } from '../types/user';
import { IMAGE_LG, IMAGE_SM, IMAGE_THUMB } from '../utils/const';
import { guidGenerator } from '../utils/guid';
import { mapGalleryDetail, mapGalleryPreview } from './mapper';
import {
  openDatabase,
  writeDatabase,
  writeFile,
  writeFolder,
  deleteFile,
} from './s3';

export const initializeDatabase = async () => {
  const loaded = await openDatabase();
  if (loaded !== undefined) {
    return { ...loaded };
  }
  await writeDatabase(EmptyDatabase);
  return EmptyDatabase;
};

export const getGalleryList = (database: Database, user: User) => {
  return database.galleries.map((x) => mapGalleryPreview(x, user));
};

export const getGalleryDetail = (
  database: Database,
  user: User,
  gallery: string,
) => {
  const foundGallery = database.galleries.find((x) => x.id === gallery);
  if (!foundGallery) {
    return undefined;
  }
  return mapGalleryDetail(foundGallery, user);
};

export const getGalleryPassword = (database: Database, galleryId: string) => {
  const gallery = database.galleries.find((x) => x.id === galleryId);
  if (!gallery) {
    return undefined;
  }
  return gallery.localPassword;
};

export const createGallery = async (database: Database, data: Gallery) => {
  const existingGallery = database.galleries.find((x) => x.id === data.id);
  if (existingGallery) {
    return false;
  }
  await writeFolder(`${data.id}/`);
  await writeFolder(`${data.id}/${IMAGE_THUMB}/`);
  await writeFolder(`${data.id}/${IMAGE_SM}/`);
  await writeFolder(`${data.id}/${IMAGE_LG}/`);
  await writeFolder(`${data.id}/original/`);
  database.galleries.push(data);
  await writeDatabase(database);
  return true;
};

export const updateGallery = async (database: Database, data: Gallery) => {
  const existingGallery = database.galleries.find((x) => x.id === data.id);
  if (!existingGallery) {
    return false;
  }
  database.galleries = database.galleries.filter((x) => x.id !== data.id);
  database.galleries.push(data);
  await writeDatabase(database);
  return data;
};

export const updateGalleryItems = async (
  database: Database,
  data: { galleryId: string; items: Item[] },
) => {
  const existingGallery = database.galleries.find(
    (x) => x.id === data.galleryId,
  );
  if (!existingGallery) {
    return false;
  }
  existingGallery.items = data.items;
  await writeDatabase(database);
  return existingGallery;
};

export const updateGalleryPhoto = async (
  database: Database,
  data: { galleryId: string; photoId: string },
) => {
  const existingGallery = database.galleries.find(
    (x) => x.id === data.galleryId,
  );
  if (!existingGallery) {
    return false;
  }
  const existingItem = existingGallery.items.find((x) => x.id === data.photoId);
  if (!existingItem || existingItem.type !== ItemType.Photo) {
    return false;
  }
  existingGallery.titlePhoto = existingItem;
  database.galleries = database.galleries.filter(
    (x) => x.id !== data.galleryId,
  );

  database.galleries.push(existingGallery);
  await writeDatabase(database);
  return existingGallery;
};

export const deleteGalleryItem = async (
  database: Database,
  data: { galleryId: string; itemId: string },
) => {
  const existingGallery = database.galleries.find(
    (x) => x.id === data.galleryId,
  );
  if (!existingGallery) {
    return false;
  }
  const existingItem = existingGallery.items.find((x) => x.id === data.itemId);
  if (!existingItem) {
    return false;
  }
  if (existingItem.type === ItemType.Photo) {
    await deleteFile(`${data.galleryId}/${IMAGE_THUMB}/${data.itemId}.webp`);
    await deleteFile(`${data.galleryId}/${IMAGE_SM}/${data.itemId}.webp`);
    await deleteFile(`${data.galleryId}/${IMAGE_LG}/${data.itemId}.webp`);
    await deleteFile(`${data.galleryId}/original/${data.itemId}.png`);
  }
  const deletedItemOrder = existingItem.order;
  existingGallery.items = existingGallery.items.filter(
    (x) => x.id !== data.itemId,
  );
  if (
    existingGallery.titlePhoto &&
    existingGallery.titlePhoto.id === data.itemId
  ) {
    existingGallery.titlePhoto = undefined;
  }
  const newItems = [];
  for (let i = 0; i < existingGallery.items.length; i++) {
    const item = existingGallery.items[i];
    if (item.order > deletedItemOrder) {
      item.order = item.order - 1;
    }
    newItems.push(item);
  }
  existingGallery.items = newItems;

  database.galleries = database.galleries.filter(
    (x) => x.id !== data.galleryId,
  );

  database.galleries.push(existingGallery);
  await writeDatabase(database);
  return existingGallery;
};

export const uploadImage = async (
  database: Database,
  galleryId: string,
  filepath: string,
  filename: string,
) => {
  const existingGallery = database.galleries.find((x) => x.id === galleryId);
  if (!existingGallery) {
    return false;
  }
  const id = guidGenerator();
  const input = fs.readFileSync(filepath);
  const imageThumb = await sharp(input)
    .resize(160, 100, { fit: sharp.fit.inside })
    .webp()
    .toBuffer({ resolveWithObject: true });
  const imageSm = await sharp(input)
    .resize(550, 300, { fit: sharp.fit.inside })
    .webp()
    .toBuffer({ resolveWithObject: true });
  const imageLg = await sharp(input)
    .resize(1920, 1080, { fit: sharp.fit.inside })
    .webp()
    .toBuffer({ resolveWithObject: true });
  const bufferOrig = await sharp(input).png().toBuffer();
  await writeFile(`${galleryId}/${IMAGE_THUMB}/${id}.webp`, imageThumb.data);
  await writeFile(`${galleryId}/${IMAGE_SM}/${id}.webp`, imageSm.data);
  await writeFile(`${galleryId}/${IMAGE_LG}/${id}.webp`, imageLg.data);
  await writeFile(`${galleryId}/original/${id}.png`, bufferOrig);
  const metadataThumb = imageThumb.info;
  const metadataSm = imageSm.info;
  const metadataLg = imageLg.info;
  existingGallery.items.push({
    id,
    order: existingGallery.items.length,
    description: {},
    type: ItemType.Photo,
    photo: {
      fileName: filename,
      size: {
        thumbnail: {
          width: metadataThumb.width,
          height: metadataThumb.height,
        },
        sm: {
          width: metadataSm.width,
          height: metadataSm.height,
        },
        lg: {
          width: metadataLg.width,
          height: metadataLg.height,
        },
      },
    },
  });
  await writeDatabase(database);
  return existingGallery;
};

export const addVideo = async (
  database: Database,
  data: { galleryId: string; videoUrl: string; thumbnailUrl: string },
) => {
  const existingGallery = database.galleries.find(
    (x) => x.id === data.galleryId,
  );
  if (!existingGallery) {
    return false;
  }
  const id = guidGenerator();
  existingGallery.items.push({
    id,
    order: existingGallery.items.length,
    description: {},
    type: ItemType.Video,
    video: {
      url: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
    },
  });
  await writeDatabase(database);
  return existingGallery;
};
