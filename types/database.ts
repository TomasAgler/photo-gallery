export enum ItemType {
  Photo,
  Video,
}

export type Tag = {
  title: string;
};

export type Video = {
  url: string;
  thumbnailUrl: string;
};

export type Photo = {
  fileName: string;
  size: {
    thumbnail: {
      width: number;
      height: number;
    };
    sm: {
      width: number;
      height: number;
    };
    lg: {
      width: number;
      height: number;
    };
  };
};

export type Description = {
  location?: string;
  content?: string;
  tags?: Tag[];
};

export type Item = {
  id: string;
  order: number;
  type: ItemType;
  description: Description;
  photo?: Photo;
  video?: Video;
};

export type Gallery = {
  id: string;
  title?: string;
  description?: string;
  localPassword?: string;
  titlePhoto?: Item;
  items: Item[];
};

export type Database = {
  galleries: Gallery[];
};

export const EmptyDatabase: Database = {
  galleries: [],
};

export const EmptyGallery: Gallery = {
  id: '',
  items: [],
};
