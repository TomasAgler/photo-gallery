import React, { useState } from 'react';
import Axios from 'axios';
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { GalleryDetailDto } from '../../types/dto';
import { useRouter } from 'next/router';
import {
  FormWrapper,
  GalleryEditorWrapper,
  HeaderWrapper,
  TitlePhoto,
} from './gallery.style';
import { Item, ItemType } from '../../types/database';
import { GalleryPhoto } from '../item/photo.component';
import { GalleryVideo } from '../item/video.component';

type GalleryFormProps = {
  data: GalleryDetailDto;
  isNew?: boolean;
};

export const GalleryForm = ({ data, isNew }: GalleryFormProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formData, setFormData] = useState(data);
  const [videoDialog, setVideoDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    Axios.post(`/api/admin/${isNew ? 'new' : 'update'}`, formData).then(
      (result) => {
        if (isNew) {
          router.push(`/admin/${result.data.id}`);
        } else {
          setFormData(result.data);
          setLoading(false);
        }
      },
    );
  };

  const handleTitlePhoto = (photoId: string) => {
    setLoading(true);
    Axios.post(`/api/admin/title`, { galleryId: formData.id, photoId }).then(
      (result) => {
        setFormData(result.data);
        setLoading(false);
      },
    );
  };
  const uploadContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (!event.target.files) {
      return;
    }
    setLoading(true);
    const body = new FormData();
    body.append('gallery', formData.id);
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      body.append('file', file);
    }
    console.log(body);
    Axios.post('/api/admin/upload', body).then((result) => {
      setFormData(result.data);
      setLoading(false);
    });
  };

  const addVideo = () => {
    setVideoDialog(false);
    setLoading(true);
    Axios.post('/api/admin/add-video', {
      galleryId: formData.id,
      videoUrl,
      thumbnailUrl,
    }).then((result) => {
      setFormData(result.data);

      setLoading(false);
    });
  };

  const updateItems = (items: Item[]) => {
    setLoading(true);
    Axios.post('/api/admin/update-items', {
      galleryId: formData.id,
      items,
    }).then((result) => {
      setFormData(result.data);
      setLoading(false);
    });
  };

  const moveUp = (id: string) => {
    if (!formData.items) {
      return;
    }
    const item = formData.items.find((x) => x.id === id);
    if (!item) {
      return;
    }
    const prevItem = formData.items.find((x) => x.order === item.order - 1);
    if (!prevItem) {
      return;
    }
    let newItems = [...formData.items];
    newItems = newItems.filter((x) => x.id !== item.id && x.id !== prevItem.id);
    newItems.push({ ...item, order: prevItem.order });
    newItems.push({ ...prevItem, order: item.order });
    updateItems(newItems.sort((x, y) => x.order - y.order));
  };
  const moveDown = (id: string) => {
    if (!formData.items) {
      return;
    }
    const item = formData.items.find((x) => x.id === id);
    if (!item) {
      return;
    }
    const nextItem = formData.items.find((x) => x.order === item.order + 1);
    if (!nextItem) {
      return;
    }
    let newItems = [...formData.items];
    newItems = newItems.filter((x) => x.id !== item.id && x.id !== nextItem.id);
    newItems.push({ ...item, order: nextItem.order });
    newItems.push({ ...nextItem, order: item.order });
    updateItems(newItems.sort((x, y) => x.order - y.order));
  };
  const moveTop = (id: string) => {
    if (!formData.items) {
      return;
    }
    const selectItem = formData.items.find((x) => x.id === id);
    if (!selectItem) {
      return;
    }
    let newItems = [{ ...selectItem, order: 0 }];
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (item.id === id) {
        continue;
      }
      if (selectItem.order > i) {
        newItems.push({ ...item, order: item.order + 1 });
      } else {
        newItems.push(item);
      }
    }
    updateItems(newItems.sort((x, y) => x.order - y.order));
  };
  const moveBottom = (id: string) => {
    if (!formData.items) {
      return;
    }
    const selectItem = formData.items.find((x) => x.id === id);
    if (!selectItem) {
      return;
    }
    let newItems = [{ ...selectItem, order: formData.items.length - 1 }];
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (item.id === id) {
        continue;
      }
      if (selectItem.order < i) {
        newItems.push({ ...item, order: item.order - 1 });
      } else {
        newItems.push(item);
      }
    }
    updateItems(newItems.sort((x, y) => x.order - y.order));
  };
  const deleteItem = (id: string) => {
    setLoading(true);
    Axios.post('/api/admin/delete-item', {
      galleryId: formData.id,
      itemId: id,
    }).then((result) => {
      setFormData(result.data);
      setLoading(false);
    });
  };
  return (
    <GalleryEditorWrapper>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Dialog onClose={() => setVideoDialog(false)} open={videoDialog}>
        <DialogTitle>{t('upload-video')}</DialogTitle>
        <DialogContent>
          <TextField
            id='video-url'
            label={t('video-url')}
            variant='outlined'
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            fullWidth
          />
          <TextField
            id='thumbnail-url'
            label={t('thumbnail-url')}
            variant='outlined'
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addVideo}>{t('upload-video')}</Button>
        </DialogActions>
      </Dialog>
      <HeaderWrapper>
        <form onSubmit={handleSubmit}>
          <h2>{t('gallery-data')}</h2>
          <FormWrapper>
            <TextField
              id='id'
              label={t('gallery-id')}
              variant='outlined'
              value={formData.id}
              onChange={(evt) =>
                setFormData({ ...formData, id: evt.target.value })
              }
              disabled={!isNew}
            />
            <TextField
              id='title'
              label={t('gallery-title')}
              variant='outlined'
              value={formData.title}
              onChange={(evt) =>
                setFormData({ ...formData, title: evt.target.value })
              }
            />
            <TextField
              id='description'
              label={t('gallery-description')}
              variant='outlined'
              value={formData.description}
              onChange={(evt) =>
                setFormData({ ...formData, description: evt.target.value })
              }
            />
            <TextField
              id='local-password'
              label={t('gallery-password')}
              variant='outlined'
              value={formData.localPassword}
              onChange={(evt) =>
                setFormData({ ...formData, localPassword: evt.target.value })
              }
            />
            <Button type='submit'>{t('submit')}</Button>
          </FormWrapper>
        </form>
        <TitlePhoto>
          <h2>{t('title-photo')}</h2>
          {!isNew &&
            formData.titlePhoto &&
            formData.titlePhoto.type === ItemType.Photo && (
              <GalleryPhoto
                id={formData.titlePhoto.id}
                data={formData.titlePhoto.photo}
                gallery={formData.id}
                size='sm'
              />
            )}
        </TitlePhoto>
      </HeaderWrapper>
      {!isNew && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('order')}</TableCell>
              <TableCell>{t('item')}</TableCell>
              <TableCell>{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData.items &&
              formData.items.map((item) => {
                const isTitle =
                  formData.titlePhoto && formData.titlePhoto.id === item.id;
                const isFirst = item.order === 0;
                const isLast = item.order === (formData.items?.length || 0) - 1;
                return (
                  <TableRow key={`item-${item.order}`}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      {item.type === ItemType.Photo && (
                        <GalleryPhoto
                          id={item.id}
                          data={item.photo}
                          gallery={formData.id}
                          size='thumbnail'
                        />
                      )}
                      {item.type === ItemType.Video && (
                        <GalleryVideo data={item.video} size='thumbnail' />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => handleTitlePhoto(item.id)}
                        disabled={isTitle}
                      >
                        {t('make-title')}
                      </Button>
                      <Button
                        variant='contained'
                        onClick={() => moveUp(item.id)}
                        disabled={isFirst}
                      >
                        {t('move-up')}
                      </Button>
                      <Button
                        variant='contained'
                        onClick={() => moveDown(item.id)}
                        disabled={isLast}
                      >
                        {t('move-down')}
                      </Button>
                      <Button
                        variant='contained'
                        onClick={() => moveTop(item.id)}
                        disabled={isFirst}
                      >
                        {t('move-top')}
                      </Button>

                      <Button
                        variant='contained'
                        onClick={() => moveBottom(item.id)}
                        disabled={isLast}
                      >
                        {t('move-bottom')}
                      </Button>
                      <Button
                        variant='contained'
                        onClick={() => deleteItem(item.id)}
                      >
                        {t('delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Button variant='contained' component='label'>
                  {t('upload-photo')}
                  <input
                    hidden
                    accept='image/*'
                    multiple
                    type='file'
                    onChange={uploadContent}
                  />
                </Button>
                <Button
                  variant='contained'
                  component='label'
                  onClick={() => setVideoDialog(true)}
                >
                  {t('upload-video')}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </GalleryEditorWrapper>
  );
};
