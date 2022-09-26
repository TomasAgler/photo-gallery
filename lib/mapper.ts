import { Gallery } from '../types/database';
import { GalleryDetailDto, GalleryPreviewDto } from '../types/dto';
import { User } from '../types/user';
import { isUserAdmin, isUserAllowed } from '../utils/auth';

export const mapGalleryPreview = (gallery: Gallery, user: User) => {
  const result: GalleryPreviewDto = {
    id: gallery.id,
    description: gallery.description,
    title: gallery.title,
  };
  if (gallery.titlePhoto && isUserAllowed(user, gallery.id)) {
    result.titlePhoto = gallery.titlePhoto;
  }
  return result;
};

export const mapGalleryDetail = (gallery: Gallery, user: User) => {
  const result: GalleryDetailDto = {
    id: gallery.id,
    description: gallery.description,
    title: gallery.title,
  };
  if (isUserAdmin(user)) {
    result.localPassword = gallery.localPassword;
  }
  if (isUserAllowed(user, gallery.id)) {
    if (gallery.titlePhoto) {
      result.titlePhoto = gallery.titlePhoto;
    }
    result.items = gallery.items;
  }
  return result;
};
