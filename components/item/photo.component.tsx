import { Photo } from '../../types/database';
import Image, { ImageProps } from 'next/future/image';
import { useTranslation } from 'next-i18next';

type GalleryPhotoProps = Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height'
> & {
  id: string;
  data?: Photo;
  gallery?: string;
  size: 'thumbnail' | 'sm' | 'lg';
};

export const GalleryPhoto = ({
  id,
  data,
  gallery,
  size,
  ...restProps
}: GalleryPhotoProps) => {
  const { t } = useTranslation('common');
  if (!data) {
    return <div />;
  }
  return (
    <Image
      {...restProps}
      src={`/api/content?gallery=${gallery}&photo=${id}&size=${size}`}
      alt={t('photo-placeholder')}
      width={data.size?.[size].width}
      height={data.size?.[size].height}
      unoptimized
      placeholder='blur'
      blurDataURL={`/api/content?gallery=${gallery}&photo=${id}&size=thumbnail`}
    />
  );
};
