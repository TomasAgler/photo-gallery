import { IMAGE_LG, IMAGE_SM, IMAGE_THUMB } from '../utils/const';
import { loadFile } from './s3';

const storage: {
  id: string;
  gallery: string;
  content: { sm?: Buffer; lg?: Buffer; thumbnail?: Buffer };
}[] = [];

const downloadData = async (
  id: string,
  gallery: string,
  size: number | string,
  extension: string,
) => {
  return loadFile(`${gallery}/${size}/${id}.${extension}`);
};

const storeData = async (id: string, gallery: string) => {
  const contentThumb = await downloadData(id, gallery, IMAGE_THUMB, 'webp');
  const contentSm = await downloadData(id, gallery, IMAGE_SM, 'webp');
  const contentLg = await downloadData(id, gallery, IMAGE_LG, 'webp');
  const newData = {
    id,
    gallery,
    content: { sm: contentSm, lg: contentLg, thumbnail: contentThumb },
  };
  storage.push(newData);
  return newData;
};

export const getObject = async (
  id: string,
  gallery: string,
  size: 'thumbnail' | 'sm' | 'lg' | 'original',
) => {
  if (size === 'original') {
    return await downloadData(id, gallery, 'original', 'jpg');
  }
  let storedData = storage.find((x) => x.id === id && x.gallery === gallery);
  if (!storedData) {
    storedData = await storeData(id, gallery);
  }
  return storedData.content[size];
};
