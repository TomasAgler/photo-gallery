import { IMAGE_LG, IMAGE_SM, IMAGE_THUMB } from '../utils/const';
import { loadFile } from './s3';

const storage: {
  name: string;
  gallery: string;
  content: { sm?: Buffer; lg?: Buffer; thumbnail?: Buffer };
}[] = [];

const downloadData = async (
  name: string,
  gallery: string,
  size: number | string,
  extension: string,
) => {
  return loadFile(`${gallery}/${size}/${name}.${extension}`);
};

const storeData = async (name: string, gallery: string) => {
  const contentThumb = await downloadData(name, gallery, IMAGE_THUMB, 'webp');
  const contentSm = await downloadData(name, gallery, IMAGE_SM, 'webp');
  const contentLg = await downloadData(name, gallery, IMAGE_LG, 'webp');
  const newData = {
    name,
    gallery,
    content: { sm: contentSm, lg: contentLg, thumbnail: contentThumb },
  };
  storage.push(newData);
  return newData;
};

export const getObject = async (
  name: string,
  gallery: string,
  size: 'thumbnail' | 'sm' | 'lg' | 'original',
) => {
  if (size === 'original') {
    return await downloadData(name, gallery, 'original', 'png');
  }
  let storedData = storage.find(
    (x) => x.name === name && x.gallery === gallery,
  );
  if (!storedData) {
    storedData = await storeData(name, gallery);
  }
  return storedData.content[size];
};
