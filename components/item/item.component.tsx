import { Item, ItemType } from '../../types/database';
import { useTranslation } from 'next-i18next';
import { ItemWrapper } from './photo.style';
import { GalleryPhoto } from './photo.component';
import { GalleryVideo } from './video.component';

type ItemProps = {
  item?: Item;
  gallery?: string;
  size: 'sm' | 'lg';
  onClick?: () => void;
};

export const GalleryItem = ({ item, gallery, size, onClick }: ItemProps) => {
  const { t } = useTranslation('common');
  return (
    <ItemWrapper onClick={onClick}>
      {item && item.type === ItemType.Photo && (
        <GalleryPhoto
          data={item.photo}
          id={item.id}
          gallery={gallery}
          size={size}
        />
      )}
      {item && item.type === ItemType.Video && (
        <GalleryVideo data={item.video} size={size} />
      )}
      {!item && <div>{t('item-not-available')}</div>}
    </ItemWrapper>
  );
};
