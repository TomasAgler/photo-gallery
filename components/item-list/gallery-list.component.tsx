import { GalleryPreviewDto } from '../../types/dto';
import { GalleryPreview } from '../preview/preview';
import { ItemListStyle } from './item-list.style';

type GalleryListProps = {
  galleries?: GalleryPreviewDto[];
};

export const GalleryList = ({ galleries }: GalleryListProps) => {
  return (
    <ItemListStyle>
      {galleries &&
        galleries.map((x) => <GalleryPreview key={x.id} data={x} />)}
    </ItemListStyle>
  );
};
