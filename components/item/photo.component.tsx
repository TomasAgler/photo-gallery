import { useState } from 'react';
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { t } = useTranslation('common');
  if (!data) {
    return <div />;
  }
  return (
    <Image
      {...restProps}
      src={`/api/content?gallery=${gallery}&photo=${id}&size=${size}`}
      alt={t('photo-placeholder')}
      width={dimensions.width}
      height={dimensions.height}
      unoptimized
      placeholder='empty'
      onLoadingComplete={() =>
        setDimensions({
          width: data.size?.[size].width,
          height: data.size?.[size].height,
        })
      }
      style={{
        transition: 'width 0.05s ease-out',
      }}
    />
  );
};
