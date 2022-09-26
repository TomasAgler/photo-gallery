import { useState } from 'react';
import { Item } from '../../types/database';
import { ItemDetail } from '../item/item-detail.component';
import { GalleryItem } from '../item/item.component';
import { ItemListStyle } from './item-list.style';

type ItemListProps = JSX.IntrinsicElements['div'] & {
  gallery: string;
  items: Item[];
};
export const ItemList = ({ items, gallery }: ItemListProps) => {
  const [highlightItem, setHighlightItem] = useState<Item | undefined>(
    undefined,
  );

  const highlightHandler = (id: string) => {
    if (Boolean(highlightItem)) {
      return;
    }
    const item = items.find((x) => x.id === id);
    setHighlightItem(item);
  };

  const handleLocalClose = () => {
    setHighlightItem(undefined);
  };

  const handleNext = () => {
    if (!highlightItem) {
      return;
    }
    const nextOrder =
      highlightItem.order + 1 >= items.length ? 0 : highlightItem.order + 1;
    const item = items.find((x) => x.order === nextOrder);
    setHighlightItem(item);
  };

  const handlePrev = () => {
    if (!highlightItem) {
      return;
    }
    const nextOrder =
      highlightItem.order - 1 < 0 ? items.length - 1 : highlightItem.order - 1;
    const item = items.find((x) => x.order === nextOrder);
    setHighlightItem(item);
  };

  return (
    <ItemListStyle>
      <ItemDetail
        onClose={handleLocalClose}
        onNext={handleNext}
        onPrev={handlePrev}
        item={highlightItem}
        gallery={gallery}
      />
      {items &&
        items.map((x) => (
          <GalleryItem
            key={x.id}
            item={x}
            size='sm'
            gallery={gallery}
            onClick={() => highlightHandler(x.id)}
          />
        ))}
    </ItemListStyle>
  );
};
