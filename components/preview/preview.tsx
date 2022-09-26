import Link from 'next/link';
import { GalleryPreviewDto } from '../../types/dto';
import { GalleryPhoto } from '../item/photo.component';
import { GalleryPreviewTitle, GalleryPreviewWrapper } from './preview.style';

type GalleryPreviewProps = {
  data: GalleryPreviewDto;
};

export const GalleryPreview = ({ data }: GalleryPreviewProps) => {
  return (
    <Link href={`/gallery/${data.id}`}>
      <GalleryPreviewWrapper>
        {data.titlePhoto && (
          <GalleryPhoto
            data={data.titlePhoto.photo}
            id={data.titlePhoto.id}
            gallery={data.id}
            size='sm'
          />
        )}
        {data.title && <GalleryPreviewTitle>{data.title}</GalleryPreviewTitle>}
      </GalleryPreviewWrapper>
    </Link>
  );
};
