import { Dialog, AppBar, Toolbar, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';
import { Item, ItemType } from '../../types/database';
import { GalleryPhoto } from './photo.component';
import {
  ControlWrapper,
  ControlButton,
  GalleryItemWrapper,
} from './photo.style';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useSwipeable } from 'react-swipeable';
import { GalleryVideo } from './video.component';

type ItemDetailProps = {
  item?: Item;
  onClose?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  gallery: string;
};

export const ItemDetail = ({
  item,
  onClose,
  onPrev,
  onNext,
  gallery,
}: ItemDetailProps) => {
  const { t } = useTranslation();
  const handlers = useSwipeable({
    onSwipedRight: () => onPrev && onPrev(),
    onSwipedLeft: () => onNext && onNext(),
  });

  const keyHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (key === 'ArrowLeft') {
      onPrev && onPrev();
    }
    if (key === 'ArrowRight') {
      onNext && onNext();
    }
  };

  return (
    <Dialog
      fullScreen
      onClose={onClose}
      open={Boolean(item)}
      onKeyDown={keyHandler}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Button color='inherit' onClick={onClose}>
            {t('close')}
          </Button>
          <Box sx={{ ml: 2, flex: 1 }} />
          <Link
            href={`/api/download-photo?gallery=${gallery}&photo=${item?.id}`}
          >
            <Button color='inherit'>{t('save')}</Button>
          </Link>
        </Toolbar>
      </AppBar>
      {item && (
        <GalleryItemWrapper {...handlers}>
          {item.type === ItemType.Photo && (
            <GalleryPhoto
              data={item.photo}
              size='lg'
              gallery={gallery}
              id={item.id}
            />
          )}
          {item.type === ItemType.Video && (
            <GalleryVideo data={item.video} size='lg' />
          )}
          <ControlWrapper onClick={onPrev} position='left'>
            <ControlButton>
              <ChevronLeftIcon />
            </ControlButton>
          </ControlWrapper>
          <ControlWrapper onClick={onNext} position='right'>
            <ControlButton>
              <ChevronRightIcon />
            </ControlButton>
          </ControlWrapper>
        </GalleryItemWrapper>
      )}
    </Dialog>
  );
};
