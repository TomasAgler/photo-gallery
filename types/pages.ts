import { Photo } from './database';
import { GalleryDetailDto, GalleryPreviewDto } from './dto';
import { User } from './user';

export type CustomProps = {
  galleryList?: GalleryPreviewDto[];
  user?: User;
  gallery?: GalleryDetailDto;
  requestAuth?: boolean;
};
