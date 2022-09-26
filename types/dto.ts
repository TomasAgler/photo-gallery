import { Item } from './database';

export type GalleryPreviewDto = {
  id: string;
  title?: string;
  description?: string;
  titlePhoto?: Item;
};

export type GalleryDetailDto = {
  id: string;
  title?: string;
  description?: string;
  titlePhoto?: Item;
  localPassword?: string;
  items?: Item[];
};

export const EmptyGalleryDetailDto: GalleryDetailDto = {
  id: '',
  items: [],
};
